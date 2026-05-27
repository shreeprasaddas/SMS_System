import clsx from 'clsx';

function DropdownItem({ children, onClick, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      className={clsx('w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default DropdownItem;
