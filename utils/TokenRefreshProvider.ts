import React, { useEffect, useRef } from 'react';

import { getTokenExpiration } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { refreshAccessToken as refreshTokenThunk } from '@/redux/auth/refreshAccessTokenThunk';

const TokenRefreshProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken } = useAppSelector((state) => state.user);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const exp = getTokenExpiration(accessToken);
    if (!exp) return;

    // Refresh 1 minute before expiration
    const now = Date.now();
    const refreshTime = exp - now - 60 * 1000;
    if (refreshTime <= 0) {
      // Token already expired or about to expire, refresh immediately
      dispatch(refreshTokenThunk(refreshToken));
      return;
    }

    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(refreshTokenThunk(refreshToken));
    }, refreshTime);

    // Cleanup on unmount or token change
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [accessToken, refreshToken, dispatch]);

  return children;
};

export default TokenRefreshProvider;
