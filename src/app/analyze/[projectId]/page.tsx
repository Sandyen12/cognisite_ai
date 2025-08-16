'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

const ANALYSIS_STEPS = [
  { id: 'accessing', text: 'Accessing your website...' },
  { id: 'parsing', text: 'Parsing HTML structure...' },
  { id: 'identifying', text: 'Identifying key content sections (e.g., Hero, Services, About Us)...' },
  { id: 'preparing', text: 'Preparing your personalized content workspace...' },
]

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const projectId = params.projectId as string

  useEffect(() => {
    const simulateAnalysis = async () => {
      // Simulate the analysis process with realistic timing
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
        setCurrentStep(i + 1)
      }
      
      // Wait a bit more before completing
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsComplete(true)
      
      // Redirect to project workspace after completion
      setTimeout(() => {
        router.push(`/project/${projectId}`)
      }, 1500)
    }

    simulateAnalysis()
  }, [projectId, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">CogniSite AI</span>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Analyzing Your Website
            </h1>
            <p className="text-gray-600 mb-8">
              Our AI is working hard to understand your website's structure and prepare 
              your personalized content workspace.
            </p>

            {/* Progress Steps */}
            <div className="space-y-4">
              {ANALYSIS_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-green-50 border border-green-200'
                      : index === currentStep
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      index < currentStep
                        ? 'text-green-800'
                        : index === currentStep
                        ? 'text-blue-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentStep) / ANALYSIS_STEPS.length) * 100}%`
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(((currentStep) / ANALYSIS_STEPS.length) * 100)}% Complete
              </p>
            </div>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Analysis complete! Redirecting to your workspace...
                </span>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-700">
              While we analyze your website, think about your target audience and key 
              messaging points. This will help you get the most out of our AI conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}