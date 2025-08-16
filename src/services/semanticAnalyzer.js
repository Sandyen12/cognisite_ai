/**
 * Semantic Website Analyzer
 * Advanced DOM parsing and AI-powered section identification
 */

import openai from '../lib/openai';
import errorHandlingService from './errorHandlingService';

class SemanticAnalyzer {
  constructor() {
    this.sectionPatterns = {
      hero: {
        selectors: ['[class*="hero"]', '[id*="hero"]', '.banner', '.jumbotron', '.landing', '[class*="above-fold"]'],
        indicators: ['hero', 'banner', 'jumbotron', 'landing', 'above fold', 'main banner'],
        position: 'top',
        priority: 'high'
      },
      navigation: {
        selectors: ['nav', '.nav', '.navigation', '.menu', '[role="navigation"]', 'header nav'],
        indicators: ['nav', 'menu', 'navigation', 'header'],
        position: 'top',
        priority: 'high'
      },
      about: {
        selectors: ['[class*="about"]', '[id*="about"]', '.story', '.company', '[class*="who-we-are"]'],
        indicators: ['about', 'story', 'company', 'who we are', 'our story', 'mission'],
        position: 'middle',
        priority: 'high'
      },
      services: {
        selectors: ['[class*="service"]', '[id*="service"]', '.offerings', '.solutions', '[class*="what-we-do"]'],
        indicators: ['service', 'offering', 'solution', 'what we do', 'our services'],
        position: 'middle',
        priority: 'high'
      },
      products: {
        selectors: ['[class*="product"]', '[id*="product"]', '.catalog', '.shop', '[class*="our-products"]'],
        indicators: ['product', 'catalog', 'shop', 'store', 'our products'],
        position: 'middle',
        priority: 'high'
      },
      features: {
        selectors: ['[class*="feature"]', '[id*="feature"]', '.benefits', '.advantages', '[class*="why-choose"]'],
        indicators: ['feature', 'benefit', 'advantage', 'why choose', 'key features'],
        position: 'middle',
        priority: 'medium'
      },
      testimonials: {
        selectors: ['[class*="testimonial"]', '[id*="testimonial"]', '.reviews', '.feedback', '[class*="client"]'],
        indicators: ['testimonial', 'review', 'feedback', 'client', 'customer', 'what they say'],
        position: 'middle',
        priority: 'medium'
      },
      pricing: {
        selectors: ['[class*="pricing"]', '[id*="pricing"]', '.plans', '.packages', '[class*="cost"]'],
        indicators: ['pricing', 'plan', 'package', 'cost', 'subscription', 'price'],
        position: 'middle',
        priority: 'medium'
      },
      team: {
        selectors: ['[class*="team"]', '[id*="team"]', '.staff', '.people', '[class*="our-team"]'],
        indicators: ['team', 'staff', 'people', 'our team', 'meet the team'],
        position: 'middle',
        priority: 'low'
      },
      contact: {
        selectors: ['[class*="contact"]', '[id*="contact"]', '.reach', '.touch', '[class*="get-in-touch"]'],
        indicators: ['contact', 'reach', 'touch', 'get in touch', 'contact us'],
        position: 'bottom',
        priority: 'high'
      },
      footer: {
        selectors: ['footer', '.footer', '[role="contentinfo"]', '.site-footer'],
        indicators: ['footer', 'bottom', 'site info'],
        position: 'bottom',
        priority: 'medium'
      },
      faq: {
        selectors: ['[class*="faq"]', '[id*="faq"]', '.questions', '[class*="help"]'],
        indicators: ['faq', 'question', 'help', 'support', 'frequently asked'],
        position: 'middle',
        priority: 'low'
      },
      blog: {
        selectors: ['[class*="blog"]', '[id*="blog"]', '.news', '.articles', '[class*="latest"]'],
        indicators: ['blog', 'news', 'article', 'latest', 'updates'],
        position: 'middle',
        priority: 'low'
      }
    };
  }

  /**
   * Analyze website DOM structure and identify sections
   * @param {string} htmlContent - Raw HTML content
   * @param {string} url - Website URL
   * @returns {Promise<Array>} Identified sections
   */
  async analyzeWebsiteStructure(htmlContent, url) {
    try {
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract basic structure
      const basicStructure = this.extractBasicStructure(doc);
      
      // Identify sections using DOM analysis
      const domSections = this.identifyDOMSections(doc);
      
      // Use AI to enhance section identification
      const aiEnhancedSections = await this.enhanceWithAI(htmlContent, domSections, url);
      
      // Merge and prioritize sections
      const finalSections = this.mergeSections(domSections, aiEnhancedSections, basicStructure);
      
      return this.prioritizeAndCleanSections(finalSections);
      
    } catch (error) {
      const processedError = errorHandlingService.handleError(
        error, 
        'semantic_analysis', 
        { url, contentLength: htmlContent?.length }
      );
      
      // Return fallback sections
      return this.getFallbackSections();
    }
  }

