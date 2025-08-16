import React from 'react';
import Icon from '../../../components/AppIcon';

const MotivationalContent = ({ websiteUrl = '' }) => {
  const benefits = [
    {
      icon: 'Zap',
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI is examining every aspect of your website'
    },
    {
      icon: 'Target',
      title: 'Personalized Insights',
      description: 'Getting tailored recommendations for your specific content'
    },
    {
      icon: 'Sparkles',
      title: 'Professional Content',
      description: 'Preparing high-quality copy suggestions for each section'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Creating Your Personalized Workspace
        </h3>
        <p className="text-muted-foreground">
          While we analyze {websiteUrl || 'your website'}, here's what we're preparing for you:
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {benefits?.map((benefit, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={benefit?.icon} size={16} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {benefit?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {benefit?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotivationalContent;