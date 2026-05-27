import React, { useState } from 'react';
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
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PresentationChartBarIcon,
  CalculatorIcon,
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  HomeModernIcon,
  BuildingLibraryIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { usePermission } from '@/hooks/usePermission.jsx';
import clsx from 'clsx';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { can, role } = usePermission();
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const menuGroups = [
    {
      id: 'main',
      items: [
        {
          label: 'Dashboard',
          icon: HomeIcon,
          path: '/dashboard',
          permission: null,
        },
      ],
    },
    {
      id: 'academic',
      label: 'Academic',
      items: [
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
          label: 'Classes',
          icon: BookOpenIcon,
          path: '/classes',
          permission: 'VIEW_CLASSES',
        },
        {
          label: 'Subjects',
          icon: ClipboardDocumentListIcon,
          path: '/subjects',
          permission: 'VIEW_SUBJECTS',
        },
        {
          label: 'Library',
          icon: BuildingLibraryIcon,
          path: '/library',
          permission: 'VIEW_LIBRARY',
        },
      ],
    },
    {
      id: 'assessment',
      label: 'Assessment',
      items: [
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
          label: 'Exams',
          icon: ClipboardDocumentListIcon,
          path: '/exams',
          permission: 'VIEW_EXAMS',
        },
        {
          label: 'Assignments',
          icon: BookOpenIcon,
          path: '/assignments',
          permission: 'VIEW_ASSIGNMENTS',
        },
      ],
    },
    {
      id: 'finance',
      label: 'Finance',
      items: [
        {
          label: 'Fees',
          icon: CurrencyDollarIcon,
          path: '/finance/fees',
          permission: 'VIEW_FEES',
        },
        {
          label: 'Expenses',
          icon: CalculatorIcon,
          path: '/finance/expenses',
          permission: 'VIEW_FEES',
        },
        {
          label: 'Reports',
          icon: ChartBarIcon,
          path: '/finance/reports',
          permission: 'VIEW_FEES',
        },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        {
          label: 'Admissions',
          icon: UserPlusIcon,
          path: '/admissions',
          permission: 'VIEW_ADMISSIONS',
        },
        {
          label: 'Timetables',
          icon: ClockIcon,
          path: '/timetables',
          permission: 'VIEW_TIMETABLES',
        },
        {
          label: 'Announcements',
          icon: ChatBubbleLeftRightIcon,
          path: '/communication',
          permission: 'VIEW_COMMUNICATION',
        },
        {
          label: 'Messages',
          icon: EnvelopeIcon,
          path: '/communication/messages',
          permission: 'VIEW_COMMUNICATION',
        },
        {
          label: 'Discipline',
          icon: ExclamationTriangleIcon,
          path: '/discipline',
          permission: 'VIEW_DISCIPLINE',
        },
        {
          label: 'Alumni Network',
          icon: AcademicCapIcon,
          path: '/alumni',
          permission: 'VIEW_ALUMNI',
        },
      ],
    },
    {
      id: 'operations',
      label: 'Operations & Logistics',
      items: [
        {
          label: 'Hostels & Boarding',
          icon: HomeModernIcon,
          path: '/hostels',
          permission: 'VIEW_HOSTELS',
        },
        {
          label: 'Transport Fleet',
          icon: TruckIcon,
          path: '/transport',
          permission: 'VIEW_TRANSPORT',
        },
      ],
    },
    {
      id: 'reporting',
      label: 'Reports & Analytics',
      items: [
        {
          label: 'Dashboard',
          icon: ChartBarIcon,
          path: '/analytics/dashboard',
          permission: 'VIEW_REPORTS',
        },
        {
          label: 'Academic',
          icon: AcademicCapIcon,
          path: '/analytics/academic',
          permission: 'VIEW_REPORTS',
        },
        {
          label: 'Engagement',
          icon: UserGroupIcon,
          path: '/analytics/engagement',
          permission: 'VIEW_REPORTS',
        },
        {
          label: 'Benchmarking',
          icon: DocumentTextIcon,
          path: '/analytics/benchmarks',
          permission: 'VIEW_REPORTS',
        },
      ],
    },
    {
      id: 'portals',
      label: 'Portals',
      items: [
        {
          label: 'Parent Portal',
          icon: ComputerDesktopIcon,
          path: '/parent-portal',
          permission: 'VIEW_PORTAL',
        },
      ],
    },
    {
      id: 'hr',
      label: 'Human Resources',
      items: [
        {
          label: 'Staff Directory',
          icon: UserGroupIcon,
          path: '/hr/staff',
          permission: 'VIEW_STAFF',
        },
        {
          label: 'Leave Management',
          icon: CalendarIcon,
          path: '/hr/leave',
          permission: 'VIEW_LEAVES',
        },
        {
          label: 'Payroll',
          icon: BriefcaseIcon,
          path: '/hr/payroll',
          permission: 'VIEW_PAYROLL',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      items: [
        {
          label: 'My Profile',
          icon: UserIcon,
          path: '/profile',
        },
        {
          label: 'School Profile',
          icon: DocumentTextIcon,
          path: '/settings/school',
          permission: 'MANAGE_SETTINGS',
        },
        {
          label: 'System Settings',
          icon: Cog6ToothIcon,
          path: '/settings/system',
          permission: 'MANAGE_SETTINGS',
        },
      ],
    },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Check if any item in a group is visible
  const groupHasVisibleItems = (group) => {
    return group.items.some(
      (item) => !item.permission || can(item.permission)
    );
  };

  // Check if any item in a group is active
  const groupHasActiveItem = (group) => {
    return group.items.some((item) => isActive(item.path));
  };

  // Auto-expand groups with active items
  const isGroupExpanded = (group) => {
    if (expandedGroups[group.id] !== undefined) return expandedGroups[group.id];
    return groupHasActiveItem(group);
  };

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
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-lg font-bold">
              S
            </div>
            <span className="text-xl font-bold tracking-wide">SMS</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-secondary-800 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {menuGroups.map((group) => {
            if (!groupHasVisibleItems(group)) return null;

            // No label = top-level items (Dashboard)
            if (!group.label) {
              return group.items.map((item) => {
                if (item.permission && !can(item.permission)) return null;
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      active
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-secondary-300 hover:bg-secondary-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              });
            }

            const expanded = isGroupExpanded(group);

            return (
              <div key={group.id} className="mt-2">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs uppercase tracking-wider text-secondary-500 hover:text-secondary-300 transition-colors"
                >
                  <span className="font-semibold">{group.label}</span>
                  {expanded ? (
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Group Items */}
                {expanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {group.items.map((item) => {
                      if (item.permission && !can(item.permission)) return null;
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm',
                            active
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-secondary-300 hover:bg-secondary-800'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary-700">
          <p className="text-xs text-secondary-400 text-center">
            SMS v1.0.0 © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
