import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;

      // Store in localStorage
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // Login failure
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update user
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },

    // Refresh token success
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('accessToken', action.payload.token);
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  setLoading,
  setError,
  clearError,
  updateUser,
  refreshTokenSuccess,
  initializeAuth,
} = authSlice.actions;

// Thunk for refresh token
export const refreshToken = () => async (dispatch, getState) => {
  try {
    // This will be called by API middleware
    // For now, we'll keep tokens as they are
  } catch (error) {
    console.error('Token refresh failed:', error);
    dispatch(logout());
  }
};

export default authSlice.reducer;
