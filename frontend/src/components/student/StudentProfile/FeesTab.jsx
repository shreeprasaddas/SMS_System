import React from 'react';
import { Card } from '@/components/common';

function FeesTab({ student }) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Fee History</h3>
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-gray-500 font-medium">Finance Module Disabled</p>
          <p className="text-sm text-gray-400 mt-1">Fee records are temporarily unavailable.</p>
        </div>
      </Card>
    </div>
  );
}

export default FeesTab;
