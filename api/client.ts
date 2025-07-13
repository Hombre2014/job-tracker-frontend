import axios from 'axios';

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

// Global error interceptor for 401 responses
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (typeof window !== 'undefined' && 
        error.response?.status === 401 && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
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
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Retry the original request
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, proceed to logout
        }
      }
      
      // Clear tokens and redirect to login
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
