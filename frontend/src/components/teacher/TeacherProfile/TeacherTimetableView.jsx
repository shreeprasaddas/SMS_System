import React from 'react';
import { Card } from '@/components/common';

function TeacherTimetableView({ teacher }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Weekly Timetable</h3>
          <button className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 font-medium">
            Print Schedule
          </button>
        </div>
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Timetable data integration pending.</p>
        </div>
      </Card>
    </div>
  );
}

export default TeacherTimetableView;
