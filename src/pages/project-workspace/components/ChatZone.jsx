import React, { useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import ChatMessage from './ChatMessage';

const ChatZone = ({ 
  messages = [], 
  isLoading = false,
  activeSection = null,
  className = '' 
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = () => {
    if (!activeSection) {
      return {
        content: `Welcome to CogniSite AI! 🚀\n\nI'm here to help you generate high-quality content for your website. Select a section from the sidebar to get started, and I'll provide tailored suggestions and generate content that matches your brand and audience.\n\nLet's create something amazing together!`,
        suggestions: [
          "Show me all website sections",
          "What can you help me with?",
          "How does content generation work?"
        ]
      };
    }

    return {
      content: `Great! Let's work on the "${activeSection?.name}" section.\n\nI can help you create engaging content that resonates with your audience. What would you like me to focus on for this section?`,
      suggestions: [
        `Write compelling copy for ${activeSection?.name}`,
        `Improve the existing ${activeSection?.name} content`,
        `Create a call-to-action for ${activeSection?.name}`,
        `Generate SEO-optimized content for ${activeSection?.name}`
      ]
    };
  };

  const welcomeMessage = getWelcomeMessage();

  return (
    <div className={`bg-card border border-border rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">AI Conversation</h3>
          {activeSection && (
            <span className="text-sm text-muted-foreground">
              • {activeSection?.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {messages?.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {messages?.length} messages
            </span>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">AI Online</span>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[400px] max-h-[500px]">
        {messages?.length === 0 ? (
          <ChatMessage 
            message={welcomeMessage}
            isUser={false}
            timestamp={new Date()}
          />
        ) : (
          messages?.map((message, index) => (
            <ChatMessage
              key={message?.id || index}
              message={message}
              isUser={message?.isUser}
              timestamp={message?.timestamp}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Icon name="Brain" size={16} color="white" />
              </div>
              <div className="bg-muted px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {activeSection 
              ? `Generating content for: ${activeSection?.name}` 
              : 'Select a section to start generating content'
            }
          </span>
          <div className="flex items-center space-x-4">
            <span>Powered by AI</span>
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={12} />
              <span>Fast responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatZone;