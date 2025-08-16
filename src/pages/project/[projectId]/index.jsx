import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import projectService from '../../../services/projectService';
import { chatService } from '../../../services/chatService';
import errorHandlingService from '../../../services/errorHandlingService';

const ProjectWorkspace = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const websiteUrl = location.state?.websiteUrl || '';
  const analysisResults = location.state?.analysisResults;

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    if (selectedSection) {
      loadChatMessages();
      loadGeneratedContent();
    }
  }, [selectedSection]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const projectData = await projectService.getProjectWithSections(projectId);
      setProject(projectData);
      setSections(projectData.website_sections || []);
      
      // Select first section by default
      if (projectData.website_sections?.length > 0) {
        setSelectedSection(projectData.website_sections[0]);
      }
    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'project_load');
      setError(processedError.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatMessages = async () => {
    try {
      const messages = await chatService.getChatMessages(projectId, selectedSection.id);
      setChatMessages(messages);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  const loadGeneratedContent = async () => {
    try {
      const content = await chatService.getGeneratedContent(selectedSection.id);
      setGeneratedContent(content);
    } catch (err) {
      console.error('Failed to load generated content:', err);
    }
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setChatMessages([]);
    setGeneratedContent(null);
    setInputMessage('');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending || !selectedSection) return;

    setIsSending(true);
    try {
      // Add user message to chat
      const userMessage = await chatService.sendMessage(
        projectId,
        selectedSection.id,
        inputMessage.trim(),
        user?.id || 'anonymous'
      );
      
      setChatMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // Generate AI response
      const aiResponse = await chatService.generateAIResponse(inputMessage.trim(), selectedSection);
      
      // Save AI response
      const savedResponse = await chatService.saveAIResponse(
        projectId,
        selectedSection.id,
        user?.id || 'anonymous',
        aiResponse.content,
        aiResponse.suggestions
      );

      setChatMessages(prev => [...prev, savedResponse]);

      // Check if we should generate content
      if (chatMessages.length >= 2) { // After some conversation
        await generateContent();
      }

    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'chat_message');
      setError(processedError.userMessage);
    } finally {
      setIsSending(false);
    }
  };

  const generateContent = async () => {
    try {
      const content = await chatService.generateContent(
        selectedSection.id,
        `Generate professional content for ${selectedSection.name} section`,
        user?.id || 'anonymous'
      );
      setGeneratedContent(content);
    } catch (err) {
      console.error('Failed to generate content:', err);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('hero')) return 'Zap';
    if (name.includes('about')) return 'Info';
    if (name.includes('service') || name.includes('product')) return 'Package';
    if (name.includes('contact')) return 'Phone';
    if (name.includes('testimonial')) return 'MessageSquare';
    if (name.includes('footer')) return 'Layout';
    return 'FileText';
  };

  const getInitialPrompt = (section) => {
    const prompts = {
      'Hero Section': "Let's create a compelling hero section! What's the main value proposition of your website? What action do you want visitors to take?",
      'About Us': "Time to tell your story! What makes your company unique? What's your mission and what sets you apart from competitors?",
      'Services': "Let's showcase your services! What are your main offerings and what benefits do they provide to customers?",
      'Products': "Let's highlight your products! What are your key products and what problems do they solve for customers?",
      'Contact': "Let's make it easy for customers to reach you! What contact information should be prominent and how can visitors get in touch?",
      'Testimonials': "Social proof is powerful! Do you have any customer testimonials, reviews, or success stories you'd like to feature?",
      'Footer': "Let's create a comprehensive footer! What important links, contact info, and legal information should be included?"
    };
    
    return prompts[section.name] || `Let's create great content for your ${section.name}! What specific information would you like to include in this section?`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertCircle" size={32} className="text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Project</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Site Structure Navigator */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={16} className="text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">CogniSite AI</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">{project?.name}</h1>
            <p className="text-sm text-muted-foreground">{websiteUrl || project?.url}</p>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Website Sections
            </h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedSection?.id === section.id
                      ? 'bg-primary/10 border-primary/20 shadow-sm'
                      : 'bg-muted/30 border-transparent hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedSection?.id === section.id
                        ? 'bg-primary/20'
                        : 'bg-muted'
                    }`}>
                      <Icon 
                        name={getSectionIcon(section.name)} 
                        size={20} 
                        className={selectedSection?.id === section.id ? 'text-primary' : 'text-muted-foreground'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{section.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{section.page}</p>
                    </div>
                    {section.status === 'completed' && (
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {sections.length} sections identified
          </div>
        </div>
      </div>

      {/* Main Content Area - AI Chat Interface */}
      <div className="flex-1 flex flex-col">
        {selectedSection ? (
          <>
            {/* Chat Header */}
            <div className="bg-card border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedSection.name}</h2>
                  <p className="text-muted-foreground">{selectedSection.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedSection.status === 'completed' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {selectedSection.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Initial AI Prompt */}
                {chatMessages.length === 0 && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Icon name="Bot" size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <p className="text-foreground">{getInitialPrompt(selectedSection)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">CogniSite AI</p>
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex items-start space-x-4 ${
                    message.is_user_message ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.is_user_message 
                        ? 'bg-secondary' 
                        : 'bg-gradient-to-br from-primary to-accent'
                    }`}>
                      <Icon 
                        name={message.is_user_message ? 'User' : 'Bot'} 
                        size={20} 
                        className="text-white" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-2xl p-4 ${
                        message.is_user_message 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/30'
                      }`}>
                        <p className="text-foreground">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.is_user_message ? 'You' : 'CogniSite AI'} • {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Generated Content */}
                {generatedContent && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Final Content</h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.content)}
                        className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Icon name="Copy" size={16} />
                        <span>Copy to Clipboard</span>
                      </button>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: generatedContent.formatted_content }}
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        {generatedContent.word_count} words • Generated {new Date(generatedContent.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-card border-t border-border p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Tell me about your ${selectedSection.name.toLowerCase()}...`}
                      className="w-full p-4 border border-border rounded-xl bg-background resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSending ? (
                      <Icon name="Loader2" size={20} className="animate-spin" />
                    ) : (
                      <Icon name="Send" size={20} />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>{inputMessage.length}/500</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Section</h3>
              <p className="text-muted-foreground">Choose a section from the sidebar to start creating content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWorkspace;