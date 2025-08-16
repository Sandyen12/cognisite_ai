import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import projectService from '../../services/projectService';
import errorHandlingService from '../../services/errorHandlingService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({
    total_projects: 0,
    completed_analyses: 0,
    ai_generations: 0,
    recent_activity: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [projectsData, statsData] = await Promise.allSettled([
        projectService.getUserProjects(),
        projectService.getUserStatistics()
      ]);

      setProjects(projectsData.status === 'fulfilled' ? projectsData.value || [] : []);
      setStats(statsData.status === 'fulfilled' ? statsData.value || {} : {});
    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'dashboard_load');
      setError(processedError.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeWebsite = async () => {
    if (!websiteUrl.trim() || isAnalyzing) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      // Add protocol if missing
      let finalUrl = websiteUrl.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }

      // Validate URL
      try {
        new URL(finalUrl);
      } catch {
        throw new Error('Please enter a valid website URL');
      }

      // Create project
      const projectData = await projectService.createProject({
        name: `${finalUrl} Analysis`,
        url: finalUrl,
        status: 'analyzing'
      });

      // Navigate to analysis page
      navigate(`/analyze/${projectData.id}`, {
        state: {
          websiteUrl: finalUrl,
          projectId: projectData.id
        }
      });
    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'dashboard_analysis');
      setError(processedError.userMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`, {
      state: {
        websiteUrl: project.url,
        projectId: project.id
      }
    });
  };

  const getProjectScreenshot = (project) => {
    // Try to get screenshot from analysis data first
    if (project.analysis_data?.screenshot_url) {
      return project.analysis_data.screenshot_url;
    }
    
    // Generate screenshot URL using screenshotone.com
    const encodedUrl = encodeURIComponent(project.url);
    return `https://api.screenshotone.com/take?url=${encodedUrl}&viewport_width=1200&viewport_height=800&format=png&full_page=false&fresh=true`;
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'analyzing': return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress': return 'bg-info/10 text-info border-info/20';
      case 'failed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={16} className="text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-foreground">CogniSite AI</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/setup-status')}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                <Icon name="Settings" size={20} />
              </button>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {userProfile?.full_name || user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FolderOpen" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total_projects || projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed_analyses || 0}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.ai_generations || 0}</p>
                <p className="text-sm text-muted-foreground">AI Generated</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} className="text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.recent_activity || 0}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analyze New Website Section */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Analyze New Website
            </h2>
            <p className="text-muted-foreground mb-6">
              Enter a website URL to start AI-powered content analysis and generation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="Globe" size={20} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com)"
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnalyzeWebsite();
                      }
                    }}
                    disabled={isAnalyzing}
                  />
                </div>
              </div>
              <button
                onClick={handleAnalyzeWebsite}
                disabled={!websiteUrl.trim() || isAnalyzing}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Search" size={20} />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Your Projects</h3>
              <p className="text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  {/* Screenshot */}
                  <div className="relative h-48 bg-muted/30">
                    <img
                      src={getProjectScreenshot(project)}
                      alt={`Screenshot of ${project.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-muted/50 flex items-center justify-center" style={{ display: 'none' }}>
                      <Icon name="Globe" size={48} className="text-muted-foreground" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={getFaviconUrl(project.url)}
                        alt="Favicon"
                        className="w-6 h-6 rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{project.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{project.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTimeAgo(project.created_at)}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="FileText" size={14} />
                        <span>{project.sections_count || 0} sections</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FolderOpen" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by analyzing your first website to generate AI-powered content
            </p>
            <button
              onClick={() => document.querySelector('input[type="text"]')?.focus()}
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Plus" size={16} />
              <span>Analyze Your First Website</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;