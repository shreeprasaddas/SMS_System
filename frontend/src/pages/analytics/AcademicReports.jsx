import React from 'react';
import { Card } from '@/components/common/index.js';

function AcademicReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academic Analytics</h1>
        <p className="mt-2 text-gray-600">Analyze student performance and grading distributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pass Percentage by Class</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Bar Chart Placeholder</span>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Pie Chart Placeholder</span>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sarah Jenkins</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Class 10 A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">4.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AcademicReports;
