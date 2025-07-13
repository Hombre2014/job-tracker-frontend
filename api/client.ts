import axios from 'axios';

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

// Refresh token synchronization to prevent race conditions
let refreshPromise: Promise<string> | null = null;

// Global error interceptor for 401 responses
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (typeof window !== 'undefined' && 
        error.response?.status === 401 && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      // If a refresh is already in progress, wait for it
      if (refreshPromise) {
        await refreshPromise;
        // After refresh completes, retry with updated token
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } else {
          // Refresh failed, proceed to logout
          throw error;
        }
      }
      
      // Start new refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        refreshPromise = (async () => {
          try {
            const refreshResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
              {
                headers: { Authorization: `Bearer ${refreshToken}` }
              }
            );
            
            if (refreshResponse.status === 200) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
              
              // Update localStorage
              localStorage.setItem('accessToken', newAccessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              
              // Update default headers for future requests
              client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              
              return newAccessToken;
            } else {
              throw new Error('Refresh failed');
            }
          } catch (refreshError) {
            // Clear tokens and redirect to login
            if (typeof Storage !== 'undefined') {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
            }
            delete client.defaults.headers.common['Authorization'];
            window.location.href = '/login';
            throw refreshError;
          } finally {
            refreshPromise = null;
          }
        })();
        
        try {
          const newAccessToken = await refreshPromise;
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, error handling already done in the promise
          return Promise.reject(error);
        }
      }
      
      // No refresh token available, proceed to logout
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      delete client.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
