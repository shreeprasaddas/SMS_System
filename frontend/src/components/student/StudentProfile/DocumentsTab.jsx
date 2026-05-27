import React from 'react';
import { Card } from '@/components/common';
import { DocumentList } from '../StudentDocuments/index.js';

function DocumentsTab({ student }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Student Documents</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="text-gray-500 font-medium">Document Management Disabled</p>
          <p className="text-sm text-gray-400 mt-1">The documents service is currently undergoing maintenance.</p>
        </div>
      </Card>
    </div>
  );
}

export default DocumentsTab;
