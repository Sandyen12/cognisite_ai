import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityLog = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'start':
        return 'Play';
      case 'crawl':
        return 'Search';
      case 'analyze':
        return 'Brain';
      case 'process':
        return 'Cpu';
      case 'complete':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'complete':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'process':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Analysis Activity</h3>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="text-center py-4">
            <Icon name="Clock" size={20} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Waiting for analysis to begin...</p>
          </div>
        ) : (
          activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={14} 
                  className={getActivityColor(activity?.type)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground font-medium">
                    {activity?.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity?.timestamp)}
                  </span>
                </div>
                {activity?.details && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity?.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;