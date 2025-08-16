import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import StatsBar from './components/StatsBar';
import NewAnalysisSection from './components/NewAnalysisSection';
import ProjectFilters from './components/ProjectFilters';
import BulkActions from './components/BulkActions';
import ProjectGrid from './components/ProjectGrid';
import EmptyState from './components/EmptyState';
import Button from '../../components/ui/Button';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total_projects: 0,
    completed_analyses: 0,
    ai_generations: 0,
    recent_activity: 0,
    activity_trend: 'neutral',
    activity_change: 0
  });

  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    status: 'all',
    dateRange: null,
    sort: 'newest'
  });

  const projectsPerPage = 12;

  // Load dashboard data
  useEffect(() => {
    if (authLoading || !user) return;

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load projects and statistics in parallel
        const [projectsData, statsData] = await Promise.all([
          projectService?.getUserProjects(),
          projectService?.getUserStatistics()
        ]);
        
        setProjects(projectsData || []);
        setFilteredProjects(projectsData || []);
        setStats(statsData || {
          total_projects: 0,
          completed_analyses: 0,
          ai_generations: 0,
          recent_activity: 0,
          activity_trend: 'neutral',
          activity_change: 0
        });
        
        setError(null);
      } catch (err) {
        if (err?.message?.includes('Failed to fetch') || 
            err?.message?.includes('NetworkError')) {
          setError('Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
        } else {
          setError('Failed to load dashboard data');
        }
        console.log('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (activeFilters?.search) {
      filtered = filtered?.filter(project =>
        project?.name?.toLowerCase()?.includes(activeFilters?.search?.toLowerCase()) ||
        project?.url?.toLowerCase()?.includes(activeFilters?.search?.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilters?.status && activeFilters?.status !== 'all') {
      filtered = filtered?.filter(project => project?.status === activeFilters?.status);
    }

    // Apply date filter
    if (activeFilters?.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (activeFilters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          break;
        case 'quarter':
          filterDate?.setMonth(now?.getMonth() - 3);
          break;
      }
      
      filtered = filtered?.filter(project => new Date(project?.created_at) >= filterDate);
    }

    // Apply sorting
    switch (activeFilters?.sort) {
      case 'oldest':
        filtered?.sort((a, b) => new Date(a?.created_at) - new Date(b?.created_at));
        break;
      case 'name-asc':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-desc':
        filtered?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      case 'status':
        filtered?.sort((a, b) => a?.status?.localeCompare(b?.status));
        break;
      default: // 'newest'
        filtered?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, activeFilters]);

  // Handle filter changes
  const handleSearch = (searchTerm) => {
    setActiveFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleStatusFilter = (status) => {
    setActiveFilters(prev => ({ ...prev, status }));
  };

  const handleDateFilter = (dateRange) => {
    setActiveFilters(prev => ({ ...prev, dateRange }));
  };

  const handleSortChange = (sort) => {
    setActiveFilters(prev => ({ ...prev, sort }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      search: '',
      status: 'all',
      dateRange: null,
      sort: 'newest'
    });
  };

  // Handle project actions
  const handleEditProject = async (project) => {
    const newName = prompt('Enter new project name:', project?.name);
    if (newName && newName !== project?.name) {
      try {
        await projectService?.updateProject(project?.id, { name: newName });
        setProjects(prev => prev?.map(p => 
          p?.id === project?.id ? { ...p, name: newName } : p
        ));
      } catch (err) {
        setError('Failed to update project name');
        console.log('Project update error:', err);
      }
    }
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"?`)) {
      try {
        await projectService?.deleteProject(project?.id);
        setProjects(prev => prev?.filter(p => p?.id !== project?.id));
        setSelectedProjects(prev => prev?.filter(id => id !== project?.id));
      } catch (err) {
        setError('Failed to delete project');
        console.log('Project delete error:', err);
      }
    }
  };

  // Handle bulk actions
  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev => {
      if (prev?.includes(projectId)) {
        return prev?.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageProjects = getCurrentPageProjects();
    const allCurrentSelected = currentPageProjects?.every(p => selectedProjects?.includes(p?.id));
    
    if (allCurrentSelected) {
      setSelectedProjects(prev => prev?.filter(id => !currentPageProjects?.find(p => p?.id === id)));
    } else {
      const newSelections = currentPageProjects?.map(p => p?.id);
      setSelectedProjects(prev => [...new Set([...prev, ...newSelections])]);
    }
  };

  const handleDeselectAll = () => {
    setSelectedProjects([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProjects?.length} projects?`)) {
      try {
        await projectService?.deleteProjects(selectedProjects);
        setProjects(prev => prev?.filter(p => !selectedProjects?.includes(p?.id)));
        setSelectedProjects([]);
      } catch (err) {
        setError('Failed to delete projects');
        console.log('Bulk delete error:', err);
      }
    }
  };

  const handleBulkExport = () => {
    const selectedProjectsData = projects?.filter(p => selectedProjects?.includes(p?.id));
    const exportData = JSON.stringify(selectedProjectsData, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle new analysis
  const handleNewAnalysis = async (url) => {
    try {
      // Extract domain name for project title
      const domain = new URL(url)?.hostname?.replace('www.', '');
      const projectName = `${domain?.charAt(0)?.toUpperCase() + domain?.slice(1)} Analysis`;
      
      const newProject = await projectService?.createProject({
        name: projectName,
        url: url
      });
      
      // Add to local state
      setProjects(prev => [newProject, ...prev]);
      
      // Navigate to project workspace
      navigate('/project-workspace', { state: { project: newProject } });
    } catch (err) {
      setError('Failed to create new analysis project');
      console.log('New analysis error:', err);
    }
  };

  // Pagination
  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    return filteredProjects?.slice(startIndex, startIndex + projectsPerPage);
  };

  const totalPages = Math.ceil(filteredProjects?.length / projectsPerPage);
  const currentPageProjects = getCurrentPageProjects();
  const isAllSelected = currentPageProjects?.length > 0 && currentPageProjects?.every(p => selectedProjects?.includes(p?.id));

  // Handle project switching for header
  const handleProjectSwitch = (project) => {
    navigate('/project-workspace', { state: { project } });
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to CogniSite AI</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard</p>
          <Button
            variant="default"
            onClick={() => navigate('/auth/signin')}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader 
          user={user}
          userTier={userProfile?.tier || 'free'}
          onProjectSwitch={handleProjectSwitch}
        />
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmptyState 
              type="loading-error" 
              onRetry={() => window.location?.reload()}
            />
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader 
        user={user}
        userTier={userProfile?.tier || 'free'}
        onProjectSwitch={handleProjectSwitch}
      />
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your website analysis projects
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {selectedProjects?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  iconName={showBulkActions ? "X" : "CheckSquare"}
                  iconPosition="left"
                >
                  {showBulkActions ? 'Cancel Selection' : 'Bulk Actions'}
                </Button>
              )}
              
              <Button
                variant="default"
                onClick={() => navigate('/landing-page')}
                iconName="Plus"
                iconPosition="left"
                className="bg-gradient-to-r from-primary to-accent"
              >
                New Analysis
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <StatsBar stats={stats} userTier={userProfile?.tier || 'free'} />

          {/* New Analysis Section */}
          <NewAnalysisSection 
            userTier={userProfile?.tier || 'free'} 
            currentUsage={stats}
            onAnalyze={handleNewAnalysis}
          />

          {/* Project Filters */}
          <ProjectFilters
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onDateFilter={handleDateFilter}
            onSortChange={handleSortChange}
            activeFilters={activeFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          {showBulkActions && (
            <BulkActions
              selectedProjects={selectedProjects}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
              totalProjects={currentPageProjects?.length}
              isAllSelected={isAllSelected}
            />
          )}

          {/* Projects Grid or Empty State */}
          {isLoading ? (
            <ProjectGrid isLoading={true} />
          ) : filteredProjects?.length === 0 ? (
            <EmptyState 
              type={projects?.length === 0 ? 'no-projects' : 'no-results'}
              searchTerm={activeFilters?.search}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <ProjectGrid
                projects={currentPageProjects}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                selectedProjects={selectedProjects}
                onSelectProject={handleSelectProject}
                showBulkActions={showBulkActions}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)]?.map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      
                      if (totalPages <= 7 || page === 1 || page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <Button
                            key={page}
                            variant={isCurrentPage ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-muted-foreground">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;