'use client';

import React from 'react';

import { useAuth } from './AuthProvider';
import { useAuthStatus } from '@/hooks/useAuthStatus';

interface AuthStatusDebugProps {
  className?: string;
  showDetails?: boolean;
}

/**
 * Debug component to display current authentication status
 * Useful for development and troubleshooting
 */
export const AuthStatusDebug: React.FC<AuthStatusDebugProps> = ({
  showDetails = false,
  className = '',
}) => {
  const { authState, logout, debugAuth } = useAuth();
  const authStatus = useAuthStatus();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm z-50 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">Auth Status</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={debugAuth}
            className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
          >
            Debug
          </button>
          {authState.isAuthenticated && (
            <button
              type="button"
              onClick={() => logout()}
              disabled={authState.isLoading}
              className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Authenticated:</span>
          <span
            className={
              authState.isAuthenticated ? 'text-green-400' : 'text-red-400'
            }
          >
            {authState.isAuthenticated ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Loading:</span>
          <span
            className={
              authState.isLoading ? 'text-yellow-400' : 'text-gray-400'
            }
          >
            {authState.isLoading ? 'Yes' : 'No'}
          </span>
        </div>

        {authState.user && (
          <div className="flex justify-between">
            <span>User:</span>
            <span className="text-blue-400 truncate max-w-32">
              {authState.user.email}
            </span>
          </div>
        )}

        {authState.error && (
          <div className="mt-2 p-2 bg-red-900 rounded text-red-200 text-xs">
            {authState.error}
          </div>
        )}

        {showDetails && (
          <details className="mt-2">
            <summary className="cursor-pointer text-gray-400 hover:text-white">
              Details
            </summary>
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
              <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                {(() => {
                  const seen = new Set();
                  return JSON.stringify(
                    authState,
                    (key, value) => {
                      // Filter sensitive data
                      if (key === 'token' || key === 'refreshToken') {
                        return '[HIDDEN]';
                      }

                      if (typeof value === 'object' && value !== null) {
                        if (value instanceof Date) return value.toISOString();
                        // Handle circular references
                        if (seen.has(value)) return '[Circular]';
                        seen.add(value);
                      }
                      return value;
                    },
                    2
                  );
                })()}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default AuthStatusDebug;