  /**
   * Extract basic website structure
   * @param {Document} doc - Parsed HTML document
   * @returns {Object} Basic structure information
   */
  extractBasicStructure(doc) {
    return {
      title: doc.querySelector('title')?.textContent?.trim() || '',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '',
      headings: Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent?.trim(),
        id: h.id || null
      })),
      navigation: this.extractNavigation(doc),
      hasHeader: !!doc.querySelector('header'),
      hasFooter: !!doc.querySelector('footer'),
      hasMain: !!doc.querySelector('main'),
      sections: Array.from(doc.querySelectorAll('section')).length,
      articles: Array.from(doc.querySelectorAll('article')).length
    };
  }

  /**
   * Extract navigation structure
   * @param {Document} doc - Parsed HTML document
   * @returns {Array} Navigation items
   */
  extractNavigation(doc) {
    const navElements = doc.querySelectorAll('nav, .nav, .navigation, .menu');
    const navigation = [];

    navElements.forEach(nav => {
      const links = Array.from(nav.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim(),
        href: a.href,
        isInternal: a.href?.startsWith(window.location.origin) || a.href?.startsWith('/') || a.href?.startsWith('#')
      }));

      if (links.length > 0) {
        navigation.push({
          element: nav.tagName.toLowerCase(),
          className: nav.className,
          links: links.slice(0, 10) // Limit links
        });
      }
    });

    return navigation;
  }

  /**
   * Identify sections using DOM analysis
   * @param {Document} doc - Parsed HTML document
   * @returns {Array} Identified sections
   */
  identifyDOMSections(doc) {
    const identifiedSections = [];

    // Check each section pattern
    Object.entries(this.sectionPatterns).forEach(([sectionType, pattern]) => {
      const elements = this.findSectionElements(doc, pattern);
      
      if (elements.length > 0) {
        const section = {
          name: this.formatSectionName(sectionType),
          type: sectionType,
          detected: true,
          elements: elements.length,
          priority: pattern.priority,
          position: pattern.position,
          content: this.extractSectionContent(elements[0]),
          page: this.inferPageLocation(sectionType),
          description: this.generateSectionDescription(sectionType),
          confidence: this.calculateConfidence(elements, pattern)
        };

        identifiedSections.push(section);
      }
    });

    // Check for semantic HTML5 elements
    this.identifySemanticElements(doc, identifiedSections);

    return identifiedSections;
  }

  /**
   * Find elements matching section pattern
   * @param {Document} doc - Parsed HTML document
   * @param {Object} pattern - Section pattern
   * @returns {Array} Matching elements
   */
  findSectionElements(doc, pattern) {
    const elements = [];

    // Try CSS selectors
    pattern.selectors.forEach(selector => {
      try {
        const found = doc.querySelectorAll(selector);
        elements.push(...Array.from(found));
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Try text-based matching
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const className = (el.className || '').toLowerCase();
      const id = (el.id || '').toLowerCase();
      
      pattern.indicators.forEach(indicator => {
        if (text.includes(indicator) || className.includes(indicator) || id.includes(indicator)) {
          if (!elements.includes(el)) {
            elements.push(el);
          }
        }
      });
    });

    return elements;
  }

  /**
   * Identify HTML5 semantic elements
   * @param {Document} doc - Parsed HTML document
   * @param {Array} sections - Current sections array
   */
  identifySemanticElements(doc, sections) {
    const semanticElements = {
      header: 'Header',
      nav: 'Navigation',
      main: 'Main Content',
      article: 'Article',
      section: 'Content Section',
      aside: 'Sidebar',
      footer: 'Footer'
    };

    Object.entries(semanticElements).forEach(([tag, name]) => {
      const elements = doc.querySelectorAll(tag);
      if (elements.length > 0 && !sections.some(s => s.type === tag)) {
        sections.push({
          name: name,
          type: tag,
          detected: true,
          elements: elements.length,
          priority: tag === 'main' || tag === 'header' ? 'high' : 'medium',
          position: tag === 'header' ? 'top' : tag === 'footer' ? 'bottom' : 'middle',
          content: this.extractSectionContent(elements[0]),
          page: 'Current page',
          description: `${name} area of the website`,
          confidence: 0.8
        });
      }
    });
  }

  /**
   * Extract content from section element
   * @param {Element} element - DOM element
   * @returns {Object} Section content
   */
  extractSectionContent(element) {
    if (!element) return { text: '', wordCount: 0 };

    const text = element.textContent?.trim() || '';
    const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map(h => h.textContent?.trim());
    const links = Array.from(element.querySelectorAll('a'))
      .map(a => ({ text: a.textContent?.trim(), href: a.href }));

    return {
      text: text.substring(0, 500), // Limit text length
      wordCount: text.split(/\s+/).length,
      headings: headings.slice(0, 5),
      links: links.slice(0, 5),
      hasImages: element.querySelectorAll('img').length > 0,
      hasButtons: element.querySelectorAll('button, .btn, [role="button"]').length > 0
    };
  }

  /**
   * Use AI to enhance section identification
   * @param {string} htmlContent - Raw HTML content
   * @param {Array} domSections - DOM-identified sections
   * @param {string} url - Website URL
   * @returns {Promise<Array>} AI-enhanced sections
   */
  async enhanceWithAI(htmlContent, domSections, url) {
    try {
      // Extract text content for AI analysis
      const textContent = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 6000); // Limit for AI

      const prompt = `Analyze this website content and identify key sections that should be present:

URL: ${url}
Current DOM sections found: ${domSections.map(s => s.name).join(', ')}

Website content:
${textContent}

Please identify:
1. What type of website this is (e.g., business, e-commerce, blog, portfolio)
2. What key sections are missing that should be present
3. What sections are most important for this type of website
4. Any unique sections specific to this business/industry

Respond with a JSON array of section objects with: name, type, priority (high/medium/low), description, and reasoning.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert web analyst. Analyze website content and identify important sections. Respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      try {
        // Try to parse JSON response
        const aiSections = JSON.parse(aiResponse);
        return Array.isArray(aiSections) ? aiSections : [];
      } catch (parseError) {
        // If JSON parsing fails, extract sections from text
        return this.extractSectionsFromText(aiResponse);
      }

    } catch (error) {
      console.error('AI enhancement failed:', error);
      return [];
    }
  }

  /**
   * Extract sections from AI text response
   * @param {string} text - AI response text
   * @returns {Array} Extracted sections
   */
  extractSectionsFromText(text) {
    const sections = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      // Look for section patterns in text
      const match = line.match(/(\w+(?:\s+\w+)*)\s*[-:]\s*(.+)/);
      if (match) {
        sections.push({
          name: match[1].trim(),
          type: match[1].toLowerCase().replace(/\s+/g, '_'),
          priority: 'medium',
          description: match[2].trim(),
          detected: false,
          confidence: 0.6
        });
      }
    });

    return sections;
  }

  /**
   * Merge DOM and AI sections
   * @param {Array} domSections - DOM-identified sections
   * @param {Array} aiSections - AI-identified sections
   * @param {Object} basicStructure - Basic structure info
   * @returns {Array} Merged sections
   */
  mergeSections(domSections, aiSections, basicStructure) {
    const merged = [...domSections];
    
    // Add AI sections that don't conflict with DOM sections
    aiSections.forEach(aiSection => {
      const exists = merged.some(domSection => 
        domSection.type === aiSection.type || 
        domSection.name.toLowerCase() === aiSection.name.toLowerCase()
      );
      
      if (!exists) {
        merged.push({
          ...aiSection,
          detected: false,
          elements: 0,
          position: this.inferPosition(aiSection.type),
          page: this.inferPageLocation(aiSection.type),
          content: { text: '', wordCount: 0 }
        });
      }
    });

    // Ensure essential sections are present
    this.ensureEssentialSections(merged, basicStructure);

    return merged;
  }

  /**
   * Ensure essential sections are present
   * @param {Array} sections - Current sections
   * @param {Object} basicStructure - Basic structure info
   */
  ensureEssentialSections(sections, basicStructure) {
    const essential = [
      { name: 'Hero Section', type: 'hero', priority: 'high', position: 'top' },
      { name: 'About Us', type: 'about', priority: 'high', position: 'middle' },
      { name: 'Services', type: 'services', priority: 'high', position: 'middle' },
      { name: 'Contact', type: 'contact', priority: 'high', position: 'bottom' },
      { name: 'Footer', type: 'footer', priority: 'medium', position: 'bottom' }
    ];

    essential.forEach(essentialSection => {
      const exists = sections.some(s => s.type === essentialSection.type);
      if (!exists) {
        sections.push({
          ...essentialSection,
          detected: false,
          elements: 0,
          page: this.inferPageLocation(essentialSection.type),
          description: this.generateSectionDescription(essentialSection.type),
          content: { text: '', wordCount: 0 },
          confidence: 0.3
        });
      }
    });
  }

  /**
   * Prioritize and clean sections
   * @param {Array} sections - All sections
   * @returns {Array} Cleaned and prioritized sections
   */
  prioritizeAndCleanSections(sections) {
    // Remove duplicates
    const unique = sections.filter((section, index, self) =>
      index === self.findIndex(s => s.type === section.type)
    );

    // Sort by priority and position
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const positionOrder = { top: 3, middle: 2, bottom: 1 };

    return unique
      .sort((a, b) => {
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        const positionDiff = (positionOrder[a.position] || 0) - (positionOrder[b.position] || 0);
        if (positionDiff !== 0) return positionDiff;
        
        return (b.confidence || 0) - (a.confidence || 0);
      })
      .slice(0, 12); // Limit to 12 sections
  }

  /**
   * Calculate confidence score for section detection
   * @param {Array} elements - Found elements
   * @param {Object} pattern - Section pattern
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(elements, pattern) {
    let confidence = 0;
    
    // Base confidence from element count
    confidence += Math.min(elements.length * 0.2, 0.6);
    
    // Bonus for specific selectors
    const specificSelectors = elements.filter(el => 
      pattern.selectors.some(selector => el.matches?.(selector))
    );
    confidence += specificSelectors.length * 0.1;
    
    // Bonus for position matching
    if (pattern.position === 'top' && elements.some(el => this.isInTopArea(el))) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1);
  }

  /**
   * Check if element is in top area of page
   * @param {Element} element - DOM element
   * @returns {boolean} True if in top area
   */
  isInTopArea(element) {
    const rect = element.getBoundingClientRect?.();
    return rect && rect.top < window.innerHeight * 0.3;
  }

  /**
   * Helper methods for formatting and inference
   */
  formatSectionName(type) {
    const nameMap = {
      hero: 'Hero Section',
      about: 'About Us',
      services: 'Services',
      products: 'Products',
      features: 'Features',
      testimonials: 'Testimonials',
      pricing: 'Pricing',
      team: 'Our Team',
      contact: 'Contact',
      footer: 'Footer',
      faq: 'FAQ',
      blog: 'Blog'
    };
    
    return nameMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  inferPosition(type) {
    const positionMap = {
      hero: 'top',
      navigation: 'top',
      header: 'top',
      footer: 'bottom',
      contact: 'bottom'
    };
    
    return positionMap[type] || 'middle';
  }

  inferPageLocation(type) {
    const pageMap = {
      hero: 'Homepage',
      navigation: 'All pages',
      about: '/about',
      services: '/services',
      products: '/products',
      contact: '/contact',
      footer: 'All pages',
      blog: '/blog',
      faq: '/faq'
    };
    
    return pageMap[type] || 'Homepage';
  }

  generateSectionDescription(type) {
    const descriptions = {
      hero: 'Main headline and value proposition',
      about: 'Company story and mission',
      services: 'Key offerings and benefits',
      products: 'Product showcase and features',
      features: 'Key features and benefits',
      testimonials: 'Customer reviews and social proof',
      pricing: 'Pricing plans and packages',
      team: 'Team members and expertise',
      contact: 'Contact details and form',
      footer: 'Links, copyright, and additional info',
      faq: 'Frequently asked questions',
      blog: 'Latest articles and updates'
    };
    
    return descriptions[type] || `${type} section content`;
  }

  /**
   * Get fallback sections when analysis fails
   * @returns {Array} Default sections
   */
  getFallbackSections() {
    return [
      {
        name: 'Hero Section',
        type: 'hero',
        detected: false,
        priority: 'high',
        position: 'top',
        page: 'Homepage',
        description: 'Main headline and value proposition',
        content: { text: '', wordCount: 0 },
        confidence: 0.5
      },
      {
        name: 'About Us',
        type: 'about',
        detected: false,
        priority: 'high',
        position: 'middle',
        page: '/about',
        description: 'Company story and mission',
        content: { text: '', wordCount: 0 },
        confidence: 0.5
      },
      {
        name: 'Services',
        type: 'services',
        detected: false,
        priority: 'high',
        position: 'middle',
        page: '/services',
        description: 'Key offerings and benefits',
        content: { text: '', wordCount: 0 },
        confidence: 0.5
      },
      {
        name: 'Contact',
        type: 'contact',
        detected: false,
        priority: 'high',
        position: 'bottom',
        page: '/contact',
        description: 'Contact details and form',
        content: { text: '', wordCount: 0 },
        confidence: 0.5
      }
    ];
  }
}

// Create and export singleton instance
const semanticAnalyzer = new SemanticAnalyzer();
export default semanticAnalyzer;