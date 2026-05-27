import axios from 'axios';
import store from '@/store/store.js';
import { logout, loginSuccess } from '@/store/slices/authSlice.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add bearer token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not retrying yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const state = store.getState();
        const refreshToken = state.auth?.refreshToken;

        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Call base Axios instance to refresh token
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          { refreshToken }
        );

        if (res.status === 200 && res.data?.data) {
          const { token, refreshToken: newRefreshToken } = res.data.data;
          
          // Save tokens in redux
          store.dispatch(
            loginSuccess({
              user: state.auth.user,
              token,
              refreshToken: newRefreshToken,
            })
          );

          // Retry request
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('API token refresh error:', err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    // Default error formatting
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(formattedError);
  }
);

export default api;
