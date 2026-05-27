import React from 'react';
import { Card } from '@/components/common/index.js';

function EngagementReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Engagement & Activity</h1>
        <p className="mt-2 text-gray-600">Track student attendance, library usage, and extracurricular participation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Line Chart Placeholder</span>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Participation by Category</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Radar Chart Placeholder</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EngagementReports;
