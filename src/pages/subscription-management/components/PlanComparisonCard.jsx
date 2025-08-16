import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparisonCard = ({ 
  plan, 
  isCurrentPlan = false, 
  onSelectPlan,
  isPopular = false 
}) => {
  const handleSelectPlan = () => {
    if (!isCurrentPlan) {
      onSelectPlan(plan);
    }
  };

  return (
    <div className={`relative bg-card border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
      isPopular ? 'border-primary shadow-sm' : 'border-border'
    } ${isCurrentPlan ? 'ring-2 ring-accent/20' : ''}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-accent to-primary text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </div>
        </div>
      )}
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Icon name="Check" size={12} />
            <span>Current Plan</span>
          </div>
        </div>
      )}
      {/* Plan Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name={plan?.icon} size={24} color="white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{plan?.name}</h3>
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-3xl font-bold text-foreground">{plan?.price}</span>
          {plan?.billingCycle !== 'Free' && (
            <span className="text-sm text-muted-foreground">/{plan?.billingCycle}</span>
          )}
        </div>
        {plan?.originalPrice && (
          <div className="text-sm text-muted-foreground line-through mt-1">
            {plan?.originalPrice}
          </div>
        )}
      </div>
      {/* Plan Description */}
      <p className="text-sm text-muted-foreground text-center mb-6">
        {plan?.description}
      </p>
      {/* Features List */}
      <div className="space-y-3 mb-6">
        {plan?.features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Icon 
              name={feature?.included ? "Check" : "X"} 
              size={16} 
              className={feature?.included ? "text-success mt-0.5" : "text-muted-foreground mt-0.5"} 
            />
            <span className={`text-sm ${feature?.included ? 'text-foreground' : 'text-muted-foreground'}`}>
              {feature?.text}
            </span>
          </div>
        ))}
      </div>
      {/* Action Button */}
      <Button
        variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
        fullWidth
        onClick={handleSelectPlan}
        disabled={isCurrentPlan}
        className={isPopular && !isCurrentPlan ? 
          "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" : ""
        }
      >
        {isCurrentPlan ? 'Current Plan' : 
         plan?.tier === 'free'? 'Downgrade' : 'Upgrade Now'}
      </Button>
      {/* Trial Info */}
      {plan?.trialDays && !isCurrentPlan && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          {plan?.trialDays}-day free trial included
        </p>
      )}
    </div>
  );
};

export default PlanComparisonCard;