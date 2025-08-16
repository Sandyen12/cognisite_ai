import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import projectService from '../../../services/projectService';
import errorHandlingService from '../../../services/errorHandlingService';

const HeroSection = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    if (!url || url.trim() === '') {
      return 'Please enter a website URL';
    }
    
    // Add protocol if missing
    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }
    
    try {
      new URL(validUrl);
      return null;
    } catch {
      return 'Please enter a valid website URL (e.g., example.com)';
    }
  };

  const handleAnalyze = async () => {
    setError('');
    
    const validationError = validateUrl(websiteUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Add protocol if missing
      let finalUrl = websiteUrl.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }

      // Create a new project
      const projectData = await projectService.createProject({
        name: `${finalUrl} Analysis`,
        url: finalUrl,
        status: 'analyzing'
      });

      // Navigate to the analysis page
      navigate(`/analyze/${projectData.id}`, {
        state: {
          websiteUrl: finalUrl,
          projectId: projectData.id
        }
      });
    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'landing_page_analysis');
      setError(processedError.userMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Transform Your Website with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> AI-Powered</span>
            <br />Content Analysis
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get professional, engaging content for every section of your website. 
            Our AI analyzes your site structure and generates compelling copy in minutes.
          </p>

          {/* Main CTA Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Ready to enhance your website content?
              </h3>
              
              {/* URL Input */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="Globe" size={20} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your website URL (e.g., example.com)"
                    className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    disabled={isAnalyzing}
                  />
                </div>
                
                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <Icon name="AlertCircle" size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !websiteUrl.trim()}
                  className="w-full py-4 text-lg font-semibold"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                      Analyzing Your Website...
                    </>
                  ) : (
                    <>
                      <Icon name="Zap" size={20} className="mr-2" />
                      Analyze Your Website for Free
                    </>
                  )}
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} className="text-success" />
                  <span>2-3 Minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="CreditCard" size={16} className="text-success" />
                  <span>No Credit Card</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-secondary/20 rounded-full border-2 border-background"></div>
              </div>
              <span className="text-sm">Trusted by 1,000+ websites</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;