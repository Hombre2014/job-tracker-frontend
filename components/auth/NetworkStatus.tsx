'use client';

import React, { useState, useEffect } from 'react';

interface NetworkStatusProps {
  className?: string;
  showWhenOnline?: boolean;
}

/**
 * Network Status Component
 * Shows network connectivity status and handles offline scenarios
 */
export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  className = '',
  showWhenOnline = false,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show brief "back online" message
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Don't show anything if online and showWhenOnline is false
  if (isOnline && !showWhenOnline && !wasOffline) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            No internet connection. Please check your network and try again.
          </div>
        </div>
      )}
      
      {isOnline && wasOffline && (
        <div className="bg-green-600 text-white px-4 py-2 text-center text-sm font-medium animate-pulse">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Connection restored! Syncing data...
          </div>
        </div>
      )}
      
      {isOnline && showWhenOnline && !wasOffline && (
        <div className="bg-green-100 text-green-800 px-4 py-1 text-center text-xs">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Online
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
