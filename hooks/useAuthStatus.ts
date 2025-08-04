'use client';

import { useMemo } from 'react';

import { useAuth } from '@/components/auth/AuthProvider';
import { MS_PER_MINUTE, MS_PER_SECOND } from '@/data/constants';

export interface AuthStatus {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null;
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
      isLoading: authState.isLoading,
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

  const minutes = Math.floor(timeMs / MS_PER_MINUTE);
  const seconds = Math.floor((timeMs % MS_PER_MINUTE) / MS_PER_SECOND);

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
