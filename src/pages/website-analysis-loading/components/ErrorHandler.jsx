import React from 'react';
import Icon from '../../../components/AppIcon';

const ErrorHandler = ({ error, onRetry, onCancel }) => {
  const getErrorDisplay = () => {
    switch (error?.type) {
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Network Error',
          message: 'Unable to connect to the website. Please check your internet connection.',
          suggestion: 'Check your connection and try again'
        };
      case 'timeout':
        return {
          icon: 'Clock',
          title: 'Request Timeout',
          message: 'The analysis is taking longer than expected.',
          suggestion: 'The website may be slow to respond. Try again in a moment.'
        };
      case 'server_error':
        return {
          icon: 'Server',
          title: 'Server Error',
          message: 'Our analysis service is temporarily unavailable.',
          suggestion: 'Please try again in a few minutes'
        };
      case 'analysis_failed':
        return {
          icon: 'AlertCircle',
          title: 'Analysis Failed',
          message: error?.message || 'Unable to analyze the website',
          suggestion: 'Please check the URL format and ensure the website is accessible'
        };
      case 'invalid_url':
        return {
          icon: 'Link',
          title: 'Invalid URL',
          message: 'The provided website URL appears to be invalid.',
          suggestion: 'Please check the URL format (e.g., https://example.com)'
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Analysis Error',
          message: error?.details || 'An unexpected error occurred during analysis.',
          suggestion: 'Please try again or contact support if the issue persists'
        };
    }
  };

  const errorDisplay = getErrorDisplay();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Error Icon */}
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name={errorDisplay?.icon} size={32} className="text-destructive" />
      </div>
      {/* Error Content */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {errorDisplay?.title}
        </h2>
        
        <p className="text-muted-foreground text-lg">
          {errorDisplay?.message}
        </p>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <Icon name="Info" size={16} className="inline mr-2" />
            {errorDisplay?.suggestion}
          </p>
        </div>

        {/* Additional error details */}
        {error?.details && error?.details !== errorDisplay?.message && (
          <details className="text-left bg-muted/30 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground font-mono overflow-auto">
              {error?.details}
            </pre>
          </details>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          <Icon name="RotateCcw" size={18} className="mr-2" />
          Try Again
        </button>
        
        <button
          onClick={onCancel}
          className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
      {/* Help Section */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Still having issues? Make sure:
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>• The website URL is accessible in your browser</li>
          <li>• The URL includes http:// or https://</li>
          <li>• Your internet connection is stable</li>
          <li>• The website doesn't block automated analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorHandler;