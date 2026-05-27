import { useCallback } from 'react';
import clsx from 'clsx';
import { formatFileSize } from '@/utils/fileUtils.js';

function FileUpload({ onFileSelect, accept, multiple = false, maxSize = 5 * 1024 * 1024, label = 'Upload File', className = '' }) {
  const handleChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((f) => f.size <= maxSize);
    if (validFiles.length > 0) onFileSelect?.(multiple ? validFiles : validFiles[0]);
  }, [onFileSelect, maxSize, multiple]);

  return (
    <div className={clsx('flex flex-col items-center justify-center border-2 border-dashed border-secondary-300 rounded-lg p-6 hover:border-primary-400 transition-colors cursor-pointer', className)}>
      <label className="cursor-pointer text-center">
        <span className="text-sm font-medium text-primary-600 hover:text-primary-700">{label}</span>
        <p className="text-xs text-secondary-500 mt-1">Max size: {formatFileSize(maxSize)}</p>
        <input type="file" className="hidden" accept={accept} multiple={multiple} onChange={handleChange} />
      </label>
    </div>
  );
}

export default FileUpload;
