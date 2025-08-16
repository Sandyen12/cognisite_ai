import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = 'no-projects', // 'no-projects', 'no-results', 'loading-error'
  searchTerm = '',
  onClearFilters = () => {},
  onRetry = () => {}
}) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: 'Search',
          title: 'No projects found',
          description: `No projects match your search for "${searchTerm}". Try adjusting your filters or search terms.`,
          primaryAction: {
            label: 'Clear Filters',
            onClick: onClearFilters,
            variant: 'outline',
            icon: 'X'
          },
          secondaryAction: {
            label: 'Analyze New Website',
            onClick: () => navigate('/landing-page'),
            variant: 'default',
            icon: 'Plus'
          }
        };
      
      case 'loading-error':
        return {
          icon: 'AlertCircle',
          title: 'Failed to load projects',
          description: 'There was an error loading your projects. Please try again.',
          primaryAction: {
            label: 'Retry',
            onClick: onRetry,
            variant: 'default',
            icon: 'RefreshCw'
          },
          secondaryAction: {
            label: 'Go to Landing Page',
            onClick: () => navigate('/landing-page'),
            variant: 'outline',
            icon: 'Home'
          }
        };
      
      default: // 'no-projects'
        return {
          icon: 'FolderOpen',
          title: 'No projects yet',
          description: 'Start by analyzing your first website. Our AI will help you generate better content for every section.',
          primaryAction: {
            label: 'Analyze Your First Website',
            onClick: () => navigate('/landing-page'),
            variant: 'default',
            icon: 'Plus'
          },
          features: [
            {
              icon: 'Zap',
              title: 'AI-Powered Analysis',
              description: 'Automatically identify all sections of your website'
            },
            {
              icon: 'MessageSquare',
              title: 'Smart Conversations',
              description: 'Chat with AI to generate targeted content for each section'
            },
            {
              icon: 'Copy',
              title: 'Ready-to-Use Content',
              description: 'Get polished copy you can immediately deploy'
            }
          ]
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon 
            name={content?.icon} 
            size={32} 
            className={type === 'loading-error' ? 'text-error' : 'text-muted-foreground'} 
          />
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {content?.title}
        </h3>
        <p className="text-muted-foreground mb-8">
          {content?.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            variant={content?.primaryAction?.variant}
            onClick={content?.primaryAction?.onClick}
            iconName={content?.primaryAction?.icon}
            iconPosition="left"
            size="default"
          >
            {content?.primaryAction?.label}
          </Button>
          
          {content?.secondaryAction && (
            <Button
              variant={content?.secondaryAction?.variant}
              onClick={content?.secondaryAction?.onClick}
              iconName={content?.secondaryAction?.icon}
              iconPosition="left"
              size="default"
            >
              {content?.secondaryAction?.label}
            </Button>
          )}
        </div>

        {/* Features (only for no-projects state) */}
        {content?.features && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              What you'll get
            </h4>
            <div className="space-y-3">
              {content?.features?.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 text-left">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={feature?.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground text-sm">
                      {feature?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {feature?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;