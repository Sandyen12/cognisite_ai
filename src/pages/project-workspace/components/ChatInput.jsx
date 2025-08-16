import React, { useState, useRef, useEffect } from 'react';

import Button from '../../../components/ui/Button';

const ChatInput = ({ 
  onSendMessage = () => {},
  isLoading = false,
  suggestions = [],
  placeholder = "Ask me to generate content for this section...",
  className = '' 
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef?.current?.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !isLoading) {
      onSendMessage(message?.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef?.current?.focus();
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Suggestions */}
      {suggestions?.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Suggested prompts:
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowSuggestions(!showSuggestions)}
              iconName={showSuggestions ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              iconSize={14}
            >
              {showSuggestions ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {(showSuggestions || suggestions?.length <= 3) && (
            <div className="flex flex-wrap gap-2">
              {suggestions?.slice(0, showSuggestions ? suggestions?.length : 3)?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full border border-border hover:border-primary/30 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              className="w-full resize-none border-0 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 text-sm leading-relaxed min-h-[40px] max-h-32 overflow-y-auto"
              style={{ scrollbarWidth: 'thin' }}
            />
          </div>
          
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={!message?.trim() || isLoading}
            loading={isLoading}
            iconName="Send"
            iconPosition="right"
            iconSize={16}
            className="flex-shrink-0"
          >
            Send
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message?.length}/2000</span>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;