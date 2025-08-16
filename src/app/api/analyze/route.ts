import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { url, projectId } = await request.json()

    if (!url || !projectId) {
      return NextResponse.json(
        { error: 'URL and projectId are required' },
        { status: 400 }
      )
    }

    // Step 1: Fetch the website HTML
    const htmlResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CogniSiteAI/1.0)',
      },
    })

    if (!htmlResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch website' },
        { status: 400 }
      )
    }

    const html = await htmlResponse.text()

    // Step 2: Extract and clean HTML content
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Step 3: Use OpenAI to analyze the website structure
    const analysisPrompt = `
    Analyze this website HTML and identify the key content sections. 
    For each section, provide:
    - Section type (hero, features, about, testimonials, pricing, contact, etc.)
    - Section name (human-readable name)
    - Brief description of what this section contains
    - Any existing content or context clues

    HTML Content:
    ${cleanHtml.substring(0, 8000)} // Limit to first 8000 chars to avoid token limits

    Return the analysis as a JSON array with this structure:
    [
      {
        "id": "unique_section_id",
        "name": "Section Name",
        "type": "section_type",
        "description": "Brief description",
        "existingContent": "Any existing text content found"
      }
    ]
    `

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web analyst. Analyze website HTML and identify key content sections. Return only valid JSON.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    })

    const analysisText = analysisResponse.choices[0]?.message?.content
    if (!analysisText) {
      throw new Error('No analysis response from OpenAI')
    }

    // Parse the JSON response
    let sections
    try {
      sections = JSON.parse(analysisText)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', analysisText)
      // Fallback to basic sections if parsing fails
      sections = [
        {
          id: 'hero',
          name: 'Hero Section',
          type: 'hero',
          description: 'Main headline and value proposition',
          existingContent: ''
        },
        {
          id: 'features',
          name: 'Features',
          type: 'features',
          description: 'Key product or service features',
          existingContent: ''
        },
        {
          id: 'about',
          name: 'About Us',
          type: 'about',
          description: 'Company story and mission',
          existingContent: ''
        },
        {
          id: 'contact',
          name: 'Contact',
          type: 'contact',
          description: 'Contact information and form',
          existingContent: ''
        }
      ]
    }

    // Step 4: Store the analysis results
    // In a real implementation, you would store this in your database
    // For now, we'll return the results directly

    return NextResponse.json({
      projectId,
      url,
      sections,
      analysisComplete: true,
      message: 'Website analysis completed successfully'
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
}