import React from 'react';
import { Button, Card } from '@/components/common';

function PromoteStudent({ studentId, currentClass }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Promote Student</h3>
      <p className="text-sm text-gray-600 mb-4">
        Current Class: <span className="font-semibold text-gray-900">{currentClass}</span>
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Next Class</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="">-- Select Class --</option>
            <option value="class_2">Class 2</option>
            <option value="class_3">Class 3</option>
            <option value="class_4">Class 4</option>
          </select>
        </div>
        <Button variant="primary" className="w-full">
          Promote to Next Class
        </Button>
      </div>
    </Card>
  );
}

export default PromoteStudent;
