import clsx from 'clsx';

function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={clsx('border-b border-secondary-200 pb-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default CardHeader;
