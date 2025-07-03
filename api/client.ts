import axios from 'axios';

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

// Global error interceptor for 401 responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Clear tokens and redirect to login
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
