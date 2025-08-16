import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusMessage = ({ currentPhase, websiteUrl, customMessage }) => {
  const defaultPhaseMessages = {
    initializing: 'Starting website analysis...',
    crawling: `Crawling ${websiteUrl} structure`,
    analyzing: 'AI analyzing content sections',
    processing: 'Processing insights and recommendations',
    finalizing: 'Preparing your workspace',
    fetching: 'Fetching website content...',
    extracting: 'Extracting page structure...',
    generating: 'Generating recommendations...'
  };

  const phaseIcons = {
    initializing: 'Loader2',
    crawling: 'Search',
    fetching: 'Download',
    extracting: 'FileText',
    analyzing: 'Brain',
    processing: 'Cog',
    generating: 'Lightbulb',
    finalizing: 'CheckCircle'
  };

  const message = customMessage || defaultPhaseMessages?.[currentPhase] || 'Processing...';
  const iconName = phaseIcons?.[currentPhase] || 'Loader2';

  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon 
            name={iconName} 
            size={20} 
            className={`text-primary ${iconName === 'Loader2' ? 'animate-spin' : ''}`} 
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {message}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please wait while we analyze your website content and structure
        </p>
      </div>
    </div>
  );
};

export default StatusMessage;