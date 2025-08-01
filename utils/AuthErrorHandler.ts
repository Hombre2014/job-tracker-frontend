import { toast } from 'react-toastify';
import TokenManager from './TokenManager';
import RequestQueue from './RequestQueue';
import SmartTokenRefresh from './SmartTokenRefresh';

export enum AuthErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  REFRESH_FAILED = 'REFRESH_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: any;
  retryable: boolean;
  userMessage: string;
  timestamp: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * Comprehensive Authentication Error Handler
 * Handles all types of auth-related errors with appropriate recovery strategies
 */
class AuthErrorHandlerClass {
  private retryConfig: RetryConfig;
  private errorHistory: AuthError[] = [];
  private maxHistorySize = 50;

  constructor(config: Partial<RetryConfig> = {}) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Classify error type based on error details
   */
  private classifyError(error: any): AuthErrorType {
    // Network connectivity issues
    if (!navigator.onLine) {
      return AuthErrorType.NETWORK_ERROR;
    }

    // Axios/Fetch errors
    if (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error')
    ) {
      return AuthErrorType.NETWORK_ERROR;
    }

    // Timeout errors
    if (
      error.code === 'ECONNABORTED' ||
      error.name === 'AbortError' ||
      error.message?.includes('timeout')
    ) {
      return AuthErrorType.TIMEOUT;
    }

    // HTTP status codes
    if (error.response?.status) {
      const status = error.response.status;

      if (status === 401) {
        // Check if it's specifically a token expiration
        let errorMessage = '';
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data.message || '';
        }
        errorMessage = errorMessage || error.message || '';
        const lowerMessage = errorMessage.toLowerCase();

        if (
          lowerMessage.includes('token') &&
          (lowerMessage.includes('expired') ||
            lowerMessage.includes('invalid') ||
            lowerMessage.includes('malformed'))
        ) {
          return AuthErrorType.TOKEN_EXPIRED;
        }
        return AuthErrorType.UNAUTHORIZED;
      }

      if (status === 403) {
        return AuthErrorType.UNAUTHORIZED;
      }

      if (status === 422) {
        // Unprocessable Entity - often used for validation errors
        return AuthErrorType.UNKNOWN;
      }

      if (status >= 500) {
        return AuthErrorType.SERVER_ERROR;
      }

      if (status === 429) {
        // Too Many Requests - treat as server error for retry logic
        return AuthErrorType.SERVER_ERROR;
      }
    }

    // Token-specific errors (check for refresh failures)
    if (
      error.code === 'TOKEN_REFRESH_FAILED' ||
      error.message?.toLowerCase().includes('refresh token') ||
      error.message?.toLowerCase().includes('token refresh') ||
      error.message?.toLowerCase().includes('refresh failed') ||
      (typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message
      )?.toLowerCase().includes('refresh')
    ) {
      return AuthErrorType.REFRESH_FAILED;
    }

