import React from 'react';
import clsx from 'clsx';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-secondary-200 shadow-sm p-6 transition-all duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
