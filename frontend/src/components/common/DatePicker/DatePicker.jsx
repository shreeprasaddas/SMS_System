import clsx from 'clsx';

function DatePicker({ label, value, onChange, min, max, error, className = '', ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-secondary-700">{label}</label>}
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        className={clsx(
          'px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-red-500' : 'border-secondary-300'
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default DatePicker;
