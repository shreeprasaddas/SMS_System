import React from 'react';
import { DocumentUpload } from './index.js';

function DocumentList({ student }) {
  // Static mock for now
  const documents = student?.documents || [];

  return (
    <div className="space-y-4">
      <DocumentUpload studentId={student._id} />

      {documents.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No documents found for this student.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
          {documents.map((doc, index) => (
            <li key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">{doc.name || 'Document'}</p>
                  <p className="text-xs text-gray-500">Uploaded {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentList;
