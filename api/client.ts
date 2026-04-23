import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// interceptors for expired JWT ACCESS_TOKEN
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest._retry)
      return Promise.reject(error);

    originalRequest._retry = true
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/auth/refresh',
        {},
        { withCredentials: true },
      )
      return client(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  },
)

export default client;
