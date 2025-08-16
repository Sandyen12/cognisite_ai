import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const NewAnalysisSection = ({ userTier = 'free', currentUsage = {}, onAnalyze }) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Usage limits based on tier
  const limits = {
    free: 5,
    premium: 50,
    enterprise: 1000
  };

  const currentLimit = limits?.[userTier] || limits?.free;
  const usageCount = currentUsage?.total_projects || 0;
  const isAtLimit = usageCount >= currentLimit;

  const validateUrl = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj?.protocol === 'http:' || urlObj?.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAnalyze = async () => {
    setUrlError('');
    
    if (!url?.trim()) {
      setUrlError('Please enter a website URL');
      return;
    }

    // Add protocol if missing
    let formattedUrl = url?.trim();
    if (!formattedUrl?.startsWith('http://') && !formattedUrl?.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (!validateUrl(formattedUrl)) {
      setUrlError('Please enter a valid website URL');
      return;
    }

    if (isAtLimit) {
      setUrlError(`You've reached your ${userTier} plan limit of ${currentLimit} analyses`);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      if (onAnalyze) {
        await onAnalyze(formattedUrl);
      } else {
        // Fallback navigation if onAnalyze not provided
        navigate('/website-analysis-loading', { 
          state: { 
            websiteUrl: formattedUrl,
            projectName: `${new URL(formattedUrl)?.hostname?.replace('www.', '')} Analysis`
          }
        });
      }
    } catch (error) {
      setUrlError('Failed to start analysis. Please try again.');
      console.log('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-8 border border-primary/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side - Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Start New Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Analyze any website with AI-powered insights
              </p>
            </div>
          </div>

          {/* Usage Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">
                {usageCount} / {currentLimit} analyses used
              </span>
            </div>
            
            {userTier === 'free' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/subscription-management')}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                Upgrade for more →
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isAtLimit ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-accent'
              }`}
              style={{ width: `${Math.min((usageCount / currentLimit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Right Side - Input */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => {
                    setUrl(e?.target?.value);
                    setUrlError('');
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isAnalyzing || isAtLimit}
                  className={urlError ? 'border-destructive focus:border-destructive' : ''}
                />
              </div>
              <Button
                variant="default"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isAtLimit || !url?.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-6"
                iconName={isAnalyzing ? "Loader2" : "Play"}
                iconPosition="left"
                iconSize={16}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {/* Error Message */}
            {urlError && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <Icon name="AlertCircle" size={14} />
                <span>{urlError}</span>
              </div>
            )}

            {/* Limit Warning */}
            {isAtLimit && (
              <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} color="var(--color-destructive)" />
                  <span className="text-sm text-destructive font-medium">
                    Analysis limit reached
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/subscription-management')}
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Upgrade
                </Button>
              </div>
            )}

            {/* Help Text */}
            <p className="text-xs text-muted-foreground">
              ✨ Our AI will analyze content, structure, and provide optimization suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAnalysisSection;