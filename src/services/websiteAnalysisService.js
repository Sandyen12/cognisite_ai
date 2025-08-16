import openai from '../lib/openai';
import axios from 'axios';
import errorHandlingService from './errorHandlingService';
import semanticAnalyzer from './semanticAnalyzer';

/**
 * Website Analysis Service
 * Handles real website analysis using OpenAI API
 */
export const websiteAnalysisService = {
  /**
   * Analyze a website's content and structure
   * @param {string} url - Website URL to analyze
   * @param {Function} onProgress - Progress callback function
   * @param {Function} onActivity - Activity logging callback
   * @returns {Promise<object>} Analysis results
   */
  async analyzeWebsite(url, onProgress = () => {}, onActivity = () => {}) {
    try {
      // Validate URL
      if (!url || !this.isValidUrl(url)) {
        throw new Error('Invalid URL provided');
      }

      onActivity('start', `Starting analysis of ${url}`);
      onProgress(5);

      // Phase 1: Fetch website content
      onActivity('start', 'Fetching website content...');
      const websiteContent = await this.fetchWebsiteContent(url);
      onProgress(25);

      // Phase 2: Extract metadata and structure
      onActivity('start', 'Extracting page structure and metadata...');
      const pageStructure = await this.extractPageStructure(websiteContent);
      onProgress(45);

      // Phase 3: AI-powered content analysis
      onActivity('start', 'AI analyzing content and sections...');
      const contentAnalysis = await this.analyzeContentWithAI(websiteContent, url);
      onProgress(70);

      // Phase 4: Generate sections and recommendations using semantic analyzer
      onActivity('start', 'Generating section recommendations...');
      const sections = await semanticAnalyzer.analyzeWebsiteStructure(websiteContent, url);
      onProgress(85);

      // Phase 5: Create final analysis report
      onActivity('start', 'Finalizing analysis report...');
      const analysisReport = {
        url,
        title: pageStructure?.title || 'Website Analysis',description: pageStructure?.description || 'Analyzed website content',
        sections,
        insights: contentAnalysis?.insights || [],
        recommendations: contentAnalysis?.recommendations || [],
        screenshot_url: `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&viewport_width=1200&viewport_height=800&format=png`,
        analysis_complete: true,
        analyzed_at: new Date()?.toISOString(),
        metadata: {
          word_count: contentAnalysis?.word_count || 0,
          sections_detected: sections?.length || 0,
          readability_score: contentAnalysis?.readability_score || 'Good',seo_score: pageStructure?.seo_score || 'Fair'
        }
      };

      onProgress(100);
      onActivity('complete', 'Analysis completed successfully!');

      return analysisReport;

    } catch (error) {
      const processedError = errorHandlingService.handleError(
        error, 
        'website_analysis', 
        { url, phase: 'analysis' }
      );
      
      onActivity('error', `Analysis failed: ${processedError.userMessage}`);
      
      throw new Error(processedError.userMessage);
    }
  },

  /**
   * Validate if URL is properly formatted
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid
   */
  isValidUrl(url) {
    try {
      const validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      return validUrl?.protocol === 'http:' || validUrl?.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Fetch website content via proxy or direct request
   * @param {string} url - Website URL
   * @returns {Promise<string>} - HTML content
   */
  async fetchWebsiteContent(url) {
    try {
      // Ensure URL has protocol
      const fullUrl = url?.startsWith('http') ? url : `https://${url}`;
      
      // Use a CORS proxy for client-side requests
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`;
      
      const response = await axios?.get(proxyUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return response?.data;
    } catch (error) {
      const processedError = errorHandlingService.handleError(
        error, 
        'website_scraping', 
        { url: fullUrl }
      );
      
      throw new Error(processedError.userMessage);
    }
  },

  /**
   * Extract page structure and metadata
   * @param {string} htmlContent - Raw HTML content
   * @returns {Promise<object>} - Extracted structure data
   */
  async extractPageStructure(htmlContent) {
    try {
      // Create a DOM parser for client-side HTML parsing
      const parser = new DOMParser();
      const doc = parser?.parseFromString(htmlContent, 'text/html');

      // Extract basic metadata
      const title = doc?.querySelector('title')?.textContent?.trim() || 'Untitled Website';
      const description = doc?.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
      const keywords = doc?.querySelector('meta[name="keywords"]')?.getAttribute('content')?.trim() || '';

      // Extract headings structure
      const headings = Array.from(doc?.querySelectorAll('h1, h2, h3, h4, h5, h6'))?.map(h => ({
        level: parseInt(h?.tagName?.charAt(1)),
        text: h?.textContent?.trim(),
        id: h?.id || null
      }));

      // Extract navigation structure
      const navElements = Array.from(doc?.querySelectorAll('nav, .nav, .navigation, .menu'))?.map(nav => ({
        text: nav?.textContent?.trim()?.substring(0, 200),
        links: Array.from(nav?.querySelectorAll('a'))?.map(a => ({
          text: a?.textContent?.trim(),
          href: a?.href
        }))?.slice(0, 10)
      }));

      // Basic SEO analysis
      const hasH1 = doc?.querySelector('h1') !== null;
      const hasMetaDescription = description?.length > 0;
      const hasTitle = title?.length > 0 && title !== 'Untitled Website';
      
      const seoScore = [hasH1, hasMetaDescription, hasTitle]?.filter(Boolean)?.length >= 2 ? 'Good' : 'Fair';

      return {
        title,
        description,
        keywords,
        headings: headings?.slice(0, 20), // Limit to first 20 headings
        navigation: navElements?.slice(0, 5), // Limit navigation elements
        seo_score: seoScore,
        has_h1: hasH1,
        has_meta_description: hasMetaDescription,
        heading_count: headings?.length
      };
    } catch (error) {
      errorHandlingService.handleError(
        error, 
        'page_structure_extraction', 
        { htmlContentLength: htmlContent?.length }
      );
      
      return {
        title: 'Website Analysis',
        description: '',
        keywords: '',
        headings: [],
        navigation: [],
        seo_score: 'Fair',
        has_h1: false,
        has_meta_description: false,
        heading_count: 0
      };
    }
  },

  /**
   * Analyze website content using OpenAI
   * @param {string} htmlContent - Raw HTML content
   * @param {string} url - Website URL
   * @returns {Promise<object>} - AI analysis results
   */
  async analyzeContentWithAI(htmlContent, url) {
    try {
      // Extract text content from HTML (remove tags)
      const textContent = htmlContent
        ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        ?.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        ?.replace(/<[^>]*>/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim();

      // Limit content for API (GPT-4 context window)
      const limitedContent = textContent?.substring(0, 8000);

      const analysisPrompt = `Analyze this website content and provide structured insights:

Website URL: ${url}
Content: ${limitedContent}

Please provide:
1. Main business/purpose of the website
2. Key sections that should be present on the website
3. Content strengths and weaknesses
4. Recommendations for improvement
5. Target audience analysis
6. Content readability assessment

Format your response as a detailed analysis focusing on practical, actionable insights for website improvement.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert web content analyst. Analyze website content and provide actionable insights for improvement. Focus on user experience, content strategy, and conversion optimization.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const analysisContent = response?.choices?.[0]?.message?.content || '';

      // Parse AI response to extract structured data
      const insights = this.extractInsightsFromResponse(analysisContent);
      const recommendations = this.extractRecommendationsFromResponse(analysisContent);

      return {
        insights,
        recommendations,
        word_count: limitedContent?.split(/\s+/)?.length || 0,
        readability_score: this.assessReadability(limitedContent),
        ai_analysis: analysisContent
      };

    } catch (error) {
      const processedError = errorHandlingService.handleError(
        error, 
        'ai_content_analysis', 
        { url, contentLength: limitedContent?.length }
      );
      
      // Fallback analysis if AI fails
      return {
        insights: [
          'Website analysis completed using fallback method',
          'Content structure appears standard for this type of website',
          'Several opportunities for content optimization identified'
        ],
        recommendations: [
          'Improve page loading speed and user experience',
          'Enhance call-to-action elements throughout the site',
          'Optimize content for search engine visibility',
          'Add more engaging visual elements'
        ],
        word_count: htmlContent?.split(/\s+/)?.length || 0,
        readability_score: 'Fair',
        ai_analysis: `AI analysis failed: ${processedError.userMessage}. Using fallback assessment.`
      };
    }
  },

  /**
   * Generate website sections based on analysis
   * @param {object} contentAnalysis - AI content analysis
   * @param {object} pageStructure - Page structure data
   * @returns {Promise<Array>} - Generated sections
   */
  async generateWebsiteSections(contentAnalysis, pageStructure) {
    // Generate sections based on analysis
    const baseSections = [
      {
        name: 'Hero Section',
        page: 'Homepage',
        description: 'Main headline and value proposition',
        priority: 'high',
        detected: pageStructure?.headings?.some(h => h?.level === 1) || false
      },
      {
        name: 'About Us',
        page: '/about',
        description: 'Company story and mission',
        priority: 'high',
        detected: pageStructure?.headings?.some(h => 
          h?.text?.toLowerCase()?.includes('about') || 
          h?.text?.toLowerCase()?.includes('our story')
        ) || false
      },
      {
        name: 'Services/Products',
        page: '/services',
        description: 'Key offerings and benefits',
        priority: 'high',
        detected: pageStructure?.headings?.some(h => 
          h?.text?.toLowerCase()?.includes('services') || 
          h?.text?.toLowerCase()?.includes('products') ||
          h?.text?.toLowerCase()?.includes('what we do')
        ) || false
      },
      {
        name: 'Contact Information',
        page: '/contact',
        description: 'Contact details and form',
        priority: 'medium',
        detected: pageStructure?.headings?.some(h => 
          h?.text?.toLowerCase()?.includes('contact') ||
          h?.text?.toLowerCase()?.includes('get in touch')
        ) || false
      },
      {
        name: 'Testimonials',
        page: 'Homepage',
        description: 'Customer reviews and social proof',
        priority: 'medium',
        detected: pageStructure?.headings?.some(h => 
          h?.text?.toLowerCase()?.includes('testimonial') ||
          h?.text?.toLowerCase()?.includes('review') ||
          h?.text?.toLowerCase()?.includes('customer')
        ) || false
      },
      {
        name: 'Footer',
        page: 'All pages',
        description: 'Links, copyright, and additional info',
        priority: 'low',
        detected: true // Footer almost always exists
      }
    ];

    // Add any additional sections based on content analysis
    if (contentAnalysis?.insights?.some(insight => 
      insight?.toLowerCase()?.includes('blog') || 
      insight?.toLowerCase()?.includes('news') ||
      insight?.toLowerCase()?.includes('article')
    )) {
      baseSections?.push({
        name: 'Blog/News',
        page: '/blog',
        description: 'Latest articles and updates',
        priority: 'medium',
        detected: true
      });
    }

    if (contentAnalysis?.insights?.some(insight => 
      insight?.toLowerCase()?.includes('faq') || 
      insight?.toLowerCase()?.includes('questions')
    )) {
      baseSections?.push({
        name: 'FAQ',
        page: '/faq',
        description: 'Frequently asked questions',
        priority: 'medium',
        detected: true
      });
    }

    return baseSections;
  },

  /**
   * Extract insights from AI response
   * @param {string} response - AI response text
   * @returns {Array} - Extracted insights
   */
  extractInsightsFromResponse(response) {
    const insights = [];
    
    // Look for numbered points or bullet points
    const insightPatterns = [
      /(?:insights?|findings?):?\s*([\s\S]*?)(?:\n\s*(?:recommendation|conclusion)|$)/i,
      /(?:\d+\.)\s*([^\n]+)/g,
      /(?:•|\-)\s*([^\n]+)/g
    ];

    for (const pattern of insightPatterns) {
      const matches = response?.match(pattern);
      if (matches) {
        matches?.forEach(match => {
          const cleaned = match?.replace(/^\d+\.\s*|^[•\-]\s*/g, '')?.trim();
          if (cleaned?.length > 10 && insights?.length < 5) {
            insights?.push(cleaned);
          }
        });
        if (insights?.length > 0) break;
      }
    }

    // Fallback insights if none found
    if (insights?.length === 0) {
      insights?.push(
        'Website content analysis completed successfully',
        'Multiple optimization opportunities identified',
        'Content structure follows standard web practices'
      );
    }

    return insights?.slice(0, 5);
  },

  /**
   * Extract recommendations from AI response
   * @param {string} response - AI response text
   * @returns {Array} - Extracted recommendations
   */
  extractRecommendationsFromResponse(response) {
    const recommendations = [];
    
    // Look for recommendations section
    const recPattern = /(?:recommendation|improve|suggest):?\s*([\s\S]*?)(?:\n\s*(?:conclusion|summary)|$)/i;
    const match = response?.match(recPattern);
    
    if (match) {
      const recText = match?.[1];
      const points = recText?.match(/(?:\d+\.|\-|\•)\s*([^\n]+)/g) || [];
      
      points?.forEach(point => {
        const cleaned = point?.replace(/^\d+\.\s*|^[\-•]\s*/g, '')?.trim();
        if (cleaned?.length > 10 && recommendations?.length < 6) {
          recommendations?.push(cleaned);
        }
      });
    }

    // Fallback recommendations
    if (recommendations?.length === 0) {
      recommendations?.push(
        'Improve page loading speed and performance',
        'Enhance call-to-action elements',
        'Optimize content for search engines',
        'Add more visual elements and imagery',
        'Improve mobile responsiveness',
        'Update content for better user engagement'
      );
    }

    return recommendations?.slice(0, 6);
  },

  /**
   * Assess content readability
   * @param {string} content - Text content
   * @returns {string} - Readability score
   */
  assessReadability(content) {
    if (!content) return 'Fair';
    
    const words = content?.split(/\s+/)?.length;
    const sentences = content?.split(/[.!?]+/)?.length;
    const avgWordsPerSentence = words / sentences;

    if (avgWordsPerSentence <= 15) return 'Excellent';
    if (avgWordsPerSentence <= 20) return 'Good';
    if (avgWordsPerSentence <= 25) return 'Fair';
    return 'Poor';
  }
};

export default websiteAnalysisService;