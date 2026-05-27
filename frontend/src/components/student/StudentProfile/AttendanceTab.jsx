import React from 'react';
import { Card } from '@/components/common';

function AttendanceTab({ student }) {
  // Currently frontend attendance module is pending connection to the backend API.
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Attendance Summary</h3>
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-gray-500 font-medium">No recent attendance data.</p>
          <p className="text-sm text-gray-400 mt-1">Attendance records will appear here once marked by teachers.</p>
        </div>
      </Card>
    </div>
  );
}

export default AttendanceTab;
