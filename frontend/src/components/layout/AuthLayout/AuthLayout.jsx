import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              SMS
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mt-4">
              School Management System
            </h1>
            <p className="text-secondary-500 mt-2">Manage your school efficiently</p>
          </div>

          {/* Page Content */}
          <Outlet />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-secondary-200 text-center text-sm text-secondary-500">
            <p>&copy; 2026 School Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
