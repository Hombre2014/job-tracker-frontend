'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Protected Route Component
 * Handles authentication-based route protection
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <div>Loading...</div>,
  redirectTo = '/login',
  requireAuth = true,
}) => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only proceed if auth state has been initialized
    if (authState.isLoading) return;
    
    if (requireAuth && !authState.isAuthenticated && !authState.isLoading) {
      console.log('ProtectedRoute: User not authenticated, redirecting to:', redirectTo);
      router.push(redirectTo);
      return;
    }

    if (!requireAuth && authState.isAuthenticated) {
      console.log('ProtectedRoute: User already authenticated, redirecting to home');
      router.push('/home');
      return;
    }

    setIsChecking(false);
  }, [authState.isAuthenticated, authState.isLoading, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  if (isChecking || authState.isLoading) {
    return <>{fallback}</>;
  }

  // Show children if auth requirements are met
  if (requireAuth && authState.isAuthenticated) {
    return <>{children}</>;
  }

  if (!requireAuth && !authState.isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback (shouldn't reach here normally)
  return <>{fallback}</>;
};

/**
 * Higher-order component for route protection
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean;
    redirectTo?: string;
    fallback?: React.ReactNode;
  } = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook for conditional rendering based on auth status
 */
export const useAuthGuard = () => {
  const { authState } = useAuth();

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    
    // Conditional rendering helpers
    whenAuthenticated: (component: React.ReactNode) => 
      authState.isAuthenticated ? component : null,
    
    whenNotAuthenticated: (component: React.ReactNode) => 
      !authState.isAuthenticated ? component : null,
    
    whenLoading: (component: React.ReactNode) => 
      authState.isLoading ? component : null,
  };
};

export default ProtectedRoute;
