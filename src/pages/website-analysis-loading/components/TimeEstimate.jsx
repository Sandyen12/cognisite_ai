import React from 'react';
import Icon from '../../../components/AppIcon';

const TimeEstimate = ({ estimatedTime = 0, elapsedTime = 0 }) => {
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Time Remaining</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-primary">
            {formatTime(remainingTime)}
          </div>
          <div className="text-xs text-muted-foreground">
            Elapsed: {formatTime(elapsedTime)}
          </div>
        </div>
      </div>
      
      {remainingTime > 0 && (
        <div className="mt-3">
          <div className="w-full bg-border rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-accent to-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (elapsedTime / estimatedTime) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeEstimate;