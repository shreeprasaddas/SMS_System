import React from 'react';
import { Card } from '@/components/common';

function UpcomingExams() {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
      <div className="space-y-4">
        <div className="flex gap-4 border-l-4 border-primary-500 pl-3 py-1">
          <div>
            <p className="font-semibold text-gray-800">Final Mathematics</p>
            <p className="text-sm text-gray-500">June 15, 2026 - 10:00 AM</p>
          </div>
        </div>
        <div className="flex gap-4 border-l-4 border-yellow-500 pl-3 py-1">
          <div>
            <p className="font-semibold text-gray-800">Physics Lab Practical</p>
            <p className="text-sm text-gray-500">June 18, 2026 - 01:00 PM</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UpcomingExams;
