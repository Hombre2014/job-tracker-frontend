import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useCallback } from 'react';

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

  const exp = accessToken ? getTokenExpiration(accessToken) : undefined;

  const refreshWithRetry = useCallback(async () => {
    if (!refreshToken) return;

    try {
      await dispatch(refreshTokenThunk(refreshToken)).unwrap();
      retryCountRef.current = 0; // Reset on success
    } catch (error) {
      retryCountRef.current++;

      if (retryCountRef.current < MAX_RETRIES) {
        // Retry after 5 seconds
        setTimeout(refreshWithRetry, 5000);
      } else {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      }
    }
  }, [dispatch, refreshToken, router]);

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
