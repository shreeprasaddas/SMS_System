import React from 'react';
import clsx from 'clsx';

function Select({ label, value, onChange, options = [], error, placeholder = 'Select option', className = '', ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-secondary-700">{label}</label>}
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(
          'block w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-red-500' : 'border-secondary-300'
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Select;
