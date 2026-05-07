import React from 'react';
import clsx from 'clsx';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-secondary-200 shadow-sm p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
