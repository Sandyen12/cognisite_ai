import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import { chatService } from '../../services/chatService';
import ProjectWorkspaceHeader from '../../components/ui/ProjectWorkspaceHeader';
import SectionSidebar from './components/SectionSidebar';
import ChatZone from './components/ChatZone';
import ChatInput from './components/ChatInput';
import ContentOutput from './components/ContentOutput';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProjectWorkspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [websiteSections, setWebsiteSections] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get project from navigation state or URL params
  const projectFromState = location?.state?.project;

  // Load project and sections
  useEffect(() => {
    if (authLoading || !user) return;

    const loadProjectData = async () => {
      setProjectLoading(true);
      try {
        let project = projectFromState;
        
        if (!project) {
          setError('No project selected');
          return;
        }

        // Get project with sections
        const projectWithSections = await projectService?.getProjectWithSections(project?.id);
        
        setCurrentProject(projectWithSections);
        setWebsiteSections(projectWithSections?.website_sections || []);
        
        // Set first section as active if none selected
        if (projectWithSections?.website_sections?.length > 0 && !activeSection) {
          setActiveSection(projectWithSections?.website_sections?.[0]);
        }
        
        setError(null);
      } catch (err) {
        if (err?.message?.includes('Failed to fetch') || 
            err?.message?.includes('NetworkError')) {
          setError('Cannot connect to database. Your Supabase project may be paused or deleted.');
        } else {
          setError('Failed to load project data');
        }
        console.log('Project load error:', err);
      } finally {
        setProjectLoading(false);
      }
    };

    loadProjectData();
  }, [user, authLoading, projectFromState]);

  // Load chat messages when active section changes
  useEffect(() => {
    if (!activeSection || !currentProject || !user) return;

    const loadChatMessages = async () => {
      try {
        const chatMessages = await chatService?.getChatMessages(currentProject?.id, activeSection?.id);
        const formattedMessages = chatMessages?.map(msg => ({
          id: msg?.id,
          content: msg?.content,
          isUser: msg?.is_user_message,
          timestamp: new Date(msg.created_at),
          suggestions: msg?.suggestions ? JSON.parse(msg?.suggestions) : null
        })) || [];
        
        setMessages(formattedMessages);
        
        // Load generated content for this section
        const content = await chatService?.getGeneratedContent(activeSection?.id);
        if (content) {
          setGeneratedContent({
            id: content?.id,
            section: activeSection?.name,
            text: content?.content,
            formattedText: content?.formatted_content,
            wordCount: content?.word_count,
            metadata: content?.metadata
          });
        } else {
          setGeneratedContent(null);
        }
      } catch (err) {
        console.log('Failed to load chat messages:', err);
      }
    };

    loadChatMessages();
  }, [activeSection, currentProject, user]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionSelect = async (section) => {
    setActiveSection(section);
    setMessages([]);
    setGeneratedContent(null);
    setIsMobileMenuOpen(false);
    
    // Update section status to in-progress if it was pending
    if (section?.status === 'pending') {
      try {
        await projectService?.updateSection(section?.id, { status: 'in-progress' });
        // Update local state
        setWebsiteSections(prev => prev?.map(s => 
          s?.id === section?.id ? { ...s, status: 'in-progress' } : s
        ));
      } catch (err) {
        console.log('Failed to update section status:', err);
      }
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!messageContent?.trim() || !activeSection || !currentProject || !user) return;

    const userMessage = {
      id: Date.now(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to database
      await chatService?.sendMessage(currentProject?.id, activeSection?.id, messageContent, user?.id);

      // Generate AI response
      const aiResponse = await chatService?.generateAIResponse(messageContent, activeSection);
      
      const aiMessage = {
        id: Date.now() + 1,
        content: aiResponse?.content,
        isUser: false,
        timestamp: new Date(),
        suggestions: aiResponse?.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to database
      await chatService?.saveAIResponse(
        currentProject?.id, 
        activeSection?.id, 
        user?.id, 
        aiResponse?.content, 
        aiResponse?.suggestions
      );

      // If the message was asking for content generation, start generating content
      if (messageContent?.toLowerCase()?.includes('write') || 
          messageContent?.toLowerCase()?.includes('generate') ||
          messageContent?.toLowerCase()?.includes('create')) {
        generateContent(activeSection, messageContent);
      }
    } catch (err) {
      console.log('Failed to process message:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 2000);
    }
  };

  const generateContent = async (section, prompt) => {
    if (!section || !user) return;

    setIsGeneratingContent(true);

    try {
      const content = await chatService?.generateContent(section?.id, prompt, user?.id);
      
      setGeneratedContent({
        id: content?.id,
        section: section?.name,
        text: content?.content,
        formattedText: content?.formatted_content,
        wordCount: content?.word_count,
        metadata: content?.metadata
      });

      // Update section status to completed and word count
      await projectService?.updateSection(section?.id, { 
        status: 'completed',
        word_count: content?.word_count,
        content: content?.content,
        ai_generated_content: content?.formatted_content
      });

      // Update local state
      setWebsiteSections(prev => prev?.map(s => 
        s?.id === section?.id ? { 
          ...s, 
          status: 'completed', 
          word_count: content?.word_count,
          content: content?.content,
          ai_generated_content: content?.formatted_content
        } : s
      ));
      
    } catch (err) {
      console.log('Failed to generate content:', err);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);
  };

  const handleExit = () => {
    navigate('/user-dashboard');
  };

  const handleCopyContent = (content) => {
    navigator.clipboard?.writeText(content)?.then(() => {
      console.log('Content copied successfully');
    })?.catch(() => {
      console.log('Failed to copy content');
    });
  };

  // Show loading while auth or project is loading
  if (authLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to access the workspace</p>
          <Button
            variant="default"
            onClick={() => navigate('/auth/signin')}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ProjectWorkspaceHeader
          currentProject={currentProject}
          onSave={handleSave}
          saveStatus={saveStatus}
          user={user}
          onExit={handleExit}
        />
        <div className="main-content-minimal flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <Icon name="AlertCircle" size={48} color="var(--color-destructive)" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Project</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex space-x-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/user-dashboard')}>
                Back to Dashboard
              </Button>
              <Button variant="default" onClick={() => window.location?.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ProjectWorkspaceHeader
        currentProject={currentProject}
        onSave={handleSave}
        saveStatus={saveStatus}
        user={user}
        onExit={handleExit}
      />
      {/* Main Content */}
      <div className="main-content-minimal">
        <div className="flex h-[calc(100vh-56px)]">
          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed top-20 left-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName="Menu"
              iconSize={20}
            />
          </div>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative z-50 lg:z-0 transition-transform duration-300 ease-in-out
            ${isSidebarCollapsed ? 'lg:w-12' : 'lg:w-80'}
            w-80 h-full
          `}>
            <SectionSidebar
              sections={websiteSections}
              activeSection={activeSection}
              onSectionSelect={handleSectionSelect}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="h-full"
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
            {/* Chat Section */}
            <div className="flex-1 flex flex-col space-y-4 min-w-0">
              <ChatZone
                messages={messages}
                isLoading={isLoading}
                activeSection={activeSection}
                className="flex-1"
              />
              
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                suggestions={chatService?.getSuggestionsForSection(activeSection)}
                placeholder={
                  activeSection 
                    ? `Ask me to generate content for ${activeSection?.name}...`
                    : "Select a section to start generating content..."
                }
              />
            </div>

            {/* Content Output Section */}
            <div className="lg:w-96 flex-shrink-0">
              <ContentOutput
                content={generatedContent}
                isGenerating={isGeneratingContent}
                onCopy={handleCopyContent}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Section Cards (Tablet/Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {websiteSections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => handleSectionSelect(section)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${activeSection?.id === section?.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary/30'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <span>{section?.name}</span>
                {section?.status === 'completed' && (
                  <Icon name="CheckCircle2" size={14} color="var(--color-success)" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;