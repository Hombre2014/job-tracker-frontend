'use client';

import { useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export interface AuthStatus {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  isLoading: boolean;
  timeUntilExpiration: number | null;
  timeUntilExpirationFormatted: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicUrl?: string;
  } | null;
  error: string | null;
}

/**
 * Hook to get real-time authentication status
 * Now uses the AuthProvider's reactive state instead of polling
 */
export const useAuthStatus = (): AuthStatus => {
  const { authState } = useAuth();

  const authStatus = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      isRefreshing: authState.isRefreshing,
      isLoading: authState.isLoading,
      timeUntilExpiration: authState.timeUntilExpiration,
      timeUntilExpirationFormatted: formatTimeUntilExpiration(
        authState.timeUntilExpiration
      ),
      user: authState.user,
      error: authState.error,
    }),
    [authState]
  );

  return authStatus;
};

/**
 * Format time until expiration in human-readable format
 */
function formatTimeUntilExpiration(timeMs: number | null): string {
  if (!timeMs || timeMs <= 0) {
    return 'Expired';
  }

  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export default useAuthStatus;
