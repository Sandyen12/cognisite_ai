import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Pricing', onClick: () => navigate('/subscription-management') },
        { label: 'API Documentation', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press Kit', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Status Page', href: '#' },
        { label: 'Community', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
    { name: 'GitHub', icon: 'Github', href: '#' },
    { name: 'Discord', icon: 'MessageSquare', href: '#' }
  ];

  const handleScrollTo = (elementId) => {
    const element = document.querySelector(elementId);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={20} color="white" />
      </div>
      <span className="font-heading font-bold text-xl text-foreground">CogniSite AI</span>
    </div>
  );

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
                Transform your website content with AI-powered analysis and generation. 
                Create professional, engaging copy in minutes, not hours.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Stay updated with our latest features
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button variant="default" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Follow us
                </h4>
                <div className="flex space-x-3">
                  {socialLinks?.map((social) => (
                    <a
                      key={social?.name}
                      href={social?.href}
                      className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                      title={social?.name}
                    >
                      <Icon name={social?.icon} size={18} className="text-muted-foreground hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections?.map((section) => (
                  <div key={section?.title}>
                    <h4 className="text-sm font-semibold text-foreground mb-4">
                      {section?.title}
                    </h4>
                    <ul className="space-y-3">
                      {section?.links?.map((link) => (
                        <li key={link?.label}>
                          {link?.onClick ? (
                            <button
                              onClick={link?.onClick}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                              {link?.label}
                            </button>
                          ) : (
                            <button
                              onClick={() => link?.href?.startsWith('#') ? handleScrollTo(link?.href) : window.open(link?.href, '_blank')}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                              {link?.label}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
              <span>© {currentYear} CogniSite AI. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Icon name="Shield" size={16} className="mr-2 text-success" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Award" size={16} className="mr-2 text-success" />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Made with</span>
              <Icon name="Heart" size={16} className="text-error" />
              <span>for better web content</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;