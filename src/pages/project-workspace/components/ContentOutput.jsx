import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentOutput = ({ 
  content = null, 
  isGenerating = false,
  onCopy = () => {},
  className = '' 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard?.writeText(content?.text);
      setCopySuccess(true);
      onCopy(content?.text);
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isGenerating) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3 py-8">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-muted-foreground">Generating content...</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Generated Content Will Appear Here
          </h3>
          <p className="text-muted-foreground">
            Start a conversation with the AI to generate content for your selected section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">Generated Content</h3>
          {content?.section && (
            <span className="text-sm text-muted-foreground">
              • {content?.section}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {content?.wordCount && (
            <span className="text-xs text-muted-foreground">
              {content?.wordCount} words
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            iconName={copySuccess ? "Check" : "Copy"}
            iconPosition="left"
            iconSize={16}
            disabled={!content?.text}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <div 
            className="text-foreground leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: content?.formattedText || content?.text 
            }}
          />
        </div>
        
        {content?.metadata && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {content?.metadata?.tone && (
                <div className="flex items-center space-x-1">
                  <Icon name="Palette" size={12} />
                  <span>Tone: {content?.metadata?.tone}</span>
                </div>
              )}
              {content?.metadata?.targetAudience && (
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>Audience: {content?.metadata?.targetAudience}</span>
                </div>
              )}
              {content?.metadata?.generatedAt && (
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>
                    Generated: {new Date(content.metadata.generatedAt)?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentOutput;