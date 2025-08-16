import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Import pages
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import ProjectWorkspace from './pages/project-workspace';
import SubscriptionManagement from './pages/subscription-management';
import WebsiteAnalysisLoading from './pages/website-analysis-loading';
import NotFound from './pages/NotFound';

// Import auth pages
import SignIn from './pages/auth/signin';
import SignUp from './pages/auth/signup';

// Import setup pages
import SetupStatus from './pages/setup-status';

// Import analysis pages
import AnalysisPage from './pages/analyze/[projectId]';

// Import project pages
import ProjectWorkspaceNew from './pages/project/[projectId]';

// Import dashboard pages
import Dashboard from './pages/dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          
          {/* Auth routes - accessible for development preview */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          
          {/* Setup and status routes */}
          <Route path="/setup-status" element={<SetupStatus />} />
          
          {/* Analysis routes */}
          <Route path="/analyze/:projectId" element={<AnalysisPage />} />
          
          {/* Project routes */}
          <Route path="/project/:projectId" element={<ProjectWorkspaceNew />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Protected routes - accessible for development preview */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/project-workspace" element={<ProjectWorkspace />} />
          <Route path="/subscription-management" element={<SubscriptionManagement />} />
          <Route path="/website-analysis-loading" element={<WebsiteAnalysisLoading />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;