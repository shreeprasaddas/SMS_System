import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout, setError, clearError, setLoading } from '@/store/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLoginSuccess = (user, token, refreshToken) => {
    dispatch(loginSuccess({ user, token, refreshToken }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const setAuthLoading = (loading) => {
    dispatch(setLoading(loading));
  };

  const setAuthError = (err) => {
    dispatch(setError(err));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    loginSuccess: handleLoginSuccess,
    logout: handleLogout,
    setLoading: setAuthLoading,
    setError: setAuthError,
    clearError: clearAuthError,
  };
};

export default useAuth;
