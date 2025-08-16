import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsBar = ({ stats, userTier = 'free' }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const getUsagePercentage = (used, limit) => {
    if (!limit || limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error bg-error/10';
    if (percentage >= 70) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  const tierLimits = {
    free: { projects: 1, analyses: 3, generations: 10 },
    basic: { projects: 10, analyses: 50, generations: 100 },
    premium: { projects: -1, analyses: -1, generations: -1 }
  };

  const limits = tierLimits?.[userTier] || tierLimits?.free;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FolderOpen" size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats?.totalProjects)}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Projects
              {limits?.projects !== -1 && (
                <span className="ml-1">
                  / {formatNumber(limits?.projects)}
                </span>
              )}
            </p>
            {limits?.projects !== -1 && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getUsagePercentage(stats?.totalProjects, limits?.projects) >= 90 
                      ? 'bg-error' 
                      : getUsagePercentage(stats?.totalProjects, limits?.projects) >= 70 
                        ? 'bg-warning' :'bg-success'
                  }`}
                  style={{ width: `${getUsagePercentage(stats?.totalProjects, limits?.projects)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Completed Analyses */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats?.completedAnalyses)}
            </p>
            <p className="text-sm text-muted-foreground">
              Completed Analyses
              {limits?.analyses !== -1 && (
                <span className="ml-1">
                  / {formatNumber(limits?.analyses)}
                </span>
              )}
            </p>
            {limits?.analyses !== -1 && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getUsagePercentage(stats?.completedAnalyses, limits?.analyses) >= 90 
                      ? 'bg-error' 
                      : getUsagePercentage(stats?.completedAnalyses, limits?.analyses) >= 70 
                        ? 'bg-warning' :'bg-success'
                  }`}
                  style={{ width: `${getUsagePercentage(stats?.completedAnalyses, limits?.analyses)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* AI Generations */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={24} className="text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats?.aiGenerations)}
            </p>
            <p className="text-sm text-muted-foreground">
              AI Generations
              {limits?.generations !== -1 && (
                <span className="ml-1">
                  / {formatNumber(limits?.generations)}
                </span>
              )}
            </p>
            {limits?.generations !== -1 && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getUsagePercentage(stats?.aiGenerations, limits?.generations) >= 90 
                      ? 'bg-error' 
                      : getUsagePercentage(stats?.aiGenerations, limits?.generations) >= 70 
                        ? 'bg-warning' :'bg-accent'
                  }`}
                  style={{ width: `${getUsagePercentage(stats?.aiGenerations, limits?.generations)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={24} className="text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats?.recentActivity)}
            </p>
            <p className="text-sm text-muted-foreground">
              Actions This Week
            </p>
            <div className="flex items-center mt-1">
              <Icon 
                name={stats?.activityTrend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={12} 
                className={stats?.activityTrend === 'up' ? 'text-success' : 'text-error'} 
              />
              <span className={`text-xs ml-1 ${stats?.activityTrend === 'up' ? 'text-success' : 'text-error'}`}>
                {stats?.activityChange}% vs last week
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Usage Warnings */}
      {userTier === 'free' && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Free Plan Usage</p>
              <p className="text-sm text-muted-foreground">
                You're using {stats?.totalProjects} of {limits?.projects} projects and {stats?.completedAnalyses} of {limits?.analyses} analyses. 
                {getUsagePercentage(stats?.totalProjects, limits?.projects) >= 80 && (
                  <span className="text-warning font-medium"> Upgrade to continue analyzing websites.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsBar;