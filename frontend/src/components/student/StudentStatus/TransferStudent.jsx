import React from 'react';
import { Button, Card } from '@/components/common';

function TransferStudent({ studentId }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Transfer / Suspend</h3>
      <p className="text-sm text-gray-600 mb-4">
        Change the enrollment status of this student.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="TRANSFERRED">Transferred</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DROPPED_OUT">Dropped Out</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
          <textarea 
            rows="3" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Provide a reason..."
          ></textarea>
        </div>
        <Button variant="danger" className="w-full">
          Update Status
        </Button>
      </div>
    </Card>
  );
}

export default TransferStudent;
