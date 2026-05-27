import clsx from 'clsx';

function EmptyState({ title = 'No data found', description = '', icon, action, className = '' }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && <div className="text-secondary-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-secondary-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-secondary-500 mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
