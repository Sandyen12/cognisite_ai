/**
 * Comprehensive Error Handling Service for CogniSite AI
 * Centralizes error handling, logging, and user-friendly error messages
 */

class ErrorHandlingService {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.enableConsoleLogging = import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false';
  }

  /**
   * Main error handler - processes and categorizes errors
   * @param {Error|string} error - The error to handle
   * @param {string} context - Where the error occurred
   * @param {object} additionalData - Extra context data
   * @returns {object} Processed error object
   */
  handleError(error, context = 'unknown', additionalData = {}) {
    const processedError = this.processError(error, context, additionalData);
    
    // Log the error
    this.logError(processedError);
    
    // Console logging for development
    if (this.enableConsoleLogging) {
      console.error(`[${context}]`, error, additionalData);
    }
    
    return processedError;
  }

  /**
   * Process and categorize errors
   * @param {Error|string} error - Raw error
   * @param {string} context - Error context
   * @param {object} additionalData - Additional data
   * @returns {object} Processed error
   */
  processError(error, context, additionalData) {
    const timestamp = new Date().toISOString();
    const errorMessage = typeof error === 'string' ? error : error?.message || 'Unknown error';
    const errorStack = error?.stack || null;
    
    // Categorize the error
    const category = this.categorizeError(error, context);
    
    // Generate user-friendly message
    const userMessage = this.generateUserMessage(category, errorMessage, context);
    
    // Determine if error is retryable
    const isRetryable = this.isRetryableError(category, error);
    
    // Suggest actions
    const suggestedActions = this.getSuggestedActions(category, context);
    
    return {
      id: this.generateErrorId(),
      timestamp,
      category,
      context,
      originalMessage: errorMessage,
      userMessage,
      isRetryable,
      suggestedActions,
      stack: errorStack,
      additionalData,
      severity: this.getSeverity(category)
    };
  }

  /**
   * Categorize errors based on type and context
   * @param {Error|string} error - The error
   * @param {string} context - Error context
   * @returns {string} Error category
   */
  categorizeError(error, context) {
    const errorMessage = typeof error === 'string' ? error : error?.message || '';
    const errorName = error?.name || '';
    
    // Network-related errors
    if (errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('ERR_NETWORK') ||
        errorMessage.includes('ERR_INTERNET_DISCONNECTED')) {
      return 'network';
    }
    
    // Authentication errors
    if (errorMessage.includes('AuthRetryableFetchError') ||
        errorMessage.includes('Invalid login credentials') ||
        errorMessage.includes('User not found') ||
        context.includes('auth')) {
      return 'authentication';
    }
    
    // API-related errors
    if (errorMessage.includes('OpenAI') ||
        errorMessage.includes('API key') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota exceeded')) {
      return 'api';
    }
    
    // Database errors
    if (errorMessage.includes('Supabase') ||
        errorMessage.includes('PostgreSQL') ||
        errorMessage.includes('database') ||
        context.includes('database')) {
      return 'database';
    }
    
    // Website analysis specific errors
    if (context.includes('analysis') || 
        context.includes('scraping') ||
        errorMessage.includes('CORS') ||
        errorMessage.includes('Invalid URL')) {
      return 'analysis';
    }
    
    // Timeout errors
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('ETIMEDOUT') ||
        errorName === 'TimeoutError') {
      return 'timeout';
    }
    
    // Validation errors
    if (errorMessage.includes('validation') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('required') ||
        context.includes('validation')) {
      return 'validation';
    }
    
    // Permission errors
    if (errorMessage.includes('permission') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('forbidden') ||
        error?.status === 403) {
      return 'permission';
    }
    
    // Server errors
    if (error?.status >= 500 || 
        errorMessage.includes('Internal Server Error') ||
        errorMessage.includes('Service Unavailable')) {
      return 'server';
    }
    
    return 'unknown';
  }

  /**
   * Generate user-friendly error messages
   * @param {string} category - Error category
   * @param {string} originalMessage - Original error message
   * @param {string} context - Error context
   * @returns {string} User-friendly message
   */
  generateUserMessage(category, originalMessage, context) {
    const messages = {
      network: 'Unable to connect to the internet. Please check your connection and try again.',
      authentication: 'Authentication failed. Please sign in again or check your credentials.',
      api: 'AI service is temporarily unavailable. Please try again in a few moments.',
      database: 'Database connection issue. Your data may not be saved. Please try again.',
      analysis: 'Website analysis failed. Please check the URL and ensure the website is accessible.',
      timeout: 'Request timed out. The operation took too long to complete.',
      validation: 'Invalid input provided. Please check your data and try again.',
      permission: 'You don\'t have permission to perform this action.',
      server: 'Server error occurred. Our team has been notified.',
      unknown: 'An unexpected error occurred. Please try again or contact support.'
    };
    
    return messages[category] || messages.unknown;
  }

  /**
   * Determine if an error is retryable
   * @param {string} category - Error category
   * @param {Error} error - Original error
   * @returns {boolean} Whether the error is retryable
   */
  isRetryableError(category, error) {
    const retryableCategories = ['network', 'api', 'timeout', 'server'];
    const nonRetryableCategories = ['validation', 'permission', 'authentication'];
    
    if (nonRetryableCategories.includes(category)) {
      return false;
    }
    
    if (retryableCategories.includes(category)) {
      return true;
    }
    
    // Check specific error conditions
    if (error?.status === 429) return true; // Rate limit
    if (error?.status >= 500) return true; // Server errors
    
    return false;
  }

  /**
   * Get suggested actions for error recovery
   * @param {string} category - Error category
   * @param {string} context - Error context
   * @returns {string[]} Array of suggested actions
   */
  getSuggestedActions(category, context) {
    const actionMap = {
      network: [
        'Check your internet connection',
        'Try refreshing the page',
        'Wait a moment and retry'
      ],
      authentication: [
        'Sign in again',
        'Check your credentials',
        'Clear browser cache and cookies'
      ],
      api: [
        'Wait a few minutes and try again',
        'Check if your API quota is exceeded',
        'Verify your API key configuration'
      ],
      database: [
        'Retry the operation',
        'Check if your Supabase project is active',
        'Contact support if the issue persists'
      ],
      analysis: [
        'Verify the website URL is correct',
        'Ensure the website is accessible',
        'Try a different website',
        'Check if the website blocks automated access'
      ],
      timeout: [
        'Try again with a simpler request',
        'Check your internet speed',
        'Wait a moment before retrying'
      ],
      validation: [
        'Check your input format',
        'Ensure all required fields are filled',
        'Review the error details'
      ],
      permission: [
        'Contact your administrator',
        'Check your account permissions',
        'Sign in with appropriate credentials'
      ],
      server: [
        'Wait a few minutes and try again',
        'Contact support if the issue continues'
      ],
      unknown: [
        'Refresh the page and try again',
        'Clear your browser cache',
        'Contact support with error details'
      ]
    };
    
    return actionMap[category] || actionMap.unknown;
  }

  /**
   * Get error severity level
   * @param {string} category - Error category
   * @returns {string} Severity level
   */
  getSeverity(category) {
    const severityMap = {
      validation: 'low',
      timeout: 'medium',
      network: 'medium',
      api: 'medium',
      analysis: 'medium',
      authentication: 'high',
      database: 'high',
      permission: 'high',
      server: 'critical',
      unknown: 'medium'
    };
    
    return severityMap[category] || 'medium';
  }

  /**
   * Log error to internal log
   * @param {object} processedError - Processed error object
   */
  logError(processedError) {
    this.errorLog.unshift(processedError);
    
    // Maintain max log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
  }

  /**
   * Generate unique error ID
   * @returns {string} Unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get recent errors
   * @param {number} limit - Number of errors to return
   * @returns {object[]} Recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errorLog.slice(0, limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   * @returns {object} Error statistics
   */
  getErrorStats() {
    const totalErrors = this.errorLog.length;
    const categoryCounts = {};
    const severityCounts = {};
    
    this.errorLog.forEach(error => {
      categoryCounts[error.category] = (categoryCounts[error.category] || 0) + 1;
      severityCounts[error.severity] = (severityCounts[error.severity] || 0) + 1;
    });
    
    return {
      totalErrors,
      categoryCounts,
      severityCounts,
      mostCommonCategory: Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b, 'none'
      )
    };
  }

  /**
   * Handle API-specific errors with retry logic
   * @param {Function} apiCall - The API call function
   * @param {object} options - Retry options
   * @returns {Promise} API call result
   */
  async withRetry(apiCall, options = {}) {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoffMultiplier = 2,
      context = 'api_call'
    } = options;
    
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        const processedError = this.handleError(error, context, { attempt });
        
        // Don't retry if error is not retryable
        if (!processedError.isRetryable || attempt === maxRetries) {
          throw processedError;
        }
        
        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw this.handleError(lastError, context, { maxRetriesExceeded: true });
  }
}

// Create and export singleton instance
const errorHandlingService = new ErrorHandlingService();
export default errorHandlingService;