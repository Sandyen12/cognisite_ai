import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanCard = ({ 
  currentPlan, 
  usageMetrics, 
  onUpgrade 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'canceled':
        return 'text-warning';
      case 'past_due':
        return 'text-error';
      case 'trial':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'canceled':
        return 'XCircle';
      case 'past_due':
        return 'AlertCircle';
      case 'trial':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Current Plan
          </h2>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(currentPlan?.status)} 
              size={16} 
              className={getStatusColor(currentPlan?.status)} 
            />
            <span className={`text-sm font-medium ${getStatusColor(currentPlan?.status)}`}>
              {currentPlan?.status === 'active' ? 'Active' : 
               currentPlan?.status === 'canceled' ? 'Canceled' :
               currentPlan?.status === 'past_due' ? 'Past Due' :
               currentPlan?.status === 'trial' ? 'Trial' : 'Unknown'}
            </span>
          </div>
        </div>
        {currentPlan?.tier === 'free' && (
          <Button
            variant="default"
            size="sm"
            onClick={onUpgrade}
            iconName="Zap"
            iconPosition="left"
            className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
          >
            Upgrade
          </Button>
        )}
      </div>
      {/* Plan Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="font-medium text-foreground">
            {currentPlan?.name}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Billing Cycle</span>
          <span className="font-medium text-foreground">
            {currentPlan?.billingCycle}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-medium text-foreground">
            {currentPlan?.price}
          </span>
        </div>

        {currentPlan?.renewalDate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {currentPlan?.status === 'canceled' ? 'Expires' : 'Renews'}
            </span>
            <span className="font-medium text-foreground">
              {currentPlan?.renewalDate}
            </span>
          </div>
        )}
      </div>
      {/* Usage Metrics */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Usage This Month</h3>
        
        {usageMetrics?.map((metric, index) => {
          const percentage = getUsagePercentage(metric?.used, metric?.limit);
          const isUnlimited = metric?.limit === -1;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{metric?.name}</span>
                <span className="text-sm font-medium text-foreground">
                  {metric?.used}{isUnlimited ? '' : ` / ${metric?.limit}`}
                  {isUnlimited && <span className="text-accent ml-1">Unlimited</span>}
                </span>
              </div>
              {!isUnlimited && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
              {!isUnlimited && percentage >= 80 && (
                <div className="flex items-center space-x-1 text-xs text-warning">
                  <Icon name="AlertTriangle" size={12} />
                  <span>Approaching limit</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Upgrade Prompt for Free Users */}
      {currentPlan?.tier === 'free' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-md">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Sparkles" size={16} color="white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Unlock Premium Features
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get unlimited projects, advanced AI insights, and priority support.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={onUpgrade}
                className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPlanCard;