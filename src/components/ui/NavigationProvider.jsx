import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

const NavigationProvider = ({ children }) => {
  const [navigationVisible, setNavigationVisible] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('free'); // 'free', 'basic', 'premium'
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Determine navigation visibility based on current route
  useEffect(() => {
    const path = location?.pathname;
    
    // Hide navigation on project workspace for focused work
    if (path === '/project-workspace') {
      setNavigationVisible(false);
    } else {
      setNavigationVisible(true);
    }
  }, [location?.pathname]);

  // Handle responsive breakpoints
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock user data - in real app this would come from auth context
  useEffect(() => {
    // Simulate authenticated user
    setUser({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: null
    });

    // Simulate current project
    setCurrentProject({
      id: 1,
      name: 'E-commerce Analysis',
      url: 'shopify-store.com',
      lastAccessed: new Date()?.toISOString(),
      status: 'completed'
    });

    // Simulate user tier based on subscription
    setUserTier('free'); // This would come from subscription data
  }, []);

  const handleProjectSwitch = (project) => {
    setCurrentProject(project);
    setProjectSwitcherOpen(false);
  };

  const handleUserTierChange = (newTier) => {
    setUserTier(newTier);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const shouldShowUpgradePrompts = () => {
    return userTier === 'free' || userTier === 'basic';
  };

  const getNavigationType = () => {
    const path = location?.pathname;
    
    if (path === '/project-workspace') {
      return 'minimal';
    } else if (isAuthenticated()) {
      return 'authenticated';
    } else {
      return 'public';
    }
  };

  const contextValue = {
    // Navigation state
    navigationVisible,
    setNavigationVisible,
    navigationType: getNavigationType(),
    
    // Project state
    currentProject,
    setCurrentProject,
    handleProjectSwitch,
    projectSwitcherOpen,
    setProjectSwitcherOpen,
    
    // User state
    user,
    setUser,
    userTier,
    setUserTier: handleUserTierChange,
    isAuthenticated: isAuthenticated(),
    
    // UI state
    isMobile,
    showUpgradePrompts: shouldShowUpgradePrompts(),
    
    // Route helpers
    currentPath: location?.pathname,
    isProjectWorkspace: location?.pathname === '/project-workspace',
    isDashboard: location?.pathname === '/user-dashboard',
    isLandingPage: location?.pathname === '/landing-page',
    isSubscriptionPage: location?.pathname === '/subscription-management',
    isAnalysisLoading: location?.pathname === '/website-analysis-loading'
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;