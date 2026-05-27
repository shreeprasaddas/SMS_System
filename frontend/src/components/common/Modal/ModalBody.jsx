import React from 'react';
import clsx from 'clsx';

function ModalBody({ children, className = '' }) {
  return <div className={clsx('p-6 overflow-y-auto', className)}>{children}</div>;
}

export default ModalBody;
