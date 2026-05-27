import React from 'react';
import clsx from 'clsx';

function ModalFooter({ children, className = '' }) {
  return (
    <div className={clsx('flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl', className)}>
      {children}
    </div>
  );
}

export default ModalFooter;
