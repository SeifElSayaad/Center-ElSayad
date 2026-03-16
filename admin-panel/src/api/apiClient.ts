import axios from 'axios';

// Central-ElSayad backend runs on port 3000 locally
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT token
apiClient.interceptors.request.use(
  async (config) => {
    // We'll store the admin token in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
