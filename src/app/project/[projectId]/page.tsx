'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MessageSquare, Copy, Send, ChevronRight, CheckCircle } from 'lucide-react'

interface WebsiteSection {
  id: string
  name: string
  type: string
  description: string
}

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
}

interface GeneratedContent {
  sectionId: string
  content: string
  isComplete: boolean
}

export default function ProjectWorkspace() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])

  // Mock website sections - in real app, this would come from the AI analysis
  const [websiteSections] = useState<WebsiteSection[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      description: 'Main headline and value proposition'
    },
    {
      id: 'features',
      name: 'Features',
      type: 'features',
      description: 'Key product or service features'
    },
    {
      id: 'about',
      name: 'About Us',
      type: 'about',
      description: 'Company story and mission'
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      type: 'testimonials',
      description: 'Customer reviews and social proof'
    },
    {
      id: 'pricing',
      name: 'Pricing',
      type: 'pricing',
      description: 'Pricing plans and packages'
    },
    {
      id: 'contact',
      name: 'Contact',
      type: 'contact',
      description: 'Contact information and form'
    }
  ])

  // AI conversation prompts for different section types
  const getAIPrompt = (section: WebsiteSection) => {
    const prompts = {
      hero: "Great! Let's create a compelling hero section. Could you tell me about your main value proposition and target audience?",
      features: "Perfect! Let's highlight your key features. What are the main benefits your product or service provides?",
      about: "Excellent! Let's tell your story. What's your company's mission and what makes you unique?",
      testimonials: "Great! Let's add some powerful social proof. Could you provide a customer's name, their company, and a quote from them?",
      pricing: "Perfect! Let's create compelling pricing. What are your main pricing tiers and what's included in each?",
      contact: "Great! Let's set up your contact section. What's your preferred way for customers to reach you?"
    }
    return prompts[section.type as keyof typeof prompts] || "Let's work on this section together. What would you like to focus on?"
  }

  const handleSectionSelect = (section: WebsiteSection) => {
    setSelectedSection(section.id)
    setMessages([])
    setInputMessage('')
    
    // Add AI welcome message
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: getAIPrompt(section),
      timestamp: new Date()
    }
    setMessages([aiMessage])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedSection) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const section = websiteSections.find(s => s.id === selectedSection)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Thank you for that information! Based on what you've shared, I can help create compelling content for your ${section?.name.toLowerCase()}. Would you like me to generate a draft now, or do you have any other details to add?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleGenerateContent = async () => {
    if (!selectedSection) return

    setIsLoading(true)
    
    // Simulate content generation
    setTimeout(() => {
      const mockContent = `[Generated content for ${selectedSection} section would appear here. This would be polished, ready-to-use copy based on the conversation.]`
      
      setGeneratedContent(prev => [
        ...prev.filter(c => c.sectionId !== selectedSection),
        {
          sectionId: selectedSection,
          content: mockContent,
          isComplete: true
        }
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const currentGeneratedContent = generatedContent.find(c => c.sectionId === selectedSection)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Project Workspace</h1>
              <span className="text-sm text-gray-500">Project ID: {projectId}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">Save Progress</button>
              <button className="btn-primary">Export All Content</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Site Structure Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Website Sections</h2>
              <div className="space-y-3">
                {websiteSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedSection === section.id
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{section.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    {generatedContent.find(c => c.sectionId === section.id)?.isComplete && (
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">Complete</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area - AI Conversational Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Chat Header */}
              <div className="border-b p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedSection 
                        ? websiteSections.find(s => s.id === selectedSection)?.name 
                        : 'Select a section to start'
                      }
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedSection 
                        ? 'AI-powered content generation'
                        : 'Choose a section from the sidebar to begin'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {selectedSection ? (
                <>
                  {/* Chat Zone */}
                  <div className="p-6 h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Zone */}
                  <div className="border-t p-6">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="input-field flex-1"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="btn-primary"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content Output Zone */}
                  {currentGeneratedContent && (
                    <div className="border-t p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Final Content</h4>
                        <button
                          onClick={() => handleCopyContent(currentGeneratedContent.content)}
                          className="flex items-center space-x-2 btn-secondary"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy to Clipboard</span>
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {currentGeneratedContent.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Generate Content Button */}
                  {messages.length > 1 && !currentGeneratedContent && (
                    <div className="border-t p-6">
                      <button
                        onClick={handleGenerateContent}
                        disabled={isLoading}
                        className="w-full btn-primary"
                      >
                        {isLoading ? 'Generating Content...' : 'Generate Final Content'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Section to Begin
                  </h3>
                  <p className="text-gray-500">
                    Choose a section from the sidebar to start generating content with our AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}