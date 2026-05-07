import clsx from 'clsx';

import React from 'react';

const Input = React.forwardRef(function Input({
  type = 'text',
  label,
  error,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) {
  const baseStyles =
    'w-full px-4 py-2.5 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';

  const errorStyles = error
    ? 'border-danger focus:ring-danger'
    : '';

  const disabledStyles = disabled
    ? 'bg-secondary-100 cursor-not-allowed'
    : 'bg-white';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-900 mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          baseStyles,
          disabledStyles,
          errorStyles,
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  );
});

export default Input;
