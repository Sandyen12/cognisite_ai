/**
 * Configuration Service for CogniSite AI
 * Manages API keys, database connections, and application settings
 */

import { supabase } from '../lib/supabase';
import errorHandlingService from './errorHandlingService';

class ConfigService {
  constructor() {
    this.config = {
      app: {
        name: import.meta.env.VITE_APP_NAME || 'CogniSite AI',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.NODE_ENV || 'development'
      },
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        apiUrl: import.meta.env.VITE_API_BASE_URL
      },
      openai: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY
      },
      features: {
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false'
      }
    };
    
    this.status = {
      supabase: 'unknown',
      openai: 'unknown',
      lastCheck: null
    };
  }

  /**
   * Get application configuration
   * @returns {object} Application config
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Check if OpenAI is properly configured
   * @returns {boolean} True if OpenAI is configured
   */
  isOpenAIConfigured() {
    return !!(this.config.openai.apiKey && 
              this.config.openai.apiKey !== 'your-openai-api-key-here' &&
              this.config.openai.apiKey.startsWith('sk-'));
  }

  /**
   * Check if Supabase is properly configured
   * @returns {boolean} True if Supabase is configured
   */
  isSupabaseConfigured() {
    return !!(this.config.supabase.url && 
              this.config.supabase.anonKey &&
              this.config.supabase.url.includes('supabase.co'));
  }

  /**
   * Test OpenAI API connection
   * @returns {Promise<object>} Connection test result
   */
  async testOpenAIConnection() {
    try {
      if (!this.isOpenAIConfigured()) {
        throw new Error('OpenAI API key not configured');
      }

      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: this.config.openai.apiKey,
        dangerouslyAllowBrowser: true
      });

      // Test with a simple completion
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 5
      });

      this.status.openai = 'connected';
      return {
        success: true,
        status: 'connected',
        message: 'OpenAI API connection successful',
        model: 'gpt-3.5-turbo',
        usage: response.usage
      };
    } catch (error) {
      this.status.openai = 'error';
      const processedError = errorHandlingService.handleError(
        error, 
        'openai_connection_test'
      );
      
      return {
        success: false,
        status: 'error',
        message: processedError.userMessage,
        error: processedError
      };
    }
  }

  /**
   * Test Supabase connection
   * @returns {Promise<object>} Connection test result
   */
  async testSupabaseConnection() {
    try {
      if (!this.isSupabaseConfigured()) {
        throw new Error('Supabase configuration missing');
      }

      // Test database connection
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      this.status.supabase = 'connected';
      return {
        success: true,
        status: 'connected',
        message: 'Supabase connection successful',
        url: this.config.supabase.url
      };
    } catch (error) {
      this.status.supabase = 'error';
      const processedError = errorHandlingService.handleError(
        error, 
        'supabase_connection_test'
      );
      
      return {
        success: false,
        status: 'error',
        message: processedError.userMessage,
        error: processedError
      };
    }
  }

  /**
   * Test all service connections
   * @returns {Promise<object>} All connection test results
   */
  async testAllConnections() {
    this.status.lastCheck = new Date().toISOString();
    
    const results = await Promise.allSettled([
      this.testSupabaseConnection(),
      this.testOpenAIConnection()
    ]);

    const supabaseResult = results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason };
    const openaiResult = results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason };

    return {
      timestamp: this.status.lastCheck,
      supabase: supabaseResult,
      openai: openaiResult,
      overall: supabaseResult.success && openaiResult.success
    };
  }

  /**
   * Get service status
   * @returns {object} Current service status
   */
  getStatus() {
    return {
      ...this.status,
      configured: {
        supabase: this.isSupabaseConfigured(),
        openai: this.isOpenAIConfigured()
      }
    };
  }

  /**
   * Get configuration issues
   * @returns {string[]} Array of configuration issues
   */
  getConfigurationIssues() {
    const issues = [];

    if (!this.isSupabaseConfigured()) {
      issues.push('Supabase configuration missing or invalid');
    }

    if (!this.isOpenAIConfigured()) {
      issues.push('OpenAI API key missing or invalid');
    }

    if (this.status.supabase === 'error') {
      issues.push('Supabase connection failed');
    }

    if (this.status.openai === 'error') {
      issues.push('OpenAI API connection failed');
    }

    return issues;
  }

  /**
   * Get setup recommendations
   * @returns {object[]} Array of setup recommendations
   */
  getSetupRecommendations() {
    const recommendations = [];

    if (!this.isOpenAIConfigured()) {
      recommendations.push({
        type: 'required',
        title: 'Configure OpenAI API Key',
        description: 'Add your OpenAI API key to enable AI-powered features',
        action: 'Add VITE_OPENAI_API_KEY to your .env file',
        priority: 'high'
      });
    }

    if (!this.isSupabaseConfigured()) {
      recommendations.push({
        type: 'required',
        title: 'Configure Supabase',
        description: 'Set up Supabase for database and authentication',
        action: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file',
        priority: 'high'
      });
    }

    if (this.status.supabase === 'error') {
      recommendations.push({
        type: 'warning',
        title: 'Supabase Connection Issues',
        description: 'Check if your Supabase project is active and accessible',
        action: 'Verify your Supabase project status and database migrations',
        priority: 'medium'
      });
    }

    if (this.status.openai === 'error') {
      recommendations.push({
        type: 'warning',
        title: 'OpenAI API Issues',
        description: 'Verify your OpenAI API key and account status',
        action: 'Check your OpenAI API key and billing status',
        priority: 'medium'
      });
    }

    // Add performance recommendations
    recommendations.push({
      type: 'optimization',
      title: 'Enable Analytics',
      description: 'Track user behavior and application performance',
      action: 'Set VITE_ENABLE_ANALYTICS=true in your .env file',
      priority: 'low'
    });

    return recommendations;
  }

  /**
   * Validate environment configuration
   * @returns {object} Validation result
   */
  validateEnvironment() {
    const issues = this.getConfigurationIssues();
    const recommendations = this.getSetupRecommendations();
    
    return {
      isValid: issues.length === 0,
      issues,
      recommendations: recommendations.filter(r => r.type === 'required'),
      warnings: recommendations.filter(r => r.type === 'warning'),
      optimizations: recommendations.filter(r => r.type === 'optimization')
    };
  }

  /**
   * Get database migration status
   * @returns {Promise<object>} Migration status
   */
  async getDatabaseMigrationStatus() {
    try {
      // Check if required tables exist
      const tables = [
        'user_profiles',
        'projects', 
        'website_sections',
        'chat_messages',
        'generated_content',
        'user_statistics'
      ];

      const checks = await Promise.allSettled(
        tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          return { table, exists: !error, error };
        })
      );

      const results = checks.map(check => 
        check.status === 'fulfilled' ? check.value : { error: check.reason }
      );

      const existingTables = results.filter(r => r.exists).map(r => r.table);
      const missingTables = results.filter(r => !r.exists).map(r => r.table);

      return {
        migrationComplete: missingTables.length === 0,
        existingTables,
        missingTables,
        totalTables: tables.length,
        completionPercentage: Math.round((existingTables.length / tables.length) * 100)
      };
    } catch (error) {
      const processedError = errorHandlingService.handleError(
        error, 
        'database_migration_check'
      );
      
      return {
        migrationComplete: false,
        error: processedError.userMessage,
        existingTables: [],
        missingTables: [],
        totalTables: 0,
        completionPercentage: 0
      };
    }
  }
}

// Create and export singleton instance
const configService = new ConfigService();
export default configService;