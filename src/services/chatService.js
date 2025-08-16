import { supabase } from '../lib/supabase';
import { generateChatResponse, generateSectionContent } from '../lib/openai';

export const chatService = {
  // Get chat messages for a section
  async getChatMessages(projectId, sectionId = null) {
    try {
      let query = supabase?.from('chat_messages')?.select('*')?.eq('project_id', projectId)?.order('created_at', { ascending: true })
      
      if (sectionId) {
        query = query?.eq('section_id', sectionId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Error fetching chat messages:', error)
      throw error
    }
  },

  // Send user message
  async sendMessage(projectId, sectionId, content, userId) {
    try {
      const { data, error } = await supabase?.from('chat_messages')?.insert([{
          project_id: projectId,
          section_id: sectionId,
          user_id: userId,
          content,
          is_user_message: true
        }])?.select()?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error sending message:', error)
      throw error
    }
  },

  // Generate AI response using OpenAI
  async generateAIResponse(userMessage, section) {
    try {
      // Use OpenAI to generate actual AI response
      const response = await generateChatResponse(userMessage, section);
      return response;
    } catch (error) {
      console.log('Error generating AI response:', error);
      
      // Fallback to basic response if OpenAI fails
      const fallbackResponses = [
        `I'll help you create compelling content for the "${section?.name}" section. Let me analyze your requirements and generate something that aligns with your brand voice and target audience.`,
        `Great choice! The "${section?.name}" section is crucial for user engagement. I'll craft content that captures attention and drives action.`,
        `Perfect! I'm generating optimized content for "${section?.name}" that will resonate with your visitors and improve conversion rates.`,
        `Excellent! Let me create content for "${section?.name}" that balances creativity with strategic messaging to achieve your business goals.`
      ];

      const suggestions = this.getSuggestionsForSection(section);
      
      return {
        content: fallbackResponses?.[Math.floor(Math.random() * fallbackResponses?.length)],
        suggestions
      };
    }
  },

  // Save AI response to database
  async saveAIResponse(projectId, sectionId, userId, content, suggestions = null) {
    try {
      const { data, error } = await supabase?.from('chat_messages')?.insert([{
          project_id: projectId,
          section_id: sectionId,
          user_id: userId,
          content,
          is_user_message: false,
          suggestions: suggestions ? JSON.stringify(suggestions) : null
        }])?.select()?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error saving AI response:', error)
      throw error
    }
  },

  // Generate content for section using OpenAI
  async generateContent(sectionId, prompt, userId) {
    try {
      // Get section details to provide context to OpenAI
      const { data: sectionData, error: sectionError } = await supabase
        ?.from('website_sections')
        ?.select('*')
        ?.eq('id', sectionId)
        ?.single();
        
      if (sectionError) throw sectionError;
      
      // Use OpenAI to generate actual content
      const generatedContent = await generateSectionContent(sectionData, prompt);
      
      // Save to database
      const { data, error } = await supabase?.from('generated_content')?.insert([{
          section_id: sectionId,
          user_id: userId,
          content: generatedContent?.text,
          formatted_content: generatedContent?.formattedText,
          word_count: generatedContent?.wordCount,
          metadata: generatedContent?.metadata
        }])?.select()?.single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error generating content:', error);
      
      // Fallback content generation
      const mockContent = this.generateMockContent(sectionId, prompt);
      
      try {
        const { data, error } = await supabase?.from('generated_content')?.insert([{
            section_id: sectionId,
            user_id: userId,
            content: mockContent?.text,
            formatted_content: mockContent?.formattedText,
            word_count: mockContent?.wordCount,
            metadata: {
              ...mockContent?.metadata,
              note: 'Fallback content - check OpenAI API configuration'
            }
          }])?.select()?.single()
        
        if (error) throw error
        return data
      } catch (fallbackError) {
        console.log('Error saving fallback content:', fallbackError);
        throw fallbackError;
      }
    }
  },

  // Get generated content for section
  async getGeneratedContent(sectionId) {
    try {
      const { data, error } = await supabase?.from('generated_content')?.select('*')?.eq('section_id', sectionId)?.order('created_at', { ascending: false })?.limit(1)?.single()
      
      if (error && error?.code === 'PGRST116') {
        // No content found
        return null
      }
      
      if (error) throw error
      return data
    } catch (error) {
      console.log('Error fetching generated content:', error)
      return null
    }
  },

  // Helper function to get suggestions for section
  getSuggestionsForSection(section) {
    if (!section) return []

    const suggestionMap = {
      'Hero Section': [
        'Create a compelling headline that captures attention',
        'Add urgency and scarcity elements to drive action',
        'Focus on the main benefit for customers'
      ],
      'Product Features': [
        'Highlight unique selling points and differentiators',
        'Add social proof and customer testimonials',
        'Create benefit-focused descriptions rather than features'
      ],
      'About Us': [
        'Tell your unique company story and mission',
        'Emphasize your values and what sets you apart',
        'Add team credibility and expertise'
      ],
      'Testimonials': [
        'Create authentic customer success stories',
        'Add specific results and measurable outcomes',
        'Include diverse customer perspectives'
      ],
      'Contact Information': [
        'Make contact methods prominent and accessible',
        'Add location, hours, and response information',
        'Include multiple ways to get in touch'
      ],
      'Services/Products': [
        'Highlight key benefits over features',
        'Add pricing or value information',
        'Include comparison elements with competitors'
      ]
    }

    return suggestionMap?.[section?.name] || [
      'Make it more engaging and compelling',
      'Add clear call-to-action elements',
      'Optimize for better conversions'
    ];
  },

  // Fallback mock content generation (kept as backup)
  generateMockContent(sectionId, prompt) {
    const contentExamples = {
      'Hero Section': `Transform Your Business with Our Revolutionary Solution\n\nDiscover how thousands of companies have increased their productivity by 300% using our cutting-edge platform. Join the success story today and experience the difference that innovation makes.\n\nGet started with your free trial and see results in just 24 hours.`,
      
      'About Us': `Founded in 2020, we're a team of passionate innovators dedicated to transforming how businesses operate in the digital age.\n\nOur mission is simple: empower every organization with the tools they need to thrive in an increasingly connected world. With over 50,000 satisfied customers across 40 countries, we're proud to be leading the charge in digital transformation.\n\nOur values of innovation, integrity, and customer success guide everything we do.`,
      
      'Services/Products': `🚀 Lightning-Fast Performance\nExperience blazing-fast load times and seamless user interactions that keep your customers engaged.\n\n💡 Smart Analytics Dashboard\nGain valuable insights with our intuitive analytics that help you make data-driven decisions.\n\n🔒 Enterprise-Grade Security\nYour data is protected with bank-level encryption and compliance with industry standards.`,
      
      'Testimonials': `"This platform completely transformed our workflow. We've seen a 250% increase in productivity since implementation." - Sarah Johnson, CEO of TechCorp\n\n"The customer support is exceptional, and the results speak for themselves. Highly recommended!" - Michael Chen, Operations Director\n\n"Finally, a solution that actually delivers on its promises. Our team loves using it every day." - Emma Rodriguez, Project Manager`
    }
    
    const defaultContent = `Professional content for your website section. This engaging content is designed to capture attention and drive user action. Please configure your OpenAI API key to generate custom content tailored to your specific needs and brand voice.`
    
    const text = contentExamples?.['Hero Section'] || defaultContent
    const formattedText = text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')?.replace(/🚀|💡|🔒/g, '<span class="icon">$&</span>')?.replace(/\n\n/g, '</p><p>')?.replace(/\n/g, '<br>')
    
    return {
      text,
      formattedText: `<p>${formattedText}</p>`,
      wordCount: text?.split(' ')?.length,
      metadata: {
        tone: 'Professional',
        target_audience: 'General visitors',
        generated_at: new Date()?.toISOString(),
        prompt_used: prompt,
        note: 'Fallback content - configure OpenAI API key for custom generation'
      }
    };
  }
}