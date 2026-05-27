import clsx from 'clsx';
import { getInitials } from '@/utils/formatters.js';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function Avatar({ name = '', src, size = 'md', className = '', ...props }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover', sizeClasses[size], className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
