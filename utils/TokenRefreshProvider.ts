import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useCallback } from 'react';

import { logout } from '@/redux/user/userThunk';
import { getTokenExpiration } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { refreshAccessToken as refreshTokenThunk } from '@/redux/auth/refreshAccessTokenThunk';

const TokenRefreshProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const MAX_RETRIES = 3;
  const router = useRouter();
  const retryCountRef = useRef(0);
  const dispatch = useAppDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { accessToken, refreshToken } = useAppSelector((state) => state.user);
  const refreshTokenRef = useRef(refreshToken);

  // Keep refreshTokenRef current
  refreshTokenRef.current = refreshToken;

  const exp = accessToken ? getTokenExpiration(accessToken) : undefined;

  const refreshWithRetry = useCallback(async () => {
    const currentRefreshToken = refreshTokenRef.current;
    if (!currentRefreshToken) return;

    try {
      await dispatch(refreshTokenThunk(currentRefreshToken)).unwrap();
      retryCountRef.current = 0; // Reset on success
    } catch (error) {
      retryCountRef.current++;

      if (retryCountRef.current < MAX_RETRIES) {
        // Retry after 5 seconds
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(refreshWithRetry, 5000) as unknown as NodeJS.Timeout;
      } else {
        // Clear tokens and redirect to login
        if (typeof Storage !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        dispatch(logout());
        router.push('/login');
      }
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    if (!exp) return;

    // Refresh 1 minute before expiration
    const now = Date.now();
    const refreshTime = exp - now - 60 * 1000;
    if (refreshTime <= 0) {
      // Token already expired or about to expire, refresh immediately
      refreshWithRetry();
      return;
    }

    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      refreshWithRetry();
    }, refreshTime);

    // Cleanup on unmount or token change
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [accessToken, refreshToken, dispatch, exp, refreshWithRetry]);

  return children;
};

export default TokenRefreshProvider;
