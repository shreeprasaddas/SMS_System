import { Link } from 'react-router-dom';
import clsx from 'clsx';

function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={clsx('flex items-center text-sm text-secondary-500', className)} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.href && index < items.length - 1 ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? 'text-secondary-900 font-medium' : ''}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
