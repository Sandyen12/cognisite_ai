import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ 
  projects, 
  onEditProject, 
  onDeleteProject, 
  selectedProjects = [], 
  onSelectProject = () => {},
  showBulkActions = false,
  isLoading = false 
}) => {
  const handleProjectSelect = (projectId) => {
    onSelectProject(projectId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="w-full h-32 bg-muted rounded-md mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects?.map((project) => (
        <div key={project?.id} className="group">
          <ProjectCard
            project={project}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onSelect={handleProjectSelect}
            isSelected={selectedProjects?.includes(project?.id)}
            showBulkActions={showBulkActions}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;