import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative inline-block', className)} ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={clsx(
          'absolute z-50 mt-2 min-w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
