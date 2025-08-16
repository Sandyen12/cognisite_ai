-- Location: supabase/migrations/20250116021500_website_analysis_platform.sql
-- Schema Analysis: Fresh project with no existing database tables
-- Integration Type: Complete schema for website analysis platform
-- Dependencies: Creating all tables from scratch

-- 1. Create custom types
CREATE TYPE public.analysis_status AS ENUM ('pending', 'analyzing', 'in-progress', 'completed', 'failed', 'error');
CREATE TYPE public.user_tier AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE public.section_status AS ENUM ('pending', 'in-progress', 'completed', 'failed');

-- 2. Create user profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    tier public.user_tier DEFAULT 'free'::public.user_tier,
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER DEFAULT 5,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create projects table for website analysis projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    status public.analysis_status DEFAULT 'pending'::public.analysis_status,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    screenshot_url TEXT,
    sections_count INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create website sections table
CREATE TABLE public.website_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    page TEXT NOT NULL,
    status public.section_status DEFAULT 'pending'::public.section_status,
    description TEXT,
    word_count INTEGER DEFAULT 0,
    content TEXT,
    ai_generated_content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create chat messages table for AI interactions
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.website_sections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_user_message BOOLEAN DEFAULT true,
    suggestions JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create generated content table
CREATE TABLE public.generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.website_sections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    formatted_content TEXT,
    word_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create user statistics table
CREATE TABLE public.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    total_projects INTEGER DEFAULT 0,
    completed_analyses INTEGER DEFAULT 0,
    ai_generations INTEGER DEFAULT 0,
    recent_activity INTEGER DEFAULT 0,
    activity_trend TEXT DEFAULT 'neutral',
    activity_change INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);
CREATE INDEX idx_website_sections_project_id ON public.website_sections(project_id);
CREATE INDEX idx_website_sections_status ON public.website_sections(status);
CREATE INDEX idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX idx_chat_messages_section_id ON public.chat_messages(section_id);
CREATE INDEX idx_generated_content_section_id ON public.generated_content(section_id);
CREATE INDEX idx_user_statistics_user_id ON public.user_statistics(user_id);

-- 9. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- 10. Create functions (BEFORE RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, tier)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tier', 'free')::public.user_tier
  );
  
  -- Create initial user statistics
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Function to update project progress
CREATE OR REPLACE FUNCTION public.update_project_progress()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    total_sections INTEGER;
    completed_sections INTEGER;
    new_progress INTEGER;
BEGIN
    -- Count total and completed sections for the project
    SELECT COUNT(*) INTO total_sections
    FROM public.website_sections
    WHERE project_id = NEW.project_id;
    
    SELECT COUNT(*) INTO completed_sections
    FROM public.website_sections
    WHERE project_id = NEW.project_id AND status = 'completed'::public.section_status;
    
    -- Calculate progress percentage
    IF total_sections > 0 THEN
        new_progress := (completed_sections * 100) / total_sections;
    ELSE
        new_progress := 0;
    END IF;
    
    -- Update project progress and status
    UPDATE public.projects
    SET 
        progress = new_progress,
        sections_count = total_sections,
        status = CASE 
            WHEN new_progress = 100 THEN 'completed'::public.analysis_status
            WHEN new_progress > 0 THEN 'in-progress'::public.analysis_status
            ELSE 'pending'::public.analysis_status
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.project_id;
    
    RETURN NEW;
END;
$$;

-- Function to update user statistics
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update user statistics when project status changes to completed
    IF NEW.status = 'completed'::public.analysis_status AND OLD.status != 'completed'::public.analysis_status THEN
        UPDATE public.user_statistics
        SET 
            total_projects = (
                SELECT COUNT(*) FROM public.projects 
                WHERE owner_id = NEW.owner_id
            ),
            completed_analyses = (
                SELECT COUNT(*) FROM public.projects 
                WHERE owner_id = NEW.owner_id AND status = 'completed'::public.analysis_status
            ),
            ai_generations = (
                SELECT COUNT(*) FROM public.generated_content 
                WHERE user_id = NEW.owner_id
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.owner_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 11. Create RLS policies using Pattern 1 and Pattern 2
-- Pattern 1: Core user table - simple ownership
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for other tables
CREATE POLICY "users_manage_own_projects"
ON public.projects
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "users_access_project_sections"
ON public.website_sections
FOR ALL
TO authenticated
USING (
    project_id IN (
        SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_chat_messages"
ON public.chat_messages
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_generated_content"
ON public.generated_content
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_own_statistics"
ON public.user_statistics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 12. Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_section_status_change
    AFTER UPDATE ON public.website_sections
    FOR EACH ROW 
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_project_progress();

CREATE TRIGGER on_project_completed
    AFTER UPDATE ON public.projects
    FOR EACH ROW 
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_user_statistics();

-- 13. Create mock data with complete auth users
DO $$
DECLARE
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
    project1_id UUID := gen_random_uuid();
    project2_id UUID := gen_random_uuid();
    section1_id UUID := gen_random_uuid();
    section2_id UUID := gen_random_uuid();
    section3_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john.doe@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "tier": "premium"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'jane.smith@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane Smith", "tier": "free"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create projects
    INSERT INTO public.projects (id, name, url, status, owner_id, screenshot_url, sections_count, progress) VALUES
        (project1_id, 'E-commerce Store Analysis', 'https://shopify-example.com', 'completed'::public.analysis_status, user1_id, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', 8, 100),
        (project2_id, 'Corporate Website Analysis', 'https://company-site.com', 'in-progress'::public.analysis_status, user1_id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', 6, 65);

    -- Create website sections
    INSERT INTO public.website_sections (id, project_id, name, page, status, description, word_count, content) VALUES
        (section1_id, project1_id, 'Hero Section', 'Homepage', 'completed'::public.section_status, 'Main headline and value proposition', 45, 'Transform Your Business with Our Revolutionary Solution'),
        (section2_id, project1_id, 'Product Features', 'Homepage', 'completed'::public.section_status, 'Key product benefits and features', 120, 'Lightning-Fast Performance, Smart Analytics, Enterprise Security'),
        (section3_id, project2_id, 'About Us', '/about', 'in-progress'::public.section_status, 'Company story and mission', 80, 'Founded in 2020, we are passionate innovators...');

    -- Create sample chat messages
    INSERT INTO public.chat_messages (project_id, section_id, user_id, content, is_user_message, suggestions) VALUES
        (project1_id, section1_id, user1_id, 'Generate compelling hero section content', true, null),
        (project1_id, section1_id, user1_id, 'I will help you create compelling content for the Hero Section that captures attention and drives action.', false, '["Make it more compelling", "Add urgency elements", "Focus on main benefit"]'::jsonb);

    -- Create generated content
    INSERT INTO public.generated_content (section_id, user_id, content, formatted_content, word_count, metadata) VALUES
        (section1_id, user1_id, 
         'Transform Your Business with Our Revolutionary Solution. Discover how thousands of companies have increased productivity by 300%.',
         '<h1>Transform Your Business with Our Revolutionary Solution</h1><p>Discover how thousands of companies have increased productivity by 300%.</p>',
         45, 
         '{"tone": "Professional", "target_audience": "Business owners", "generated_at": "2025-01-16T02:15:00Z"}'::jsonb);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 14. Create cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs to delete
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com';

    -- Delete in dependency order
    DELETE FROM public.generated_content WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.chat_messages WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.website_sections WHERE project_id IN (
        SELECT id FROM public.projects WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.projects WHERE owner_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_statistics WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END $$;