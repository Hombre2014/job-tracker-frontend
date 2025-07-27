'use client';

import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  logout as logoutThunk,
  updateUserTokens,
  updateUserData,
} from '@/redux/user/userSlice';
import TokenManager from '@/utils/TokenManager';
import SmartTokenRefresh from '@/utils/SmartTokenRefresh';
import DevTools from '@/components/dev/DevTools';
// import AuthErrorHandler from '@/utils/AuthErrorHandler'; // Temporarily disabled to fix circular dependency

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  timeUntilExpiration: number | null;
  error: string | null;
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
    isAuthenticated: boolean;
    isRefreshing: boolean;
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
  const reduxUser = useAppSelector((state) => state.user);
  const initializationRef = useRef(false);

  // Local auth state
  const [authState, setAuthState] = useState<AuthState>(() => {
    const hasValidTokens = TokenManager.hasValidTokens();
    const refreshStatus = SmartTokenRefresh.getStatus();

    return {
      isAuthenticated: hasValidTokens,
      isRefreshing: refreshStatus.isRefreshing,
      isLoading: false,
      user:
        hasValidTokens && reduxUser.email
          ? {
              id: reduxUser.userId || '',
              email: reduxUser.email,
              firstName: reduxUser.firstName || '',
              lastName: reduxUser.lastName || '',
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
              id: reduxUser.userId || '',
              email: reduxUser.email,
              firstName: reduxUser.firstName || '',
              lastName: reduxUser.lastName || '',
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

    // Update every 30 seconds
    const interval = setInterval(updateAuthState, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('AuthProvider: Initializing authentication system');

    // Sync tokens from localStorage to Redux on app startup
    TokenManager.syncTokensToRedux();

    // Load user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('AuthProvider: Loading stored user data:', userData);

        // Update Redux with stored user data
        dispatch(
          updateUserData({
            userId: userData.userId || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            profilePicUrl: userData.profilePicUrl || '',
            role: userData.role || 'user',
          })
        );
      } catch (error) {
        console.error('AuthProvider: Error parsing stored user data:', error);
      }
    }

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
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log(
            'AuthProvider: localStorage user data changed, syncing to Redux:',
            userData
          );

          // Update Redux with latest user data
          dispatch(
            updateUserData({
              userId: userData.userId || '',
              email: userData.email || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              profilePicUrl: userData.profilePicUrl || '',
              role: userData.role || 'user',
            })
          );
        } catch (error) {
          console.error(
            'AuthProvider: Error parsing updated user data:',
            error
          );
        }
      }
    };

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(() => {
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
    }, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [dispatch, reduxUser.profilePicUrl]);

  // Watch for token changes and restart SmartTokenRefresh
  useEffect(() => {
    const hasValidTokens = TokenManager.hasValidTokens();

    if (hasValidTokens) {
      console.log('AuthProvider: Tokens detected, restarting smart refresh');
      SmartTokenRefresh.restart();

      // Sync user data from localStorage to Redux if missing
      if (!reduxUser.firstName || !reduxUser.email) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('AuthProvider: Syncing user data to Redux:', userData);

            // Update Redux with the stored user data
            dispatch(
              updateUserTokens({
                accessToken: userData.accessToken || reduxUser.accessToken,
                refreshToken: userData.refreshToken || reduxUser.refreshToken,
              })
            );

            // Update Redux with user info
            dispatch(
              updateUserData({
                userId: userData.userId || '',
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                profilePicUrl: userData.profilePicUrl || '',
                role: userData.role || 'user',
              })
            );

            // Update auth state
            setAuthState((prev) => ({
              ...prev,
              user: {
                id: userData.userId || '',
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                profilePicUrl: userData.profilePicUrl || '',
              },
              isAuthenticated: true,
            }));
          } catch (error) {
            console.error(
              'AuthProvider: Error parsing stored user data:',
              error
            );
          }
        }
      }
    }
  }, [
    reduxUser.accessToken,
    reduxUser.refreshToken,
    reduxUser.firstName,
    reduxUser.email,
    dispatch,
  ]);

  // Auth actions
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Dispatch Redux logout
      await dispatch(logoutThunk()).unwrap();

      // Clear tokens
      TokenManager.clearTokens();

      // Update local state
      setAuthState({
        isAuthenticated: false,
        isRefreshing: false,
        isLoading: false,
        user: null,
        timeUntilExpiration: null,
        error: null,
      });

      // Redirect to login
      router.push('/login');

      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout failed:', error);

      // Handle logout error (simplified for now)

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed. Please try again.',
      }));
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
    authState,
    refreshToken,
    logout,
    clearError,
    getAuthStatus,
    debugAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <DevTools />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
