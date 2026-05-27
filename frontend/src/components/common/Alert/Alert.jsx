import clsx from 'clsx';

const variants = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

function Alert({ children, variant = 'info', className = '', onClose, ...props }) {
  return (
    <div
      className={clsx('border rounded-lg p-4 flex items-start gap-3', variants[variant], className)}
      role="alert"
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-50 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
