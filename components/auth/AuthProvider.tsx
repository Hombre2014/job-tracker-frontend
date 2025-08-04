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

import { cleanupAfterLogout } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUserData, logout as logoutThunk } from '@/redux/user/userSlice';

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
  isAuthenticated: boolean;
}

interface AuthContextType {
  // State
  authState: AuthState;

  // Actions
  logout: () => Promise<void>;
  clearError: () => void;

  // Utilities
  getAuthStatus: () => {
    isAuthenticated: boolean;
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

  // Determine authentication status based on user data
  const isAuthenticated = Boolean(reduxUser.userId && reduxUser.email);

  // Local auth state
  const [authState, setAuthState] = useState<AuthState>(() => ({
    isLoading: false,
    isAuthenticated: isAuthenticated,
    user: isAuthenticated
      ? {
          email: reduxUser.email,
          id: reduxUser.userId || '',
          lastName: reduxUser.lastName || '',
          firstName: reduxUser.firstName || '',
          profilePicUrl: reduxUser.profilePicUrl,
        }
      : null,
    error: null,
  }));

  // Sync user data from localStorage to Redux
  const syncUserDataToRedux = useCallback(() => {
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
        console.error('AuthProvider: Error parsing user data:', error);
      }
    }
    return null;
  }, [dispatch]);

  // Update auth state when Redux user state changes
  useEffect(() => {
    const userAuthenticated = Boolean(reduxUser.userId && reduxUser.email);

    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: userAuthenticated,
      user: userAuthenticated
        ? {
            email: reduxUser.email,
            id: reduxUser.userId || '',
            lastName: reduxUser.lastName || '',
            firstName: reduxUser.firstName || '',
            profilePicUrl: reduxUser.profilePicUrl,
          }
        : null,
    }));
  }, [reduxUser]);

  // Initialize on mount
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) return;
    initializationRef.current = true;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        'AuthProvider: Initializing authentication system (HTTP-only cookies)'
      );
    }

    // Load user data from localStorage if available
    syncUserDataToRedux();
  }, [syncUserDataToRedux]);

  // Auth actions
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Dispatch Redux logout to reset state and call server
      await dispatch(logoutThunk()).unwrap();

      // Update local state
      setAuthState({
        user: null,
        error: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // Redirect to login
      router.push('/login');

      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout failed:', error);

      // The logout thunk already handles cleanup, so just update local state
      setAuthState({
        user: null,
        error: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // ALWAYS redirect to login for security
      router.push('/login');

      console.log('AuthProvider: Forced local logout due to server error');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const getAuthStatus = useCallback(() => {
    return {
      isAuthenticated: Boolean(reduxUser.userId && reduxUser.email),
    };
  }, [reduxUser.userId, reduxUser.email]);

  const debugAuth = useCallback(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('AuthProvider State:', authState);
    console.log('Redux User State:', reduxUser);
    console.log(
      'Is Authenticated:',
      Boolean(reduxUser.userId && reduxUser.email)
    );
    console.log('=====================');
  }, [authState, reduxUser]);

  const authContextValue: AuthContextType = {
    logout,
    authState,
    debugAuth,
    clearError,
    getAuthStatus,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
