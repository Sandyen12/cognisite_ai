# CogniSite AI

An AI-powered platform that analyzes any live website, understands its structure, and engages users in guided conversations to automatically generate high-quality, context-aware content for every section.

## 🚀 Features

### Core Functionality
- **AI Website Analyzer**: Automatically scans and parses website HTML to identify key sections
- **Guided Conversational AI**: Context-aware conversations tailored to specific section types
- **Content Generation**: Professional, ready-to-use copy for each website section
- **Project Management**: Save and manage multiple website projects

### User Experience
- **Landing Page**: Clean, modern homepage with prominent URL input
- **Analysis Loading**: Dynamic progress indicators during website analysis
- **Project Workspace**: Two-column interface with site structure navigator and AI chat
- **Dashboard**: Project management with usage statistics

### Authentication & Subscription
- **User Authentication**: Secure sign-up/sign-in with Supabase
- **Freemium Model**: Free tier with limitations, premium upgrade via Stripe
- **Project Saving**: Anonymous users can try once, authenticated users can save projects

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 for analysis and content generation
- **Payments**: Stripe for premium subscriptions
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for premium features)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cognisite-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the `.env.local` file and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Update the following variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (for premium features)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Database Setup

#### Create Supabase Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'analyzing',
  sections JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_content table
CREATE TABLE project_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  content TEXT,
  conversation_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own project content" ON project_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_content.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own project content" ON project_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_content.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own project content" ON project_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_content.project_id 
      AND projects.user_id = auth.uid()
    )
  );
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── analyze/       # Website analysis API
│   │   ├── chat/          # AI conversation API
│   │   └── projects/      # Project management API
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── analyze/           # Analysis loading page
│   ├── project/           # Project workspace
│   ├── dashboard/         # User dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── components/            # Reusable components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Get your project URL and API keys from Settings > API
3. Update your `.env.local` file with the credentials
4. Run the database setup SQL in the SQL editor

### OpenAI Setup

1. Create an OpenAI account and get an API key
2. Add the API key to your `.env.local` file
3. Ensure you have sufficient credits for API calls

### Stripe Setup (Optional)

1. Create a Stripe account
2. Get your publishable and secret keys
3. Add them to your `.env.local` file
4. Configure webhook endpoints for subscription management

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Usage

### Free Tier
- 1 saved project
- Analysis of up to 3 pages per site
- Limited AI content generations per month

### Premium Tier
- Unlimited projects
- Full multi-page site analysis
- Priority support
- Access to advanced AI models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact support at support@cognisite.ai

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced AI models for premium users
- [ ] Content export to various formats
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app development

---

Built with ❤️ by the CogniSite AI team
