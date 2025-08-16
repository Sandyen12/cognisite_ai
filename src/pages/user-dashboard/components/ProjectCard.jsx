import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected = false,
  showBulkActions = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (showBulkActions) {
      onSelect(project?.id);
    } else {
      navigate('/project-workspace', { state: { project } });
    }
  };

  const handleMenuToggle = (e) => {
    e?.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    onEdit(project);
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    onDelete(project);
    setIsMenuOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`relative bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      } ${isHovered ? 'transform -translate-y-1' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {showBulkActions && (
        <div className="absolute top-3 left-3 z-10">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            isSelected ? 'bg-primary border-primary' : 'border-border bg-card'
          }`}>
            {isSelected && <Icon name="Check" size={12} color="white" />}
          </div>
        </div>
      )}
      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <div className="relative">
          <Button
            variant="ghost"
            size="xs"
            onClick={handleMenuToggle}
            className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-40 bg-popover border border-border rounded-md shadow-lg z-30 animate-slide-down">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                >
                  <Icon name="Edit2" size={14} />
                  <span>Edit Name</span>
                </button>
                <button
                  onClick={() => navigate('/project-workspace', { state: { project } })}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                >
                  <Icon name="ExternalLink" size={14} />
                  <span>Open Project</span>
                </button>
                <div className="border-t border-border">
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2 text-error"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Website Favicon/Screenshot */}
      <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
        <Image
          src={project?.screenshot || `https://www.google.com/s2/favicons?domain=${project?.url}&sz=128`}
          alt={`${project?.name} screenshot`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Project Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground truncate pr-2">
            {project?.name}
          </h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
            <Icon name={getStatusIcon(project?.status)} size={12} className="mr-1" />
            {project?.status}
          </div>
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {project?.url}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Analyzed {formatDate(project?.createdAt)}</span>
          <div className="flex items-center space-x-1">
            <Icon name="FileText" size={12} />
            <span>{project?.sectionsCount} sections</span>
          </div>
        </div>

        {/* Progress Bar for In-Progress Projects */}
        {project?.status === 'in-progress' && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${project?.progress || 0}%` }}
            />
          </div>
        )}
      </div>
      {/* Hover Preview */}
      {isHovered && !showBulkActions && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center items-center text-center opacity-0 animate-fade-in">
          <Icon name="ExternalLink" size={24} className="text-primary mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">Open Project</p>
          <p className="text-xs text-muted-foreground">
            Continue working on {project?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;