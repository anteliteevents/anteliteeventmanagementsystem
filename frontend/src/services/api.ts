import axios, { AxiosInstance, AxiosError } from 'axios';

// Determine API base URL:
// 1) Respect REACT_APP_API_URL if provided at build time.
// 2) If running in browser without the env var, fall back based on host:
//    - On Vercel/production: use the Render backend URL.
//    - On localhost: use local API.
const inferBrowserApiBase = () => {
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  if (
    host.includes('vercel.app') ||
    host.includes('anteliteeventssystem') ||
    host.endsWith('antelite.digital')
  ) {
    return 'https://anteliteeventssystem.onrender.com';
  }
  return 'http://localhost:3001';
};

const API_URL = process.env.REACT_APP_API_URL || inferBrowserApiBase() || 'http://localhost:3001';

// Debug logging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL:', API_URL);
  console.log('🔗 Full API Base:', `${API_URL}/api`);
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For FormData uploads, don't set Content-Type - let browser/axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

