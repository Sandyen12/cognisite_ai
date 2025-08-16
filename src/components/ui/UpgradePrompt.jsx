import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UpgradePrompt = ({ 
  variant = 'default', // 'default', 'compact', 'mobile', 'banner'
  onUpgrade = () => {},
  onDismiss = null,
  showDismiss = false,
  title = null,
  description = null,
  ctaText = 'Upgrade Now',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-3 py-2 text-sm';
      case 'mobile':
        return 'p-4';
      case 'banner':
        return 'p-4 rounded-none border-l-4 border-l-accent';
      default:
        return 'p-4';
    }
  };

  const getContent = () => {
    switch (variant) {
      case 'compact':
        return {
          title: 'Upgrade',
          description: 'Unlock premium features',
          icon: 'Zap'
        };
      case 'mobile':
        return {
          title: title || 'Unlock Premium Features',
          description: description || 'Get unlimited analyses, advanced insights, and priority support.',
          icon: 'Crown'
        };
      case 'banner':
        return {
          title: title || 'You\'re on the Free Plan',
          description: description || 'Upgrade to unlock unlimited website analyses and advanced AI insights.',
          icon: 'TrendingUp'
        };
      default:
        return {
          title: title || 'Upgrade to Premium',
          description: description || 'Unlock unlimited analyses and advanced features.',
          icon: 'Sparkles'
        };
    }
  };

  const content = getContent();

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onUpgrade}
        iconName={content?.icon}
        iconPosition="left"
        iconSize={16}
        className={`upgrade-prompt border-accent/30 hover:border-accent/50 ${className}`}
      >
        <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-medium">
          {content?.title}
        </span>
      </Button>
    );
  }

  return (
    <div className={`upgrade-prompt ${getVariantStyles()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
            <Icon name={content?.icon} size={16} color="white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {content?.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {content?.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size={variant === 'mobile' ? 'sm' : 'xs'}
              onClick={onUpgrade}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
            >
              {ctaText}
            </Button>
            
            {showDismiss && onDismiss && (
              <Button
                variant="ghost"
                size={variant === 'mobile' ? 'sm' : 'xs'}
                onClick={onDismiss}
              >
                Maybe Later
              </Button>
            )}
          </div>
        </div>
        
        {showDismiss && onDismiss && variant !== 'mobile' && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onDismiss}
            className="flex-shrink-0"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>
      {variant === 'banner' && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Check" size={12} color="var(--color-accent)" />
              <span>Unlimited analyses</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Check" size={12} color="var(--color-accent)" />
              <span>Advanced insights</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Check" size={12} color="var(--color-accent)" />
              <span>Priority support</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePrompt;