import clsx from 'clsx';

function CardBody({ children, className = '', ...props }) {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  );
}

export default CardBody;
