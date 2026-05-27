import clsx from 'clsx';

function Modal({ isOpen, onClose, children, size = 'md', className = '' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className={clsx('bg-white rounded-xl shadow-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto', sizes[size], className)}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
