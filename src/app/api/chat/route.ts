import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Conversation prompts for different section types
const SECTION_PROMPTS = {
  hero: {
    system: `You are an expert copywriter specializing in hero sections. Your goal is to help create compelling, conversion-focused hero content. Ask targeted questions to understand the business, target audience, and value proposition. Be conversational and guide the user through the process.`,
    initial: "Great! Let's create a compelling hero section. Could you tell me about your main value proposition and target audience? What problem does your product or service solve?"
  },
  features: {
    system: `You are an expert copywriter specializing in feature sections. Help identify and highlight the key benefits and features of the product or service. Focus on benefits over features and use persuasive language.`,
    initial: "Perfect! Let's highlight your key features. What are the main benefits your product or service provides? What makes you different from competitors?"
  },
  about: {
    system: `You are an expert copywriter specializing in about sections. Help craft compelling company stories that build trust and connection with the audience. Focus on mission, values, and what makes the company unique.`,
    initial: "Excellent! Let's tell your story. What's your company's mission and what makes you unique? What's your background and why did you start this business?"
  },
  testimonials: {
    system: `You are an expert copywriter specializing in testimonials and social proof. Help gather authentic customer stories and create compelling testimonial content that builds trust and credibility.`,
    initial: "Great! Let's add some powerful social proof. Could you provide a customer's name, their company, and a quote from them? What specific results did they achieve?"
  },
  pricing: {
    system: `You are an expert copywriter specializing in pricing sections. Help create compelling pricing content that clearly communicates value and encourages conversions. Focus on benefits and value proposition.`,
    initial: "Perfect! Let's create compelling pricing. What are your main pricing tiers and what's included in each? What's your unique value proposition?"
  },
  contact: {
    system: `You are an expert copywriter specializing in contact sections. Help create welcoming and professional contact content that encourages engagement and makes it easy for customers to reach out.`,
    initial: "Great! Let's set up your contact section. What's your preferred way for customers to reach you? What information should they include when contacting you?"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      sectionType, 
      projectId, 
      conversationHistory = [],
      generateContent = false 
    } = await request.json()

    if (!message && !generateContent) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!sectionType) {
      return NextResponse.json(
        { error: 'Section type is required' },
        { status: 400 }
      )
    }

    const sectionPrompt = SECTION_PROMPTS[sectionType as keyof typeof SECTION_PROMPTS]
    if (!sectionPrompt) {
      return NextResponse.json(
        { error: 'Invalid section type' },
        { status: 400 }
      )
    }

    if (generateContent) {
      // Generate final content based on conversation history
      const contentPrompt = `
        Based on the following conversation about a ${sectionType} section, generate polished, ready-to-use content.
        
        Conversation History:
        ${conversationHistory.map((msg: any) => `${msg.type}: ${msg.content}`).join('\n')}
        
        Generate professional, engaging content that:
        - Is appropriate for a ${sectionType} section
        - Incorporates all the information shared in the conversation
        - Uses persuasive and engaging language
        - Is ready to be used on a website
        - Maintains the brand voice and tone discussed
        
        Return only the final content, no explanations or additional text.
      `

      const contentResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter. Generate polished, website-ready content based on the conversation. Return only the final content.`
          },
          {
            role: 'user',
            content: contentPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const generatedContent = contentResponse.choices[0]?.message?.content

      return NextResponse.json({
        type: 'content',
        content: generatedContent,
        sectionType,
        projectId
      })
    }

    // Regular conversation response
    const conversationPrompt = `
      ${sectionPrompt.system}
      
      Previous conversation:
      ${conversationHistory.map((msg: any) => `${msg.type}: ${msg.content}`).join('\n')}
      
      Current user message: ${message}
      
      Respond in a conversational, helpful manner. Ask follow-up questions if needed to gather more information for creating compelling ${sectionType} content. Keep responses concise but engaging.
    `

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: sectionPrompt.system
        },
        ...conversationHistory.map((msg: any) => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = chatResponse.choices[0]?.message?.content

    return NextResponse.json({
      type: 'message',
      content: aiResponse,
      sectionType,
      projectId
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}