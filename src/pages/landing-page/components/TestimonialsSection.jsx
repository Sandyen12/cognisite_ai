import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'TechStart Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: `CogniSite AI transformed our website content in hours, not weeks. The AI understood our brand voice perfectly and generated copy that converted 40% better than our previous content.`,
      rating: 5,
      highlight: '40% better conversion'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Founder & CEO',
      company: 'Digital Solutions Co.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: `As a startup founder, I needed professional website content fast. CogniSite AI delivered exactly what I needed - professional, engaging copy that speaks to our target audience.`,
      rating: 5,
      highlight: 'Professional results'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Freelance Web Designer',
      company: 'Creative Studio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: `This tool is a game-changer for my client projects. I can now offer comprehensive content services alongside design, and my clients love the quality and speed of delivery.`,
      rating: 5,
      highlight: 'Game-changer'
    }
  ];

  const stats = [
    { label: 'Websites Analyzed', value: '10,000+', icon: 'Globe' },
    { label: 'Content Pieces Generated', value: '50,000+', icon: 'FileText' },
    { label: 'Average Time Saved', value: '15 hours', icon: 'Clock' },
    { label: 'Customer Satisfaction', value: '4.9/5', icon: 'Star' }
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how CogniSite AI is helping businesses create better website content faster
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name={stat?.icon} size={24} color="white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {stat?.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial?.rating)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-accent fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial?.content}"
              </blockquote>

              {/* Highlight */}
              <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-4">
                <Icon name="TrendingUp" size={14} className="mr-2" />
                {testimonial?.highlight}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image 
                    src={testimonial?.avatar} 
                    alt={testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial?.role}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial?.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Shield" size={20} className="mr-2 text-success" />
              SSL Secured
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Lock" size={20} className="mr-2 text-success" />
              GDPR Compliant
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Award" size={20} className="mr-2 text-success" />
              SOC 2 Certified
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Headphones" size={20} className="mr-2 text-success" />
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;