    return AuthErrorType.UNKNOWN;
  }

  /**
   * Generate user-friendly error messages
   */
  private getUserMessage(
    errorType: AuthErrorType,
    originalError?: any
  ): string {
    switch (errorType) {
      case AuthErrorType.NETWORK_ERROR:
        return 'Network connection lost. Please check your internet connection and try again.';

      case AuthErrorType.TOKEN_EXPIRED:
        return 'Your session has expired. Please log in again.';

      case AuthErrorType.REFRESH_FAILED:
        return 'Unable to refresh your session. Please log in again.';

      case AuthErrorType.UNAUTHORIZED:
        return 'Authentication failed. Please log in again.';

      case AuthErrorType.SERVER_ERROR:
        return 'Server is temporarily unavailable. Please try again in a few moments.';

      case AuthErrorType.TIMEOUT:
        return 'Request timed out. Please check your connection and try again.';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Determine if error is retryable
   */
  private isRetryable(errorType: AuthErrorType): boolean {
    switch (errorType) {
      case AuthErrorType.NETWORK_ERROR:
      case AuthErrorType.SERVER_ERROR:
      case AuthErrorType.TIMEOUT:
      case AuthErrorType.TOKEN_EXPIRED: // Can retry after token refresh
        return true;

      case AuthErrorType.REFRESH_FAILED:
      case AuthErrorType.UNAUTHORIZED:
      case AuthErrorType.UNKNOWN:
        return false;

      default:
        return false;
    }
  }

  /**
   * Create structured auth error
   */
  createAuthError(error: any, customMessage?: string): AuthError {
    const errorType = this.classifyError(error);
    const userMessage = customMessage || this.getUserMessage(errorType, error);

    const authError: AuthError = {
      type: errorType,
      message: error.message || 'Unknown error',
      originalError: error,
      retryable: this.isRetryable(errorType),
      userMessage,
      timestamp: Date.now(),
    };

    // Add to history
    this.addToHistory(authError);

    return authError;
  }

  /**
   * Handle authentication errors with appropriate recovery
   */
  async handleAuthError(
    error: any,
    context?: string
  ): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
    delay?: number;
  }> {
    const authError = this.createAuthError(error);

    console.error(`AuthErrorHandler: ${context || 'Auth error'}:`, {
      type: authError.type,
      message: authError.message,
      retryable: authError.retryable,
      originalError: error,
    });

    // Handle different error types
    switch (authError.type) {
      case AuthErrorType.NETWORK_ERROR:
        return this.handleNetworkError(authError);

      case AuthErrorType.TOKEN_EXPIRED:
        return this.handleTokenExpiredError(authError);

      case AuthErrorType.UNAUTHORIZED:
        return this.handleUnauthorizedError(authError);

      case AuthErrorType.REFRESH_FAILED:
        return this.handleRefreshFailedError(authError);

      case AuthErrorType.SERVER_ERROR:
        return this.handleServerError(authError);

      case AuthErrorType.TIMEOUT:
        return this.handleTimeoutError(authError);

      default:
        return this.handleUnknownError(authError);
    }
  }

  /**
   * Handle network connectivity errors
   */
  private async handleNetworkError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
    delay?: number;
  }> {
    // Show user-friendly message
    toast.error(error.userMessage, {
      toastId: 'network-error',
      autoClose: 5000,
    });

    // Wait for network to come back online
    if (!navigator.onLine) {
      await this.waitForOnline();
    }

    return {
      shouldRetry: true,
      shouldLogout: false,
      delay: this.calculateRetryDelay(1), // Start with first retry
    };
  }

  /**
   * Handle token expired errors (specific case of 401 with token-related message)
   */
  private async handleTokenExpiredError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
  }> {
    // Check if we have a refresh token
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      toast.error('Session expired. Please log in again.');
      return {
        shouldRetry: false,
        shouldLogout: true,
      };
    }

    // Try to refresh token using SmartTokenRefresh
    try {
      console.log('AuthErrorHandler: Token expired, attempting refresh...');
      const refreshSuccess = await SmartTokenRefresh.refreshNow();

      if (refreshSuccess) {
        console.log(
          'AuthErrorHandler: Token refresh successful, retrying request'
        );
        return {
          shouldRetry: true,
          shouldLogout: false,
        };
      } else {
        console.warn('AuthErrorHandler: Token refresh failed');
        toast.error('Session expired. Please log in again.');
        return {
          shouldRetry: false,
          shouldLogout: true,
        };
      }
    } catch (refreshError) {
      console.error('AuthErrorHandler: Token refresh error:', refreshError);
      toast.error('Session expired. Please log in again.');
      return {
        shouldRetry: false,
        shouldLogout: true,
      };
    }
  }

  /**
   * Handle general unauthorized errors (403, or 401 without token-specific message)
   */
  private async handleUnauthorizedError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
  }> {
    // For general unauthorized errors (like 403 Forbidden), don't attempt refresh
    // These typically indicate insufficient permissions, not expired tokens
    toast.error(error.userMessage);

    return {
      shouldRetry: false,
      shouldLogout: true,
    };
  }

  /**
   * Handle refresh token failures
   */
  private async handleRefreshFailedError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
  }> {
    toast.error(error.userMessage);

    // Clear tokens and force logout
    TokenManager.clearTokens();
    RequestQueue.reset();

    return {
      shouldRetry: false,
      shouldLogout: true,
    };
  }

  /**
   * Handle server errors (5xx)
   */
  private async handleServerError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
    delay?: number;
  }> {
    toast.error(error.userMessage, {
      toastId: 'server-error',
      autoClose: 8000,
    });

    return {
      shouldRetry: true,
      shouldLogout: false,
      delay: this.calculateRetryDelay(2), // Longer delay for server errors
    };
  }

  /**
   * Handle timeout errors
   */
  private async handleTimeoutError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
    delay?: number;
  }> {
    toast.warning(error.userMessage, {
      toastId: 'timeout-error',
      autoClose: 5000,
    });

    return {
      shouldRetry: true,
      shouldLogout: false,
      delay: this.calculateRetryDelay(1),
    };
  }

  /**
   * Handle unknown errors
   */
  private async handleUnknownError(error: AuthError): Promise<{
    shouldRetry: boolean;
    shouldLogout: boolean;
  }> {
    toast.error(error.userMessage, {
      autoClose: 5000,
    });

    return {
      shouldRetry: false,
      shouldLogout: false,
    };
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelayMs *
        Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
      this.retryConfig.maxDelayMs
    );

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  /**
   * Wait for network to come back online
   */
  private waitForOnline(): Promise<void> {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve();
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);
    });
  }

  /**
   * Add error to history
   */
  private addToHistory(error: AuthError): void {
    this.errorHistory.unshift(error);

    // Keep history size manageable
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.splice(this.maxHistorySize);
    }
  }

  /**
   * Get recent error history
   */
  getErrorHistory(limit: number = 10): AuthError[] {
    return this.errorHistory.slice(0, limit);
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<AuthErrorType, number>;
    recentErrors: number;
  } {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const byType = this.errorHistory.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<AuthErrorType, number>);

    const recentErrors = this.errorHistory.filter(
      (error) => error.timestamp > oneHourAgo
    ).length;

    return {
      total: this.errorHistory.length,
      byType,
      recentErrors,
    };
  }
}

// Export singleton instance
export const AuthErrorHandler = new AuthErrorHandlerClass();
export default AuthErrorHandler;
