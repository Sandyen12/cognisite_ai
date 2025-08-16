import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import ProgressCircle from './components/ProgressCircle';
import StatusMessage from './components/StatusMessage';
import ActivityLog from './components/ActivityLog';
import TimeEstimate from './components/TimeEstimate';
import LoadingAnimation from './components/LoadingAnimation';
import MotivationalContent from './components/MotivationalContent';
import ErrorHandler from './components/ErrorHandler';
import Icon from '../../components/AppIcon';
import websiteAnalysisService from '../../services/websiteAnalysisService';
import projectService from '../../services/projectService';

const WebsiteAnalysisLoading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get website URL from navigation state
  const websiteUrl = location?.state?.websiteUrl || '';
  
  // Analysis state
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('initializing');
  const [activities, setActivities] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(60); // seconds for real analysis
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Mock user data
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  // Analysis phases mapping
  const phaseMessages = {
    initializing: 'Initializing website analysis...',
    fetching: 'Fetching website content...',
    extracting: 'Extracting page structure...',
    analyzing: 'AI analyzing content and sections...',
    generating: 'Generating recommendations...',
    finalizing: 'Preparing your workspace...'
  };

  // Add activity to log
  const addActivity = (type, message, details = null) => {
    const newActivity = {
      type,
      message,
      details,
      timestamp: new Date()?.toISOString()
    };
    setActivities(prev => [...prev, newActivity]);
  };

  // Progress callback for analysis service
  const onProgress = (progressValue) => {
    setProgress(progressValue);
    
    // Update current phase based on progress
    if (progressValue <= 5) setCurrentPhase('initializing');
    else if (progressValue <= 25) setCurrentPhase('fetching');
    else if (progressValue <= 45) setCurrentPhase('extracting');
    else if (progressValue <= 70) setCurrentPhase('analyzing');
    else if (progressValue <= 85) setCurrentPhase('generating');
    else if (progressValue < 100) setCurrentPhase('finalizing');
  };

  // Activity callback for analysis service
  const onActivity = (type, message, details = null) => {
    addActivity(type, message, details);
  };

  // Run real website analysis
  useEffect(() => {
    let analysisTimeout;
    let elapsedInterval;
    let aborted = false;

    const runRealAnalysis = async () => {
      try {
        if (!websiteUrl || websiteUrl?.trim() === '') {
          throw new Error('No website URL provided');
        }

        // Start elapsed time counter
        elapsedInterval = setInterval(() => {
          if (!aborted) {
            setElapsedTime(prev => prev + 1);
          }
        }, 1000);

        // Run the actual analysis
        const results = await websiteAnalysisService?.analyzeWebsite(
          websiteUrl,
          onProgress,
          onActivity
        );

        if (aborted) return;

        setAnalysisResults(results);
        setIsComplete(true);

        // Create project in database
        try {
          const projectData = await projectService?.createProject({
            name: results?.title || `${websiteUrl} Analysis`,
            url: websiteUrl,
            analysis_data: results
          });

          // Navigate to project workspace with real results
          setTimeout(() => {
            navigate('/project-workspace', {
              state: {
                websiteUrl,
                analysisComplete: true,
                projectData: {
                  ...projectData,
                  analysisResults: results
                }
              }
            });
          }, 2000);

        } catch (dbError) {
          console.error('Error saving project:', dbError);
          // Still navigate with results even if DB save fails
          setTimeout(() => {
            navigate('/project-workspace', {
              state: {
                websiteUrl,
                analysisComplete: true,
                projectData: {
                  id: Date.now(),
                  name: results?.title || `${websiteUrl} Analysis`,
                  url: websiteUrl,
                  created_at: new Date()?.toISOString(),
                  status: 'completed',
                  analysisResults: results
                }
              }
            });
          }, 2000);
        }

      } catch (analysisError) {
        if (aborted) return;
        
        console.error('Website analysis failed:', analysisError);
        setError({
          type: 'analysis_failed',
          message: analysisError?.message || 'Website analysis failed',
          details: analysisError?.message || 'Unable to analyze the provided website. Please check the URL and try again.'
        });
      }
    };

    // Start analysis with slight delay
    analysisTimeout = setTimeout(() => {
      runRealAnalysis();
    }, 1000);

    // Cleanup function
    return () => {
      aborted = true;
      clearTimeout(analysisTimeout);
      clearInterval(elapsedInterval);
    };
  }, [websiteUrl, navigate]);

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setCurrentPhase('initializing');
    setActivities([]);
    setElapsedTime(0);
    setIsComplete(false);
    setAnalysisResults(null);
  };

  const handleCancel = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={mockUser} />
      
      <main className="main-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <ErrorHandler
              error={error}
              onRetry={handleRetry}
              onCancel={handleCancel}
            />
          ) : (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center">
                <LoadingAnimation />
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Analyzing Your Website
                </h1>
                <p className="text-muted-foreground">
                  Our AI is analyzing {websiteUrl || 'your website'} to provide personalized insights and recommendations
                </p>
              </div>

              {/* Progress Section */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column - Progress & Status */}
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <ProgressCircle progress={progress} size={140} />
                  </div>
                  
                  <StatusMessage 
                    currentPhase={currentPhase} 
                    websiteUrl={websiteUrl}
                    customMessage={phaseMessages?.[currentPhase]}
                  />
                  
                  <TimeEstimate 
                    estimatedTime={estimatedTime}
                    elapsedTime={elapsedTime}
                  />
                </div>

                {/* Right Column - Activity Log */}
                <div className="space-y-6">
                  <ActivityLog activities={activities} />
                  
                  {/* Mobile-friendly motivational content */}
                  <div className="lg:hidden">
                    <MotivationalContent websiteUrl={websiteUrl} />
                  </div>
                </div>
              </div>

              {/* Desktop Motivational Content */}
              <div className="hidden lg:block">
                <MotivationalContent websiteUrl={websiteUrl} />
              </div>

              {/* Completion Message */}
              {isComplete && analysisResults && (
                <div className="text-center bg-success/10 border border-success/20 rounded-lg p-6">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analysis Complete!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Successfully analyzed {websiteUrl || 'your website'} and found {analysisResults?.sections?.length || 0} key sections
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>• {analysisResults?.metadata?.word_count || 0} words analyzed</p>
                    <p>• {analysisResults?.recommendations?.length || 0} improvement recommendations generated</p>
                    <p>• Ready to start optimizing your website content</p>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Redirecting you to your personalized workspace...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WebsiteAnalysisLoading;