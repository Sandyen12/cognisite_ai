import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateUrl = (inputUrl) => {
    if (!inputUrl?.trim()) {
      return 'Please enter a website URL';
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern?.test(inputUrl?.trim())) {
      return 'Please enter a valid website URL (e.g., example.com)';
    }
    
    return '';
  };

  const handleUrlChange = (e) => {
    const value = e?.target?.value;
    setUrl(value);
    
    if (urlError && value?.trim()) {
      const error = validateUrl(value);
      if (!error) {
        setUrlError('');
      }
    }
  };

  const handleAnalyze = async () => {
    const error = validateUrl(url);
    if (error) {
      setUrlError(error);
      return;
    }

    setIsLoading(true);
    setUrlError('');

    // Simulate API call delay
    setTimeout(() => {
      // Store the URL for the analysis process
      localStorage.setItem('analysisUrl', url?.trim());
      navigate('/website-analysis-loading');
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-background via-muted/30 to-primary/5 py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-4">
              <Icon name="Sparkles" size={16} className="mr-2" />
              AI-Powered Website Analysis
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Analyze Your Website
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                for Free
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get instant AI-powered insights about your website's structure and generate 
              professional content for every section with our intelligent chat interface.
            </p>
          </div>

          {/* URL Input Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter your website URL (e.g., yoursite.com)"
                  value={url}
                  onChange={handleUrlChange}
                  onKeyPress={handleKeyPress}
                  error={urlError}
                  className="text-lg"
                  disabled={isLoading}
                />
                
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleAnalyze}
                  loading={isLoading}
                  disabled={!url?.trim() || isLoading}
                  iconName="Search"
                  iconPosition="left"
                  fullWidth
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg py-4"
                >
                  {isLoading ? 'Starting Analysis...' : 'Analyze Your Website for Free'}
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="mr-2 text-success" />
                No signup required • Free analysis • Instant results
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Icon name="Users" size={16} className="mr-2 text-accent" />
              10,000+ websites analyzed
            </div>
            <div className="flex items-center">
              <Icon name="Clock" size={16} className="mr-2 text-accent" />
              Results in under 60 seconds
            </div>
            <div className="flex items-center">
              <Icon name="Star" size={16} className="mr-2 text-accent" />
              4.9/5 user rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;