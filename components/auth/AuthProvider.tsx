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
import { TokenManager } from '@/utils/TokenManager';
import { cleanupAfterLogout } from '@/utils/helpers';
import { SmartTokenRefresh } from '@/utils/SmartTokenRefresh';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  updateUserData,
  updateUserTokens,
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
  refreshToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;

  // Utilities
  getAuthStatus: () => {
    isRefreshing: boolean;
    isAuthenticated: boolean;
    timeUntilExpiration: number | null;
  };
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
    const refreshStatus = SmartTokenRefresh.getStatus();
    const hasValidTokens = TokenManager.hasValidTokens();

    return {
      isLoading: false,
      isAuthenticated: hasValidTokens,
      isRefreshing: refreshStatus.isRefreshing,
      user:
        hasValidTokens && reduxUser.email
          ? {
              email: reduxUser.email,
              id: reduxUser.userId || '',
              lastName: reduxUser.lastName || '',
              firstName: reduxUser.firstName || '',
              profilePicUrl: reduxUser.profilePicUrl,
            }
          : null,
      timeUntilExpiration: refreshStatus.timeUntilExpiration,
      error: null,
    };
  });

  // Update auth state when Redux user state changes
  useEffect(() => {
    const hasValidTokens = TokenManager.hasValidTokens();
    const refreshStatus = SmartTokenRefresh.getStatus();

    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: hasValidTokens,
      isRefreshing: refreshStatus.isRefreshing,
      user:
        hasValidTokens && reduxUser.email
          ? {
              email: reduxUser.email,
              id: reduxUser.userId || '',
              lastName: reduxUser.lastName || '',
              firstName: reduxUser.firstName || '',
              profilePicUrl: reduxUser.profilePicUrl,
            }
          : null,
      timeUntilExpiration: refreshStatus.timeUntilExpiration,
    }));
  }, [reduxUser]);

  // Periodic auth state updates
  useEffect(() => {
    const updateAuthState = () => {
      const hasValidTokens = TokenManager.hasValidTokens();
      const refreshStatus = SmartTokenRefresh.getStatus();

      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: hasValidTokens,
        isRefreshing: refreshStatus.isRefreshing,
        timeUntilExpiration: refreshStatus.timeUntilExpiration,
      }));
    };

    // Configurable update interval with validation and environment-based defaults
    const getAuthUpdateInterval = (): number => {
      const envInterval = process.env.NEXT_PUBLIC_AUTH_UPDATE_INTERVAL;

      if (envInterval) {
        const parsed = parseInt(envInterval, 10);
        // Validate range: minimum 10 seconds, maximum 5 minutes
        if (!isNaN(parsed) && parsed >= 10000 && parsed <= 300000) {
          return parsed;
        }
      }

      // Default: 30 seconds for development, 60 seconds for production
      return process.env.NODE_ENV === 'development' ? 30000 : 60000;
    };

    const UPDATE_INTERVAL = getAuthUpdateInterval();
    const interval = setInterval(updateAuthState, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) return;
    initializationRef.current = true;

    if (process.env.NODE_ENV === 'development') {
      console.log('AuthProvider: Initializing authentication system');
    }

    // Sync tokens from localStorage to Redux on app startup
    const tokens = TokenManager.getTokensForReduxSync();
    if (tokens) {
      dispatch(updateUserTokens(tokens));
    }

    // Load user data from localStorage if available
    syncUserDataToRedux('Loading stored user data');

    // Start smart token refresh if user has valid tokens
    if (TokenManager.hasValidTokens()) {
      console.log('AuthProvider: Valid tokens found, starting smart refresh');
      // SmartTokenRefresh is already initialized as singleton
    } else {
      console.log('AuthProvider: No valid tokens found');
    }

    // Cleanup on unmount
    return () => {
      SmartTokenRefresh.cleanup();
    };
  }, [dispatch]);

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

    // Listen for custom token update events (from SmartTokenRefresh and api/client)
    const handleTokensUpdated = (event: CustomEvent) => {
      const { accessToken, refreshToken } = event.detail;
      dispatch(updateUserTokens({ accessToken, refreshToken }));
      console.log('AuthProvider: Tokens updated via custom event');
    };
    window.addEventListener(
      'tokensUpdated',
      handleTokensUpdated as EventListener
    );

    // Listen for custom events that indicate user data changes
    window.addEventListener('userDataUpdated', triggerUserDataSync);

    // Reduced frequency polling as fallback (60 seconds instead of 10)
    const interval = setInterval(triggerUserDataSync, 60000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'tokensUpdated',
        handleTokensUpdated as EventListener
      );
      window.removeEventListener('userDataUpdated', triggerUserDataSync);
      clearInterval(interval);
    };
  }, [dispatch, reduxUser.profilePicUrl, syncUserDataToRedux]);

  // Watch for token changes and restart SmartTokenRefresh
  useEffect(() => {
    const hasValidTokens = TokenManager.hasValidTokens();

    if (hasValidTokens) {
      console.log('AuthProvider: Tokens detected, restarting smart refresh');
      SmartTokenRefresh.restart();

      // Sync user data from localStorage to Redux if missing
      if (!reduxUser.firstName || !reduxUser.email) {
        const userData = syncUserDataToRedux('Syncing user data to Redux');
        if (userData) {
          // Update Redux with tokens if available
          dispatch(
            updateUserTokens({
              accessToken: userData.accessToken || reduxUser.accessToken,
              refreshToken: userData.refreshToken || reduxUser.refreshToken,
            })
          );

          // Update auth state
          setAuthState((prev) => ({
            ...prev,
            user: {
              id: userData.userId || '',
              email: userData.email || '',
              lastName: userData.lastName || '',
              firstName: userData.firstName || '',
              profilePicUrl: userData.profilePicUrl || '',
            },
            isAuthenticated: true,
          }));
        }
      }
    }
  }, [
    dispatch,
    // reduxUser, // Use entire object instead of individual properties to reduce re-renders
    reduxUser.email,
    reduxUser.firstName,
    reduxUser.accessToken,
    reduxUser.refreshToken,
    syncUserDataToRedux,
  ]);

  // Auth actions
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Comprehensive cleanup of all localStorage data
      cleanupAfterLogout();

      // Clear tokens via TokenManager
      TokenManager.clearTokens();

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
      TokenManager.clearTokens();

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

  const refreshToken = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isRefreshing: true, error: null }));
      const success = await SmartTokenRefresh.refreshNow();

      if (!success) {
        setAuthState((prev) => ({
          ...prev,
          isRefreshing: false,
          error: 'Token refresh failed',
        }));
      }

      return success;
    } catch (error) {
      console.error('AuthProvider: Manual refresh failed:', error);
      setAuthState((prev) => ({
        ...prev,
        isRefreshing: false,
        error: 'Token refresh failed',
      }));
      return false;
    }
  }, []);

  const getAuthStatus = useCallback(() => {
    const refreshStatus = SmartTokenRefresh.getStatus();
    return {
      isAuthenticated: TokenManager.hasValidTokens(),
      isRefreshing: refreshStatus.isRefreshing,
      timeUntilExpiration: refreshStatus.timeUntilExpiration,
    };
  }, []);

  const debugAuth = useCallback(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('AuthProvider State:', authState);
    TokenManager.debugTokenState();
    SmartTokenRefresh.debugState();
    console.log('=====================');
  }, [authState]);

  const authContextValue: AuthContextType = {
    logout,
    authState,
    debugAuth,
    clearError,
    refreshToken,
    getAuthStatus,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <DevToolsWrapper />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
