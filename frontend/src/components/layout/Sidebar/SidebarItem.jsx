import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

function SidebarItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive ? 'bg-primary-600 text-white' : 'text-secondary-300 hover:bg-secondary-800'
        )
      }
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </NavLink>
  );
}

export default SidebarItem;
