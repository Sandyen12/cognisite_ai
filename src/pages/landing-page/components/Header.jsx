import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleScrollTo = (elementId) => {
    const element = document.querySelector(elementId);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/landing-page')}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={20} color="white" />
      </div>
      <span className="font-heading font-bold text-xl text-foreground">CogniSite AI</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <button
                key={item?.label}
                onClick={() => handleScrollTo(item?.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item?.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/user-dashboard')}
            >
              Sign In
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleNavigation('/subscription-management')}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={16}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 w-80 bg-card border-l border-border shadow-lg z-50 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6">
              {/* Navigation Links */}
              <nav className="space-y-4 mb-8">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.label}
                    onClick={() => handleScrollTo(item?.href)}
                    className="block w-full text-left px-4 py-3 text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {item?.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleNavigation('/user-dashboard')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => handleNavigation('/subscription-management')}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Get Started Free
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center">
                    <Icon name="Mail" size={16} className="mr-2" />
                    support@cognisite.ai
                  </div>
                  <div className="flex items-center">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Live chat support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;