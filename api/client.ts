import axios from 'axios';
import { TokenManager } from '@/utils/TokenManager';
import { RequestQueue } from '@/utils/RequestQueue';
// import AuthErrorHandler from '@/utils/AuthErrorHandler'; // Temporarily disabled to fix circular dependency

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 second timeout
});

// Refresh token synchronization to prevent race conditions
let refreshPromise: Promise<string> | null = null;

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

      // Update tokens using TokenManager (handles both localStorage and Redux)
      TokenManager.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

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

    // Only handle 401 errors on client side, skip login requests
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        // Check if refresh is already in progress
        if (RequestQueue.isCurrentlyRefreshing()) {
          // Wait for existing refresh or queue the request
          try {
            await RequestQueue.waitForRefresh();
            // Retry with updated token
            const authHeader = TokenManager.getAuthHeader();
            if (authHeader) {
              originalRequest.headers.Authorization = authHeader;
              return client(originalRequest);
            } else {
              throw new Error('No token after refresh');
            }
          } catch (refreshError) {
            return Promise.reject(error);
          }
        }

        // Start new refresh
        if (!refreshPromise) {
          refreshPromise = performTokenRefresh();
          RequestQueue.setRefreshPromise(refreshPromise);

          try {
            const newAccessToken = await refreshPromise;
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            // Retry the original request
            return client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(error);
          } finally {
            refreshPromise = null;
          }
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
