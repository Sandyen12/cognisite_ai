import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import websiteAnalysisService from '../../../services/websiteAnalysisService';
import projectService from '../../../services/projectService';
import errorHandlingService from '../../../services/errorHandlingService';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const websiteUrl = location.state?.websiteUrl || '';
  
  const analysisSteps = [
    {
      id: 0,
      icon: 'Globe',
      title: 'Accessing your website...',
      description: 'Connecting to your website and fetching content',
      duration: 2000
    },
    {
      id: 1,
      icon: 'Code',
      title: 'Parsing HTML structure...',
      description: 'Analyzing DOM elements and page structure',
      duration: 3000
    },
    {
      id: 2,
      icon: 'Brain',
      title: 'AI analyzing content sections...',
      description: 'Identifying key content areas and their purposes',
      duration: 4000
    },
    {
      id: 3,
      icon: 'Search',
      title: 'Extracting SEO insights...',
      description: 'Evaluating content quality and optimization opportunities',
      duration: 3000
    },
    {
      id: 4,
      icon: 'Lightbulb',
      title: 'Generating recommendations...',
      description: 'Creating personalized content suggestions',
      duration: 2000
    },
    {
      id: 5,
      icon: 'Workspace',
      title: 'Preparing your workspace...',
      description: 'Setting up your personalized content interface',
      duration: 1000
    }
  ];

  useEffect(() => {
    if (!websiteUrl || !projectId) {
      navigate('/');
      return;
    }

    startAnalysis();
  }, [websiteUrl, projectId]);

  const startAnalysis = async () => {
    try {
      // Start the step-by-step progress simulation
      simulateProgress();
      
      // Run the actual analysis in parallel
      const results = await websiteAnalysisService.analyzeWebsite(
        websiteUrl,
        (progressValue) => {
          // Update progress from actual analysis
          setProgress(Math.max(progress, progressValue));
        },
        (type, message) => {
          // Handle activity updates if needed
          console.log(`Analysis activity: ${type} - ${message}`);
        }
      );

      // Update project with results
      await projectService.updateProject(projectId, {
        status: 'completed',
        analysis_data: results,
        progress: 100
      });

      setAnalysisResults(results);
      setIsComplete(true);

      // Wait a moment to show completion, then redirect
      setTimeout(() => {
        navigate(`/project/${projectId}`, {
          state: {
            websiteUrl,
            analysisResults: results,
            projectId
          }
        });
      }, 2000);

    } catch (err) {
      const processedError = errorHandlingService.handleError(err, 'website_analysis');
      setError(processedError);
      
      // Update project status to failed
      try {
        await projectService.updateProject(projectId, {
          status: 'failed',
          error_message: processedError.userMessage
        });
      } catch (updateErr) {
        console.error('Failed to update project status:', updateErr);
      }
    }
  };

  const simulateProgress = () => {
    let stepIndex = 0;
    
    const progressStep = () => {
      if (stepIndex < analysisSteps.length) {
        setCurrentStep(stepIndex);
        setProgress(((stepIndex + 1) / analysisSteps.length) * 100);
        
        setTimeout(() => {
          stepIndex++;
          progressStep();
        }, analysisSteps[stepIndex].duration);
      }
    };
    
    progressStep();
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setCurrentStep(0);
    setIsComplete(false);
    setAnalysisResults(null);
    startAnalysis();
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertCircle" size={32} className="text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Failed</h2>
          <p className="text-muted-foreground mb-6">{error.userMessage}</p>
          <div className="space-y-3">
            {error.suggestedActions?.map((action, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                • {action}
              </div>
            ))}
          </div>
          <div className="flex space-x-3 mt-8">
            <button
              onClick={handleRetry}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={24} className="text-white" />
            </div>
            <span className="font-heading font-bold text-2xl text-foreground">CogniSite AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Analyzing Your Website
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {websiteUrl}
          </p>
          <p className="text-muted-foreground">
            Our AI is working hard to understand your website structure and content
          </p>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center mb-12">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Icon name={analysisSteps[currentStep]?.icon || 'Loader2'} size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {analysisSteps[currentStep]?.title || 'Processing...'}
              </h3>
              <p className="text-muted-foreground">
                {analysisSteps[currentStep]?.description || 'Please wait while we process your website'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4 mb-8">
          {analysisSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                index < currentStep
                  ? 'bg-success/10 border border-success/20'
                  : index === currentStep
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/30 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-success text-white'
                  : index === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : index === currentStep ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && analysisResults && (
          <div className="text-center bg-success/10 border border-success/20 rounded-2xl p-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Analysis Complete!
            </h3>
            <p className="text-muted-foreground mb-4">
              Successfully analyzed your website and identified {analysisResults.sections?.length || 0} key sections
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• {analysisResults.metadata?.word_count || 0} words analyzed</p>
              <p>• {analysisResults.recommendations?.length || 0} improvement recommendations</p>
              <p>• Ready to start generating content</p>
            </div>
            <p className="text-muted-foreground mt-4 flex items-center justify-center space-x-2">
              <Icon name="ArrowRight" size={16} />
              <span>Redirecting to your workspace...</span>
            </p>
          </div>
        )}

        {/* Cancel Option */}
        {!isComplete && (
          <div className="text-center">
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;