import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request Interceptor: Attach JWT Token ───────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartmove_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle errors globally ────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem('smartmove_token');
        localStorage.removeItem('smartmove_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/session-expired';
        }
      } else if (status === 403) {
        window.location.href = '/403';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
