import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import configService from '../../services/configService';
import errorHandlingService from '../../services/errorHandlingService';
import Icon from '../../components/AppIcon';

const SetupStatus = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    loading: true,
    connections: null,
    migration: null,
    validation: null
  });
  const [testingConnections, setTestingConnections] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const [connections, migration, validation] = await Promise.allSettled([
        configService.testAllConnections(),
        configService.getDatabaseMigrationStatus(),
        Promise.resolve(configService.validateEnvironment())
      ]);

      setStatus({
        loading: false,
        connections: connections.status === 'fulfilled' ? connections.value : null,
        migration: migration.status === 'fulfilled' ? migration.value : null,
        validation: validation.status === 'fulfilled' ? validation.value : null
      });
    } catch (error) {
      errorHandlingService.handleError(error, 'setup_status_load');
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const testConnections = async () => {
    setTestingConnections(true);
    try {
      const connections = await configService.testAllConnections();
      setStatus(prev => ({ ...prev, connections }));
    } catch (error) {
      errorHandlingService.handleError(error, 'connection_test');
    } finally {
      setTestingConnections(false);
    }
  };

  const getStatusIcon = (success) => {
    if (success === null || success === undefined) return 'Clock';
    return success ? 'CheckCircle' : 'XCircle';
  };

  const getStatusColor = (success) => {
    if (success === null || success === undefined) return 'text-muted-foreground';
    return success ? 'text-success' : 'text-destructive';
  };

  const StatusCard = ({ title, description, status, details, icon = 'Info' }) => (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${status ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <Icon 
            name={getStatusIcon(status)} 
            size={24} 
            className={getStatusColor(status)}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-3">{description}</p>
          {details && (
            <div className="text-sm text-muted-foreground space-y-1">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="ArrowRight" size={14} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RecommendationCard = ({ recommendation }) => {
    const getTypeColor = (type) => {
      switch (type) {
        case 'required': return 'border-destructive bg-destructive/5';
        case 'warning': return 'border-warning bg-warning/5';
        case 'optimization': return 'border-info bg-info/5';
        default: return 'border-muted bg-muted/5';
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case 'required': return 'AlertCircle';
        case 'warning': return 'AlertTriangle';
        case 'optimization': return 'Lightbulb';
        default: return 'Info';
      }
    };

    return (
      <div className={`border rounded-lg p-4 ${getTypeColor(recommendation.type)}`}>
        <div className="flex items-start space-x-3">
          <Icon 
            name={getTypeIcon(recommendation.type)} 
            size={20} 
            className={`mt-0.5 ${
              recommendation.type === 'required' ? 'text-destructive' :
              recommendation.type === 'warning' ? 'text-warning' :
              'text-info'
            }`}
          />
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">{recommendation.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
            <div className="text-xs font-mono bg-muted/50 rounded px-2 py-1 text-muted-foreground">
              {recommendation.action}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (status.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking system status...</p>
        </div>
      </div>
    );
  }

  const overallStatus = status.connections?.overall && status.migration?.migrationComplete;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">System Status</h1>
                <p className="text-muted-foreground">Configuration and health check</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={testConnections}
                disabled={testingConnections}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name={testingConnections ? 'Loader2' : 'RefreshCw'} size={16} className={`mr-2 ${testingConnections ? 'animate-spin' : ''}`} />
                Test Connections
              </button>
              <button
                onClick={loadStatus}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="RefreshCw" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <div className={`rounded-lg p-6 mb-8 ${overallStatus ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${overallStatus ? 'bg-success/20' : 'bg-destructive/20'}`}>
              <Icon 
                name={overallStatus ? 'CheckCircle' : 'AlertCircle'} 
                size={32} 
                className={overallStatus ? 'text-success' : 'text-destructive'}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {overallStatus ? 'System Ready' : 'Setup Required'}
              </h2>
              <p className="text-muted-foreground">
                {overallStatus 
                  ? 'All systems are configured and operational'
                  : 'Some components need configuration or attention'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <StatusCard
            title="Supabase Database"
            description="Authentication and data storage"
            status={status.connections?.supabase?.success}
            details={[
              `Status: ${status.connections?.supabase?.message || 'Unknown'}`,
              `Migration: ${status.migration?.migrationComplete ? 'Complete' : 'Incomplete'} (${status.migration?.completionPercentage || 0}%)`,
              `Tables: ${status.migration?.existingTables?.length || 0}/${status.migration?.totalTables || 6}`
            ]}
          />

          <StatusCard
            title="OpenAI API"
            description="AI-powered content generation and analysis"
            status={status.connections?.openai?.success}
            details={[
              `Status: ${status.connections?.openai?.message || 'Unknown'}`,
              `Model: ${status.connections?.openai?.model || 'Not tested'}`,
              `Configured: ${configService.isOpenAIConfigured() ? 'Yes' : 'No'}`
            ]}
          />
        </div>

        {/* Configuration Issues */}
        {status.validation?.issues?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Configuration Issues</h3>
            <div className="space-y-3">
              {status.validation.issues.map((issue, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Icon name="AlertCircle" size={20} className="text-destructive" />
                  <span className="text-foreground">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {status.validation?.recommendations?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Setup Recommendations</h3>
            <div className="space-y-4">
              {status.validation.recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {status.validation?.warnings?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Warnings</h3>
            <div className="space-y-4">
              {status.validation.warnings.map((warning, index) => (
                <RecommendationCard key={index} recommendation={warning} />
              ))}
            </div>
          </div>
        )}

        {/* Error Log */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Errors</h3>
            <button
              onClick={() => errorHandlingService.clearErrorLog()}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Log
            </button>
          </div>
          
          {errorHandlingService.getRecentErrors(5).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent errors</p>
          ) : (
            <div className="space-y-3">
              {errorHandlingService.getRecentErrors(5).map((error) => (
                <div key={error.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          error.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                          error.severity === 'high' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {error.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">{error.context}</span>
                      </div>
                      <p className="text-sm text-foreground mb-1">{error.userMessage}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          {overallStatus ? (
            <button
              onClick={() => navigate('/user-dashboard')}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="ArrowRight" size={18} className="mr-2" />
              Go to Dashboard
            </button>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Complete the setup requirements above to start using CogniSite AI
              </p>
              <button
                onClick={loadStatus}
                className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Check Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SetupStatus;