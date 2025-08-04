import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 second timeout
  withCredentials: true, // Include cookies in requests
});

/**
 * Perform token refresh using HTTP-only cookies
 */
async function performTokenRefresh(): Promise<void> {
  try {
    const refreshResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      null,
      {
        withCredentials: true, // Include cookies
        timeout: 10000, // 10 second timeout for refresh
      }
    );

    if (refreshResponse.status !== 200 && refreshResponse.status !== 201) {
      throw new Error('Refresh failed');
    }

    // Tokens are now set as HTTP-only cookies by the server
    // No need to handle them on the client side
  } catch (refreshError) {
    // Clear any client-side state and redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw refreshError;
  }
}

// Add request interceptor for authentication
client.interceptors.request.use(
  (config) => {
    // HTTP-only cookies are automatically included with withCredentials: true
    // No need to manually add authorization headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track refresh state without RequestQueue
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

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
      console.log(
        'API Client: 401 error detected, attempting token refresh...'
      );

      originalRequest._retry = true;

      // Check if we're already refreshing tokens
      if (isRefreshing) {
        // Wait for the current refresh to complete
        try {
          await refreshPromise;
          return client(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      // Start token refresh process
      isRefreshing = true;
      try {
        refreshPromise = performTokenRefresh();
        await refreshPromise;

        // Reset refresh state
        isRefreshing = false;
        refreshPromise = null;

        // Retry the original request
        return client(originalRequest);
      } catch (refreshError) {
        // Reset refresh state
        isRefreshing = false;
        refreshPromise = null;

        // Refresh failed, redirect to login
        console.log('API Client: Token refresh failed, redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
