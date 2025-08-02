import axios from 'axios';
import { TokenManager } from '@/utils/TokenManager';
import { RequestQueue } from '@/utils/RequestQueue';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 second timeout
});

/**
 * Perform token refresh using TokenManager
 */
async function performTokenRefresh(): Promise<string> {
  const refreshToken = TokenManager.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const refreshResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      null,
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        timeout: 10000, // 10 second timeout for refresh
      }
    );

    if (refreshResponse.status === 200 || refreshResponse.status === 201) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        refreshResponse.data;

      // Update tokens in localStorage only (avoid circular dependency)
      TokenManager.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      // Dispatch custom event for Redux updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('tokensUpdated', {
            detail: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            },
          })
        );
      }

      return newAccessToken;
    } else {
      throw new Error('Refresh failed');
    }
  } catch (refreshError) {
    // Clear tokens and redirect to login
    TokenManager.clearTokens();

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw refreshError;
  }
}

// Request interceptor - Add Authorization header (simplified to fix CORS)
client.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const authHeader = TokenManager.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors with token refresh
client.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `API Request: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${response.status}`
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Always log 401 errors for debugging
    if (error.response?.status === 401) {
      console.log('API Client: 401 Unauthorized detected:', {
        url: originalRequest?.url,
        hasValidTokens: TokenManager.hasValidTokens(),
        isRetry: originalRequest._retry,
        isLoginRequest: originalRequest.url?.includes('/auth/login'),
      });
    }

    // Only handle 401 errors on client side, skip login requests
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      console.log('API Client: 401 error detected, checking tokens...', {
        url: originalRequest?.url,
        hasValidTokens: TokenManager.hasValidTokens(),
      });

      originalRequest._retry = true;

      // Check if we have valid tokens before attempting refresh
      if (!TokenManager.hasValidTokens()) {
        console.log('API Client: No valid tokens found, redirecting to login');
        TokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Start refresh if not already in progress
        if (!RequestQueue.isCurrentlyRefreshing()) {
          RequestQueue.setRefreshPromise(performTokenRefresh());
        }

        try {
          const newAccessToken = await RequestQueue.waitForRefresh();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
