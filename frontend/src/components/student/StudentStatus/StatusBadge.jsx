import React from 'react';

function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TRANSFERRED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DROPPED_OUT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}>
      {status || 'UNKNOWN'}
    </span>
  );
}

export default StatusBadge;
