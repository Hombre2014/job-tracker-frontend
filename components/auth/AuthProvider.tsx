'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';
import { useRouter } from 'next/navigation';

import DevToolsWrapper from '@/components/dev/DevToolsWrapper';
import { cleanupAfterLogout } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  updateUserData,
  logout as logoutThunk,
} from '@/redux/user/userSlice';

export interface AuthUser {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  profilePicUrl?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  user: AuthUser | null;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  timeUntilExpiration: number | null;
}

interface AuthContextType {
  // State
  authState: AuthState;

  // Actions
  logout: () => Promise<void>;
  clearError: () => void;

  debugAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initializationRef = useRef(false);
  const reduxUser = useAppSelector((state) => state.user);

  // Reusable function to sync user data from localStorage to Redux
  const syncUserDataToRedux = useCallback(
    (logContext?: string) => {
      let storedUser: string | null = null;
      try {
        storedUser = localStorage.getItem('user');
      } catch (error) {
        console.warn('AuthProvider: Failed to access localStorage:', error);
        return null;
      }

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (logContext) {
            console.log(`AuthProvider: ${logContext}:`, userData);
          }

          dispatch(
            updateUserData({
              email: userData.email || '',
              role: userData.role || 'user',
              userId: userData.userId || '',
              lastName: userData.lastName || '',
              firstName: userData.firstName || '',
              profilePicUrl: userData.profilePicUrl || '',
            })
          );
          return userData;
        } catch (error) {
          console.error(
            `AuthProvider: Error parsing user data (${logContext}):`,
            error
          );
        }
      }
      return null;
    },
    [dispatch]
  );

  // Local auth state
  const [authState, setAuthState] = useState<AuthState>(() => {
    return {
        user: null,
        error: null,
        isLoading: false,
        isRefreshing: false,
        isAuthenticated: false,
        timeUntilExpiration: null,
      };
  });

  // Watch for localStorage user data changes (e.g., profile picture updates)
  useEffect(() => {
    const handleStorageChange = () => {
      syncUserDataToRedux('localStorage user data changed, syncing to Redux');
    };

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Trigger sync when specific user data might change
    const triggerUserDataSync = () => {
      const storedUser = localStorage.getItem('user');
      const currentProfilePic = reduxUser.profilePicUrl;

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Only sync if profile picture has changed
          if (userData.profilePicUrl !== currentProfilePic) {
            console.log(
              'AuthProvider: Profile picture changed, syncing to Redux'
            );
            handleStorageChange();
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
    };

    // Listen for custom events that indicate user data changes
    window.addEventListener('userDataUpdated', triggerUserDataSync);

    // Reduced frequency polling as fallback (60 seconds instead of 10)
    const interval = setInterval(triggerUserDataSync, 60000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', triggerUserDataSync);
      clearInterval(interval);
    };
  }, [dispatch, reduxUser.profilePicUrl, syncUserDataToRedux]);

  // Auth actions
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Comprehensive cleanup of all localStorage data
      cleanupAfterLogout();

      // Dispatch Redux logout to reset state
      await dispatch(logoutThunk()).unwrap();

      // Update local state
      setAuthState({
        user: null,
        error: null,
        isLoading: false,
        isRefreshing: false,
        isAuthenticated: false,
        timeUntilExpiration: null,
      });

      // Redirect to login
      router.push('/login');

      console.log('AuthProvider: Logout successful with full cleanup');
    } catch (error) {
      console.error('AuthProvider: Logout failed:', error);

      // ALWAYS force local cleanup for security - this is critical
      cleanupAfterLogout();

      // Fire-and-forget Redux logout (don't let server errors block local logout)
      dispatch(logoutThunk());

      // Determine error message based on error type
      let errorMessage = 'Logout failed. Please try again.';

      if (error instanceof Error) {
        // Network errors
        if (
          error.message.includes('fetch') ||
          error.message.includes('network') ||
          error.message.includes('Failed to fetch')
        ) {
          errorMessage =
            'Network error during logout. You have been logged out locally.';
        } else {
          errorMessage = error.message;
        }
      }

      // Update state to show user is logged out (even if server call failed)
      setAuthState({
        user: null,
        error: errorMessage,
        isLoading: false,
        isRefreshing: false,
        isAuthenticated: false,
        timeUntilExpiration: null,
      });

      // ALWAYS redirect to login for security
      router.push('/login');

      console.log('AuthProvider: Forced local logout due to server error');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const debugAuth = useCallback(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('AuthProvider State:', authState);
    console.log('=====================');
  }, [authState]);

  const authContextValue: AuthContextType = {
    logout,
    authState,
    debugAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <DevToolsWrapper />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
