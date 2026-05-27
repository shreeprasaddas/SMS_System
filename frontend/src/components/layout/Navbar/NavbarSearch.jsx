import React from 'react';

function NavbarSearch({ placeholder = 'Search...', ...props }) {
  return (
    <div className="relative max-w-xs">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-secondary-50"
        {...props}
      />
    </div>
  );
}

export default NavbarSearch;
