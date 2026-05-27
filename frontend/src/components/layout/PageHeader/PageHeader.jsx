import React from 'react';
import clsx from 'clsx';

function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={clsx('flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
        {subtitle && <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
