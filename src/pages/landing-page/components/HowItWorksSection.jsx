import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: 'Search',
      title: 'Analyze',
      description: 'Our AI scans your website structure and identifies all content sections automatically.',
      details: 'Advanced crawling technology analyzes your site\'s HTML structure, navigation, and content hierarchy.',
      color: 'from-primary to-primary/80'
    },
    {
      id: 2,
      icon: 'MessageSquare',
      title: 'Chat',
      description: 'Engage in intelligent conversations to generate tailored content for each section.',
      details: 'Context-aware AI understands your brand and creates personalized content through natural dialogue.',
      color: 'from-accent to-accent/80'
    },
    {
      id: 3,
      icon: 'Rocket',
      title: 'Deploy',
      description: 'Copy polished content directly to your website or content management system.',
      details: 'One-click copying with formatted text ready for immediate implementation across platforms.',
      color: 'from-secondary to-secondary/80'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your website content in three simple steps with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps?.map((step, index) => (
            <div key={step?.id} className="relative">
              {/* Connection Line */}
              {index < steps?.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent transform translate-x-6 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Step Card */}
              <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {step?.id}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${step?.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={step?.icon} size={28} color="white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step?.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step?.description}
                </p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {step?.details}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-full">
            <Icon name="Zap" size={20} className="mr-3 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Complete analysis typically takes 30-60 seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;