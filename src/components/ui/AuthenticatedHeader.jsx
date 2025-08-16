import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import UpgradePrompt from './UpgradePrompt';

const AuthenticatedHeader = ({ 
  user = null, 
  currentProject = null, 
  onProjectSwitch = () => {}, 
  showUpgradePrompts = true,
  userTier = 'free'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const projectSwitcherRef = useRef(null);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/user-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View all your projects'
    },
    {
      label: 'New Analysis',
      path: '/landing-page',
      icon: 'Plus',
      tooltip: 'Start a new website analysis'
    },
    {
      label: 'Account',
      path: '/subscription-management',
      icon: 'Settings',
      tooltip: 'Manage your subscription and settings'
    }
  ];

  const recentProjects = [
    { id: 1, name: 'E-commerce Site Analysis', url: 'shopify-store.com', lastAccessed: '2 hours ago' },
    { id: 2, name: 'Corporate Website', url: 'company-site.com', lastAccessed: '1 day ago' },
    { id: 3, name: 'Blog Analysis', url: 'tech-blog.com', lastAccessed: '3 days ago' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (projectSwitcherRef?.current && !projectSwitcherRef?.current?.contains(event?.target)) {
        setIsProjectSwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleProjectSwitch = (project) => {
    onProjectSwitch(project);
    setIsProjectSwitcherOpen(false);
    navigate('/project-workspace');
  };

  const handleLogout = () => {
    // Logout logic would go here
    navigate('/landing-page');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const Logo = () => (
    <div 
      className="nav-logo cursor-pointer" 
      onClick={() => handleNavigation('/user-dashboard')}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={20} color="white" />
      </div>
      <span className="font-heading font-semibold">CogniSite AI</span>
    </div>
  );

  return (
    <>
      <header className="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="nav-menu">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`nav-menu-item ${isActivePath(item?.path) ? 'nav-menu-item-active' : ''}`}
                  title={item?.tooltip}
                >
                  <Icon name={item?.icon} size={16} className="inline mr-2" />
                  {item?.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Project Switcher */}
              {currentProject && (
                <div className="relative" ref={projectSwitcherRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
                    iconName="ChevronDown"
                    iconPosition="right"
                    iconSize={16}
                  >
                    {currentProject?.name || 'Select Project'}
                  </Button>
                  
                  {isProjectSwitcherOpen && (
                    <div className="nav-dropdown animate-slide-down w-64">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Recent Projects
                        </p>
                      </div>
                      {recentProjects?.map((project) => (
                        <button
                          key={project?.id}
                          onClick={() => handleProjectSwitch(project)}
                          className="nav-dropdown-item w-full text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{project?.name}</p>
                              <p className="text-xs text-muted-foreground">{project?.url}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{project?.lastAccessed}</span>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-border">
                        <button
                          onClick={() => handleNavigation('/user-dashboard')}
                          className="nav-dropdown-item w-full text-left text-primary"
                        >
                          <Icon name="Plus" size={16} className="inline mr-2" />
                          View All Projects
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upgrade Prompt */}
              {showUpgradePrompts && userTier === 'free' && (
                <UpgradePrompt 
                  variant="compact" 
                  onUpgrade={() => handleNavigation('/subscription-management')}
                />
              )}

              {/* User Menu */}
              <div className="nav-user-menu" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <Icon name="ChevronDown" size={16} />
                </Button>

                {isUserMenuOpen && (
                  <div className="nav-dropdown animate-slide-down">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                      {userTier !== 'premium' && (
                        <span className="upgrade-badge mt-1">
                          {userTier === 'free' ? 'Free Plan' : 'Basic Plan'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigation('/subscription-management')}
                      className="nav-dropdown-item"
                    >
                      <Icon name="Settings" size={16} className="inline mr-2" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => handleNavigation('/subscription-management')}
                      className="nav-dropdown-item"
                    >
                      <Icon name="CreditCard" size={16} className="inline mr-2" />
                      Billing
                    </button>
                    <div className="border-t border-border">
                      <button onClick={handleLogout} className="nav-dropdown-item text-error">
                        <Icon name="LogOut" size={16} className="inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="nav-mobile-menu">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="nav-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="nav-mobile-drawer">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                      isActivePath(item?.path) 
                        ? 'bg-primary/10 text-primary' :'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </button>
                ))}
              </nav>

              {/* Mobile Upgrade Prompt */}
              {showUpgradePrompts && userTier === 'free' && (
                <div className="mt-6">
                  <UpgradePrompt 
                    variant="mobile" 
                    onUpgrade={() => {
                      handleNavigation('/subscription-management');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </div>
              )}

              {/* Mobile User Section */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AuthenticatedHeader;