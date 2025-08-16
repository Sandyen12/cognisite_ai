import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ProjectWorkspaceHeader = ({ 
  currentProject = null, 
  onSave = () => {}, 
  saveStatus = 'saved', // 'saving', 'saved', 'error'
  user = null,
  onExit = () => {}
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExit = () => {
    onExit();
    navigate('/user-dashboard');
  };

  const handleLogout = () => {
    navigate('/landing-page');
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Icon name="Loader2" size={16} className="animate-spin" />;
      case 'saved':
        return <Icon name="Check" size={16} color="var(--color-success)" />;
      case 'error':
        return <Icon name="AlertCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="Save" size={16} />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return 'Save';
    }
  };

  const Logo = () => (
    <div 
      className="flex items-center space-x-2 cursor-pointer" 
      onClick={handleExit}
      title="Return to Dashboard"
    >
      <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={16} color="white" />
      </div>
      <span className="font-heading font-semibold text-lg">CogniSite AI</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Logo />

          {/* Project Info & Controls */}
          <div className="flex items-center space-x-4">
            {/* Project Name */}
            {currentProject && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-md">
                <Icon name="Globe" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium truncate max-w-48">
                  {currentProject?.name || currentProject?.url || 'Untitled Project'}
                </span>
              </div>
            )}

            {/* Save Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center space-x-2"
            >
              {getSaveStatusIcon()}
              <span className="hidden sm:inline">{getSaveStatusText()}</span>
            </Button>

            {/* Exit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExit}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
              className="hidden sm:flex"
            >
              Dashboard
            </Button>

            {/* Mobile Exit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="sm:hidden"
              title="Return to Dashboard"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={14} color="white" />
                </div>
                <Icon name="ChevronDown" size={14} className="hidden sm:block" />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-[1100] animate-slide-down">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/user-dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Icon name="LayoutDashboard" size={16} className="inline mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('/subscription-management');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Icon name="Settings" size={16} className="inline mr-2" />
                    Settings
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-error hover:bg-muted transition-colors"
                    >
                      <Icon name="LogOut" size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectWorkspaceHeader;