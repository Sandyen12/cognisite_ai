'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ExternalLink, Calendar, Clock, ArrowRight } from 'lucide-react'

interface Project {
  id: string
  url: string
  name: string
  createdAt: Date
  lastModified: Date
  status: 'completed' | 'in-progress' | 'draft'
  sectionsCompleted: number
  totalSections: number
}

export default function Dashboard() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  // Mock projects data
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        url: 'https://example.com',
        name: 'Example Website',
        createdAt: new Date('2024-01-15'),
        lastModified: new Date('2024-01-20'),
        status: 'completed',
        sectionsCompleted: 6,
        totalSections: 6
      },
      {
        id: '2',
        url: 'https://startup.com',
        name: 'Startup Landing Page',
        createdAt: new Date('2024-01-18'),
        lastModified: new Date('2024-01-19'),
        status: 'in-progress',
        sectionsCompleted: 3,
        totalSections: 5
      },
      {
        id: '3',
        url: 'https://agency.com',
        name: 'Marketing Agency',
        createdAt: new Date('2024-01-10'),
        lastModified: new Date('2024-01-12'),
        status: 'draft',
        sectionsCompleted: 1,
        totalSections: 4
      }
    ]
    setProjects(mockProjects)
  }, [])

  const handleAnalyzeNew = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (response.ok) {
        const { projectId } = await response.json()
        router.push(`/analyze/${projectId}`)
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to analyze website. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'draft':
        return 'Draft'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your website projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Free Plan</span>
              <button className="btn-primary">Upgrade</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analyze New Website Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Analyze New Website
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a website URL to start generating AI-powered content
            </p>
            
            <form onSubmit={handleAnalyzeNew} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., https://example.com)"
                  className="input-field flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center min-w-[200px]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Analyze Website
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
            <div className="flex items-center space-x-4">
              <select className="input-field max-w-xs">
                <option>All Projects</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Drafts</option>
              </select>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">
                Start by analyzing your first website to generate AI-powered content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 truncate">{project.url}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">
                          {project.sectionsCompleted}/{project.totalSections} sections
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(project.sectionsCompleted / project.totalSections) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created {project.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        Updated {project.lastModified.toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/project/${project.id}`)}
                        className="flex-1 btn-primary flex items-center justify-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Continue
                      </button>
                      <button className="btn-secondary">
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-sm text-gray-600">Projects Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">15</div>
              <div className="text-sm text-gray-600">Content Sections Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}