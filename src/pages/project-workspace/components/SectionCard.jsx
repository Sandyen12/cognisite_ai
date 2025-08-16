import React from 'react';
import Icon from '../../../components/AppIcon';

const SectionCard = ({ 
  section, 
  isActive = false, 
  onClick = () => {},
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (section?.status) {
      case 'completed':
        return <Icon name="CheckCircle2" size={16} color="var(--color-success)" />;
      case 'in-progress':
        return <Icon name="Clock" size={16} color="var(--color-warning)" />;
      case 'pending':
        return <Icon name="Circle" size={16} color="var(--color-muted-foreground)" />;
      default:
        return <Icon name="Circle" size={16} color="var(--color-muted-foreground)" />;
    }
  };

  const getStatusText = () => {
    switch (section?.status) {
      case 'completed':
        return 'Content generated';
      case 'in-progress':
        return 'In progress';
      case 'pending':
        return 'Ready to start';
      default:
        return 'Ready to start';
    }
  };

  return (
    <div
      onClick={() => onClick(section)}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
        ${isActive 
          ? 'bg-primary/5 border-primary shadow-sm' 
          : 'bg-card border-border hover:border-primary/30'
        }
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-medium text-sm leading-tight ${
          isActive ? 'text-primary' : 'text-foreground'
        }`}>
          {section?.name}
        </h3>
        {getStatusIcon()}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="MapPin" size={12} />
          <span className="truncate">{section?.page}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-xs">
          <span className={`
            ${section?.status === 'completed' ? 'text-success' : 
              section?.status === 'in-progress'? 'text-warning' : 'text-muted-foreground'}
          `}>
            {getStatusText()}
          </span>
        </div>
        
        {section?.wordCount && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="FileText" size={12} />
            <span>{section?.wordCount} words</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;