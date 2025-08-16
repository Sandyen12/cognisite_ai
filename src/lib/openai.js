import OpenAI from 'openai';

/**
 * Initialize OpenAI client with API key from environment variables
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Generate a chat completion response based on user input
 * @param {string} userMessage - The user's input message
 * @param {object} section - The website section context
 * @returns {Promise<object>} The assistant's response with content and suggestions
 */
export async function generateChatResponse(userMessage, section) {
  try {
    const systemPrompt = `You are CogniSite AI, an expert content strategist and copywriter specializing in website content creation. You help users create high-quality, engaging content for different website sections.

Current section: ${section?.name || 'General'}
Section description: ${section?.description || 'Website content section'}

Your role:
- Generate compelling, conversion-focused content
- Provide actionable suggestions for improvement
- Maintain a professional yet approachable tone
- Focus on user engagement and business objectives
- Offer specific, practical advice

Always respond with helpful, detailed content that matches the section's purpose and the user's specific request.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response?.choices?.[0]?.message?.content;
    const suggestions = generateSuggestionsForSection(section);

    return {
      content,
      suggestions
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    
    // Fallback response if API fails
    return {
      content: `I'm having trouble connecting to generate a response right now. Please check your OpenAI API key configuration or try again later.`,
      suggestions: generateSuggestionsForSection(section)
    };
  }
}

/**
 * Generate structured content for a website section
 * @param {object} section - The website section
 * @param {string} prompt - User's content generation prompt
 * @returns {Promise<object>} Generated content with metadata
 */
export async function generateSectionContent(section, prompt) {
  try {
    const contentPrompt = `Generate high-quality, engaging content for a "${section?.name}" section of a website.

User request: ${prompt}

Requirements:
- Create compelling, professional content
- Focus on conversion and user engagement  
- Match the tone and style appropriate for this section
- Include clear calls-to-action where relevant
- Optimize for readability and impact
- Length: 100-300 words depending on section type

Please provide content that is ready to use on a professional website.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert copywriter creating professional website content. Generate compelling, conversion-focused content that engages visitors and drives action.' 
        },
        { role: 'user', content: contentPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response?.choices?.[0]?.message?.content;
    
    // Format content for HTML display
    const formattedContent = content
      ?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      ?.replace(/\*(.*?)\*/g, '<em>$1</em>')
      ?.replace(/\n\n/g, '</p><p>')
      ?.replace(/\n/g, '<br>');

    const wordCount = content?.split(/\s+/)?.length || 0;

    return {
      text: content,
      formattedText: `<p>${formattedContent}</p>`,
      wordCount,
      metadata: {
        tone: 'Professional',
        target_audience: 'Website visitors',
        generated_at: new Date()?.toISOString(),
        prompt_used: prompt,
        model: 'gpt-4',
        section_type: section?.name
      }
    };
  } catch (error) {
    console.error('Error generating section content:', error);
    
    // Fallback content if API fails
    const fallbackContent = `Professional content for ${section?.name} section. This content focuses on engaging your visitors and encouraging them to take action. Please configure your OpenAI API key to generate custom content.`;
    
    return {
      text: fallbackContent,
      formattedText: `<p>${fallbackContent}</p>`,
      wordCount: fallbackContent?.split(/\s+/)?.length || 0,
      metadata: {
        tone: 'Professional',
        target_audience: 'Website visitors',
        generated_at: new Date()?.toISOString(),
        prompt_used: prompt,
        model: 'fallback',
        section_type: section?.name,
        note: 'Fallback content - check OpenAI API configuration'
      }
    };
  }
}

/**
 * Generate contextual suggestions for a website section
 * @param {object} section - The website section
 * @returns {string[]} Array of suggestions
 */
function generateSuggestionsForSection(section) {
  if (!section) return [
    'Generate engaging content',
    'Improve call-to-action elements', 
    'Optimize for conversions'
  ];

  const suggestionMap = {
    'Hero Section': [
      'Create a compelling headline that captures attention',
      'Add urgency and scarcity elements to drive action',
      'Focus on the main benefit for your target customers',
      'Include a clear, prominent call-to-action button'
    ],
    'About Us': [
      'Tell your unique company story and mission',
      'Emphasize your values and what sets you apart',
      'Add team credibility and expertise highlights',
      'Include your company\'s achievements and milestones'
    ],
    'Product Features': [
      'Highlight unique selling points and differentiators',
      'Add social proof and customer testimonials',
      'Create benefit-focused descriptions rather than features',
      'Include comparison elements with competitors'
    ],
    'Services': [
      'Detail specific benefits for each service',
      'Add pricing information or value propositions',
      'Include process or methodology explanations',
      'Showcase results and case studies'
    ],
    'Testimonials': [
      'Create authentic customer success stories',
      'Add specific results and measurable outcomes',
      'Include diverse customer perspectives and industries',
      'Add photos and credibility indicators'
    ],
    'Contact': [
      'Make contact methods prominent and accessible',
      'Add location, hours, and response time information',
      'Include multiple ways to get in touch',
      'Add a contact form for easy communication'
    ],
    'FAQ': [
      'Address common customer concerns and objections',
      'Provide clear, helpful answers',
      'Organize questions by category or importance',
      'Add search functionality for easy navigation'
    ]
  };

  return suggestionMap?.[section?.name] || [
    `Make the ${section?.name} more engaging and compelling`,
    `Add clear call-to-action elements`,
    `Optimize content for better user experience`,
    `Include relevant keywords for SEO`
  ];
}

export default openai;