import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ 
  message, 
  isUser = false, 
  timestamp = null,
  className = '' 
}) => {
  const formatTimestamp = (date) => {
    if (!date) return '';
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary ml-3' : 'bg-accent mr-3'
        }`}>
          <Icon 
            name={isUser ? "User" : "Brain"} 
            size={16} 
            color="white" 
          />
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-lg ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message?.content}
            </div>
            
            {message?.suggestions && message?.suggestions?.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs opacity-80 font-medium">Suggested prompts:</p>
                {message?.suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-3 py-2 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20 hover:border-white/30 transition-colors"
                    onClick={() => {
                      // This would trigger the suggestion in the parent component
                      if (message?.onSuggestionClick) {
                        message?.onSuggestionClick(suggestion);
                      }
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {timestamp && (
            <span className="text-xs text-muted-foreground mt-1">
              {formatTimestamp(timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;