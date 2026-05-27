import React from 'react';
import clsx from 'clsx';

function SearchBar({ value = '', onChange, onSearch, placeholder = 'Search...', className = '', ...props }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <div className={clsx('relative flex items-center w-full max-w-md', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
        &#128269;
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg text-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
