import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Brain',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your website structure and content patterns to provide intelligent insights.',
      benefits: ['Automatic section detection', 'Content gap analysis', 'SEO optimization suggestions']
    },
    {
      icon: 'MessageCircle',
      title: 'Conversational Interface',
      description: 'Natural language chat interface that understands context and generates content tailored to your specific needs.',
      benefits: ['Context-aware responses', 'Brand voice matching', 'Interactive refinement']
    },
    {
      icon: 'Zap',
      title: 'Instant Results',
      description: 'Get professional-quality content in seconds, not hours. Our optimized AI delivers fast, accurate results.',
      benefits: ['60-second analysis', 'Real-time generation', 'Immediate deployment']
    },
    {
      icon: 'Target',
      title: 'Section-Specific Content',
      description: 'Generate targeted content for every section of your website, from hero sections to product descriptions.',
      benefits: ['Homepage optimization', 'Product page content', 'About page copy']
    },
    {
      icon: 'Palette',
      title: 'Brand Voice Adaptation',
      description: 'AI learns your brand personality and maintains consistent tone across all generated content.',
      benefits: ['Tone consistency', 'Brand alignment', 'Voice customization']
    },
    {
      icon: 'Copy',
      title: 'One-Click Deployment',
      description: 'Copy generated content directly to your clipboard with proper formatting for immediate use.',
      benefits: ['Formatted output', 'Multiple formats', 'Easy integration']
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Icon name="Sparkles" size={16} className="mr-2" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Create
            <span className="block text-primary">Amazing Website Content</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you analyze, generate, and deploy 
            professional website content with unprecedented speed and quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={feature?.icon} size={24} color="white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature?.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature?.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2">
                  {feature?.benefits?.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-muted-foreground">
                      <Icon name="Check" size={16} className="mr-2 text-accent flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Website Content?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of businesses using CogniSite AI to create compelling, 
              conversion-focused website content in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="mr-2 text-accent" />
                Free analysis in under 60 seconds
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="mr-2 text-accent" />
                No credit card required
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Users" size={16} className="mr-2 text-accent" />
                Trusted by 10,000+ users
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;