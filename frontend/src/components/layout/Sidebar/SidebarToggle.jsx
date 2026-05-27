import React from 'react';

function SidebarToggle({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-secondary-800 rounded-lg text-white"
      title={isOpen ? 'Collapse' : 'Expand'}
    >
      {isOpen ? '◀' : '▶'}
    </button>
  );
}

export default SidebarToggle;
