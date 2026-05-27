import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    primary: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-700/10',
    secondary: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
    success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
    warning: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
    info: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
