import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <div className="ml-4">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <Icon name="Brain" size={16} color="white" className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;