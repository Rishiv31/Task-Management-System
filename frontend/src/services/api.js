import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('taskflow-auth-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth token from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally (e.g. 401/403 Session Expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Session expired or token invalid -> Clear storage and redirect to login
      console.warn('Session expired or unauthorized. Redirecting to login.');
      localStorage.removeItem('taskflow-auth-storage');
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
