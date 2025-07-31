'use client';

import React, { useEffect, useState } from 'react';

import { useAuth } from './AuthProvider';
import AuthErrorHandler, {
  AuthError,
  AuthErrorType,
} from '@/utils/AuthErrorHandler';

interface AuthErrorNotificationProps {
  maxErrors?: number;
  className?: string;
  showErrorHistory?: boolean;
}

/**
 * Authentication Error Notification Component
 * Displays user-friendly error messages and recovery options
 */
export const AuthErrorNotification: React.FC<AuthErrorNotificationProps> = ({
  showErrorHistory = false,
  maxErrors = 5,
  className = '',
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { authState, refreshToken, logout } = useAuth();
  const [recentErrors, setRecentErrors] = useState<AuthError[]>([]);

  // Update recent errors periodically
  useEffect(() => {
    const updateErrors = () => {
      const errors = AuthErrorHandler.getErrorHistory(maxErrors);
      setRecentErrors(errors);
    };

    updateErrors();
    const interval = setInterval(updateErrors, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [maxErrors]);

  // Handle retry action
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refreshToken();
    } catch (error) {
      console.error('Manual retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't show in production unless there are critical errors
  if (process.env.NODE_ENV === 'production' && !authState.error) {
    return null;
  }

  // Show current error if any
  if (authState.error) {
    return (
      <div
        className={`fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md z-50 ${className}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Authentication Error
            </h3>
            <p className="mt-1 text-sm text-red-700">{authState.error}</p>
            <div className="mt-3 flex space-x-2">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying || authState.isRefreshing}
                className="bg-red-100 px-3 py-1 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying || authState.isRefreshing ? 'Retrying...' : 'Retry'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={authState.isLoading}
                className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error history in development
  if (
    showErrorHistory &&
    process.env.NODE_ENV === 'development' &&
    recentErrors.length > 0
  ) {
    return (
      <div
        className={`fixed bottom-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-md z-40 ${className}`}
      >
        <div className="flex items-center mb-2">
          <svg
            className="h-4 w-4 text-yellow-400 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-sm font-medium text-yellow-800">
            Recent Auth Errors ({recentErrors.length})
          </h3>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentErrors.map((error, index) => (
            <div key={index} className="text-xs">
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getErrorTypeColor(
                    error.type
                  )}`}
                >
                  {error.type}
                </span>
                <span className="text-gray-500">
                  {formatTimeAgo(error.timestamp)}
                </span>
              </div>
              <p className="text-yellow-700 mt-1 truncate">
                {error.userMessage}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <button
            type="button"
            onClick={() => AuthErrorHandler.clearHistory()}
            className="text-xs text-yellow-600 hover:text-yellow-800"
          >
            Clear History
          </button>
          <button
            type="button"
            className="text-xs text-yellow-600 hover:text-yellow-800"
            onClick={() => {
              const stats = AuthErrorHandler.getErrorStats();
              console.log('Auth Error Stats:', stats);
            }}
          >
            Show Stats
          </button>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Get color classes for error type
 */
function getErrorTypeColor(type: AuthErrorType): string {
  switch (type) {
    case AuthErrorType.NETWORK_ERROR:
      return 'bg-blue-100 text-blue-800';
    case AuthErrorType.TOKEN_EXPIRED:
    case AuthErrorType.UNAUTHORIZED:
      return 'bg-red-100 text-red-800';
    case AuthErrorType.REFRESH_FAILED:
      return 'bg-purple-100 text-purple-800';
    case AuthErrorType.SERVER_ERROR:
      return 'bg-orange-100 text-orange-800';
    case AuthErrorType.TIMEOUT:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Format timestamp as time ago
 */
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
}

export default AuthErrorNotification;
