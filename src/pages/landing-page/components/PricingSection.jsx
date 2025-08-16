import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out CogniSite AI',
      features: [
        '1 website analysis per month',
        '3 pages per analysis',
        'Basic AI content generation',
        'Standard chat interface',
        'Copy to clipboard',
        'Email support'
      ],
      limitations: [
        'Limited to 1 saved project',
        'Basic analysis depth',
        'Standard response time'
      ],
      cta: 'Start Free Analysis',
      popular: false,
      variant: 'outline'
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Ideal for small businesses and freelancers',
      features: [
        'Unlimited website analyses',
        'Up to 50 pages per analysis',
        'Advanced AI content generation',
        'Priority chat interface',
        'Multiple export formats',
        'Project management dashboard',
        'Brand voice customization',
        'Priority email support'
      ],
      limitations: [],
      cta: 'Start 14-Day Free Trial',
      popular: true,
      variant: 'default'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For agencies and large organizations',
      features: [
        'Unlimited everything',
        'Unlimited pages per analysis',
        'Premium AI models',
        'White-label interface',
        'API access',
        'Team collaboration tools',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom training'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      variant: 'outline'
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan?.name === 'Free') {
      // Scroll to hero section for free analysis
      const heroSection = document.querySelector('#hero');
      if (heroSection) {
        heroSection?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (plan?.name === 'Enterprise') {
      // Handle enterprise contact
      window.location.href = 'mailto:sales@cognisite.ai?subject=Enterprise Plan Inquiry';
    } else {
      // Navigate to subscription management for paid plans
      navigate('/subscription-management');
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-4">
            <Icon name="DollarSign" size={16} className="mr-2" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose the Perfect Plan
            <span className="block text-accent">for Your Needs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI-powered 
            website analysis and content generation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <div 
              key={plan?.name} 
              className={`relative bg-card border rounded-xl p-8 ${
                plan?.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {plan?.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan?.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan?.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {plan?.period}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {plan?.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan?.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Icon 
                        name="Check" 
                        size={16} 
                        className="text-success mr-3 mt-0.5 flex-shrink-0" 
                      />
                      <span className="text-sm text-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan?.limitations?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Limitations
                    </p>
                    <ul className="space-y-2">
                      {plan?.limitations?.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <Icon 
                            name="Minus" 
                            size={14} 
                            className="text-muted-foreground mr-3 mt-0.5 flex-shrink-0" 
                          />
                          <span className="text-xs text-muted-foreground">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan?.variant}
                size="lg"
                fullWidth
                onClick={() => handlePlanSelect(plan)}
                className={plan?.popular ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' : ''}
              >
                {plan?.cta}
              </Button>

              {/* Additional Info */}
              {plan?.name === 'Professional' && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                What happens to my data if I cancel?
              </h4>
              <p className="text-sm text-muted-foreground">
                Your projects remain accessible for 30 days after cancellation, giving you time to export your data.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                Is there a setup fee?
              </h4>
              <p className="text-sm text-muted-foreground">
                No setup fees, ever. You only pay the monthly subscription fee for your chosen plan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@cognisite.ai'}
                iconName="Mail"
                iconPosition="left"
              >
                Email Support
              </Button>
              <Button
                variant="default"
                onClick={() => window.location.href = 'tel:+1-555-0123'}
                iconName="Phone"
                iconPosition="left"
              >
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;