'use client';

/**
 * Authentication Error Types
 */
export enum AuthErrorType {
  NETWORK_ERROR = 'network_error',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  SERVER_ERROR = 'server_error',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
  TOKEN_EXPIRED = 'token_expired', // Keep for backward compatibility
  REFRESH_FAILED = 'refresh_failed', // Keep for backward compatibility
}

/**
 * Authentication Error Interface
 */
export interface AuthError {
  id: string;
  type: AuthErrorType;
  message: string;
  userMessage: string;
  timestamp: number;
  context?: Record<string, any>;
}

/**
 * Authentication Error Statistics
 */
export interface AuthErrorStats {
  totalErrors: number;
  errorsByType: Record<AuthErrorType, number>;
  lastError?: AuthError;
  errorRate: number; // errors per minute
}

/**
 * Simplified Authentication Error Handler for HTTP-only cookies
 */
class AuthErrorHandlerClass {
  private errors: AuthError[] = [];
  private maxErrorHistory = 50;

  /**
   * Log an authentication error
   */
  logError(
    type: AuthErrorType,
    message: string,
    userMessage?: string,
    context?: Record<string, any>
  ): AuthError {
    const error: AuthError = {
      id: this.generateId(),
      type,
      message,
      userMessage: userMessage || this.getDefaultUserMessage(type),
      timestamp: Date.now(),
      context,
    };

    this.errors.push(error);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(-this.maxErrorHistory);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error:', error);
    }

    return error;
  }

  /**
   * Get error history
   */
  getErrorHistory(maxErrors?: number): AuthError[] {
    const limit = maxErrors || this.errors.length;
    return this.errors.slice(-limit).reverse(); // Most recent first
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errors = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): AuthErrorStats {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentErrors = this.errors.filter(
      (error) => error.timestamp > oneMinuteAgo
    );

    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<AuthErrorType, number>);

    return {
      totalErrors: this.errors.length,
      errorsByType,
      lastError: this.errors[this.errors.length - 1],
      errorRate: recentErrors.length, // errors in the last minute
    };
  }

  /**
   * Handle HTTP response errors
   */
  handleHttpError(
    response: Response,
    context?: Record<string, any>
  ): AuthError {
    let type: AuthErrorType;
    let message: string;

    switch (response.status) {
      case 401:
        type = AuthErrorType.UNAUTHORIZED;
        message = 'Authentication required';
        break;
      case 403:
        type = AuthErrorType.FORBIDDEN;
        message = 'Access forbidden';
        break;
      case 408:
        type = AuthErrorType.TIMEOUT;
        message = 'Request timeout';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = AuthErrorType.SERVER_ERROR;
        message = 'Server error';
        break;
      default:
        type = AuthErrorType.UNKNOWN;
        message = `HTTP ${response.status}: ${response.statusText}`;
    }

    return this.logError(type, message, undefined, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      ...context,
    });
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error: Error, context?: Record<string, any>): AuthError {
    return this.logError(
      AuthErrorType.NETWORK_ERROR,
      error.message,
      'Network connection failed. Please check your internet connection.',
      { originalError: error.name, ...context }
    );
  }

  /**
   * Generate unique error ID
   */
  private generateId(): string {
    return `auth_error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * Get default user message for error type
   */
  private getDefaultUserMessage(type: AuthErrorType): string {
    switch (type) {
      case AuthErrorType.NETWORK_ERROR:
        return 'Network connection failed. Please check your internet connection.';
      case AuthErrorType.UNAUTHORIZED:
        return 'Please log in to continue.';
      case AuthErrorType.FORBIDDEN:
        return 'You do not have permission to access this resource.';
      case AuthErrorType.SERVER_ERROR:
        return 'Server error occurred. Please try again later.';
      case AuthErrorType.TIMEOUT:
        return 'Request timed out. Please try again.';
      case AuthErrorType.TOKEN_EXPIRED:
        return 'Your session has expired. Please log in again.';
      case AuthErrorType.REFRESH_FAILED:
        return 'Session refresh failed. Please log in again.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  }
}

// Create singleton instance
const AuthErrorHandler = new AuthErrorHandlerClass();

export default AuthErrorHandler;
