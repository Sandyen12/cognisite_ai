import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: 'Search',
      title: 'Analyze',
      description: 'Our AI scans your website, identifies key sections, and understands your content structure in minutes.',
      details: [
        'Intelligent DOM parsing',
        'Section identification',
        'Content analysis',
        'SEO evaluation'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: 'MessageSquare',
      title: 'Chat',
      description: 'Engage in guided conversations with our AI to generate compelling, context-aware content for each section.',
      details: [
        'Context-aware conversations',
        'Section-specific prompts',
        'Brand voice adaptation',
        'Real-time refinement'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      icon: 'Download',
      title: 'Deploy',
      description: 'Copy polished, professional content directly to your website or CMS with one click.',
      details: [
        'Ready-to-use copy',
        'Multiple formats',
        'Easy integration',
        'Instant deployment'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Icon name="Zap" size={16} className="mr-2" />
            How CogniSite AI Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Transform Your Website in
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Three Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From analysis to deployment, our AI-powered platform guides you through creating 
            professional website content that converts visitors into customers.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-4 w-0.5 h-8 bg-border"></div>
                )}
                
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon name={step.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Step {step.id}</div>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    <div className={`w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to see it in action?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of website owners who have transformed their content with CogniSite AI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="text-success" />
                <span>2-3 minutes to complete</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>No registration required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8">
            <h4 className="text-lg font-semibold text-center text-foreground mb-8">
              Complete Process Timeline
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div className="text-center sm:text-left">
                  <div className="font-medium text-foreground">URL Input</div>
                  <div className="text-sm text-muted-foreground">30 seconds</div>
                </div>
              </div>
              
              <Icon name="ArrowRight" size={20} className="text-muted-foreground rotate-90 sm:rotate-0" />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div className="text-center sm:text-left">
                  <div className="font-medium text-foreground">AI Analysis</div>
                  <div className="text-sm text-muted-foreground">2-3 minutes</div>
                </div>
              </div>
              
              <Icon name="ArrowRight" size={20} className="text-muted-foreground rotate-90 sm:rotate-0" />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div className="text-center sm:text-left">
                  <div className="font-medium text-foreground">Content Ready</div>
                  <div className="text-sm text-muted-foreground">Instant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;