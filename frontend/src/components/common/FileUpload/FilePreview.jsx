import { formatFileSize } from '@/utils/fileUtils.js';

function FilePreview({ file, onRemove }) {
  if (!file) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-secondary-900 truncate">{file.name}</p>
        <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-sm">✕</button>
      )}
    </div>
  );
}

export default FilePreview;
