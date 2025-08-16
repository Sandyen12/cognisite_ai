import { supabase } from '../lib/supabase';

export const projectService = {
  // Get all projects for current user
  async getUserProjects() {
    try {
      const { data, error } = await supabase?.from('projects')?.select(`
          *,
          website_sections (
            id,
            name,
            status
          )
        `)?.order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching projects:', error)
      throw error
    }
  },

  // Create new project
  async createProject(projectData) {
    try {
      const { data, error } = await supabase?.from('projects')?.insert([{
          name: projectData?.name,
          url: projectData?.url,
          status: 'analyzing',
          analysis_data: projectData?.analysis_data || null
        }])?.select()?.single()
      
      if (error) throw error

      // Create website sections based on analysis results or defaults
      let sectionsToInsert;
      
      if (projectData?.analysis_data?.sections) {
        // Use sections from analysis results
        sectionsToInsert = projectData?.analysis_data?.sections?.map(section => ({
          name: section?.name,
          page: section?.page,
          description: section?.description,
          status: section?.detected ? 'detected' : 'suggested',
          priority: section?.priority || 'medium',
          project_id: data?.id
        }));
      } else {
        // Use default sections
        const defaultSections = [
          { name: 'Hero Section', page: 'Homepage', description: 'Main headline and value proposition', priority: 'high' },
          { name: 'About Us', page: '/about', description: 'Company story and mission', priority: 'high' },
          { name: 'Services/Products', page: 'Homepage', description: 'Key offerings and benefits', priority: 'high' },
          { name: 'Contact Information', page: '/contact', description: 'Contact details and form', priority: 'medium' },
          { name: 'Testimonials', page: 'Homepage', description: 'Customer reviews and social proof', priority: 'medium' },
          { name: 'Footer', page: 'All pages', description: 'Links, copyright, and additional info', priority: 'low' }
        ];

        sectionsToInsert = defaultSections?.map(section => ({
          ...section,
          status: 'suggested',
          project_id: data?.id
        }));
      }

      await supabase?.from('website_sections')?.insert(sectionsToInsert)

      return data
    } catch (error) {
      console.log('Error creating project:', error)
      throw error
    }
  },

  // Update project
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase?.from('projects')?.update(updates)?.eq('id', projectId)?.select()?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error updating project:', error)
      throw error
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      const { error } = await supabase?.from('projects')?.delete()?.eq('id', projectId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.log('Error deleting project:', error)
      throw error
    }
  },

  // Get project with sections
  async getProjectWithSections(projectId) {
    try {
      const { data, error } = await supabase?.from('projects')?.select(`
          *,
          website_sections (
            id,
            name,
            page,
            status,
            description,
            word_count,
            content,
            ai_generated_content,
            created_at,
            updated_at
          )
        `)?.eq('id', projectId)?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error fetching project with sections:', error)
      throw error
    }
  },

  // Update section status and content
  async updateSection(sectionId, updates) {
    try {
      const { data, error } = await supabase?.from('website_sections')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', sectionId)?.select()?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error updating section:', error)
      throw error
    }
  },

  // Bulk delete projects
  async deleteProjects(projectIds) {
    try {
      const { error } = await supabase?.from('projects')?.delete()?.in('id', projectIds)
      
      if (error) throw error
      return true
    } catch (error) {
      console.log('Error deleting projects:', error)
      throw error
    }
  },

  // Get user statistics
  async getUserStatistics() {
    try {
      const { data, error } = await supabase?.from('user_statistics')?.select('*')?.single()
      
      if (error && error?.code === 'PGRST116') {
        // No statistics found, return default
        return {
          total_projects: 0,
          completed_analyses: 0,
          ai_generations: 0,
          recent_activity: 0,
          activity_trend: 'neutral',
          activity_change: 0
        }
      }
      
      if (error) throw error
      return data || {}
    } catch (error) {
      console.log('Error fetching user statistics:', error)
      // Return default stats on error
      return {
        total_projects: 0,
        completed_analyses: 0,
        ai_generations: 0,
        recent_activity: 0,
        activity_trend: 'neutral',
        activity_change: 0
      }
    }
  },

  // Real website analysis using the new service
  async analyzeWebsite(url) {
    try {
      // Import the analysis service
      const { default: websiteAnalysisService } = await import('./websiteAnalysisService');
      
      // Run the actual analysis
      const results = await websiteAnalysisService?.analyzeWebsite(url);
      
      return {
        success: true,
        ...results
      };
    } catch (error) {
      console.log('Error analyzing website:', error);
      return {
        success: false,
        error: error?.message || 'Failed to analyze website. Please check the URL and try again.'
      };
    }
  }
}

export default projectService