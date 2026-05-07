import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/slices/authSlice.js';
import { useLogoutMutation } from '../../../store/api/authApi.js';
import { Bars3Icon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

function Navbar({ onToggleSidebar, sidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      dispatch(logout());
      navigate('/auth/login');
    }
  };

  return (
    <nav className="bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
      {/* Left Side - Menu Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Bars3Icon className="w-6 h-6 text-secondary-700" />
        </button>
        <h2 className="text-lg font-semibold text-secondary-900">Dashboard</h2>
      </div>

      {/* Right Side - User Menu */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-secondary-900">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-secondary-500 capitalize">{user?.role?.toLowerCase()}</p>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-700"
          title="Logout"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
