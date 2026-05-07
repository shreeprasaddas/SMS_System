import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePermission } from '../../../hooks/usePermission.jsx';
import clsx from 'clsx';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { can } = usePermission();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      permission: null, // Everyone can see dashboard
    },
    {
      label: 'Students',
      icon: UserGroupIcon,
      path: '/students',
      permission: 'VIEW_STUDENTS',
    },
    {
      label: 'Teachers',
      icon: AcademicCapIcon,
      path: '/teachers',
      permission: 'VIEW_TEACHERS',
    },
    {
      label: 'Finance',
      icon: CurrencyDollarIcon,
      path: '/finance',
      permission: 'VIEW_FEES',
    },
    {
      label: 'Analytics',
      icon: ChartBarIcon,
      path: '/analytics',
      permission: 'VIEW_ANALYTICS',
    },
    {
      label: 'Attendance',
      icon: CalendarIcon,
      path: '/attendance',
      permission: 'VIEW_ATTENDANCE',
    },
    {
      label: 'Grades',
      icon: DocumentTextIcon,
      path: '/grades',
      permission: 'VIEW_GRADES',
    },
    {
      label: 'Settings',
      icon: Cog6ToothIcon,
      path: '/settings',
      permission: null,
    },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary-900 text-white transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-semibold">SMS</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-secondary-800 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            // Check if user has permission to see this menu item
            if (item.permission && !can(item.permission)) {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-300 hover:bg-secondary-800'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-700">
          <p className="text-xs text-secondary-400 text-center">
            SMS v1.0.0 © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
