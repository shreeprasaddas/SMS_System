function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-secondary-200">
      <h3 className="text-lg font-semibold text-secondary-900">{children}</h3>
      {onClose && (
        <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600 text-xl">✕</button>
      )}
    </div>
  );
}

export default ModalHeader;
