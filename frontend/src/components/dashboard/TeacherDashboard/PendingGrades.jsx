import React from 'react';
import { useGetAssignmentsQuery } from '@/store/api/assignmentApi.js';
import { Card, Spinner, Badge } from '@/components/common';

function PendingGrades() {
  const { data, isLoading, error } = useGetAssignmentsQuery({ status: 'PUBLISHED', limit: 5 });
  const grades = data?.data?.assignments || data?.data || [];
  const pendingCount = grades.length;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Pending Grades</h3>
        <Badge variant={pendingCount > 0 ? 'danger' : 'success'}>
          {isLoading ? '...' : `${pendingCount} Tasks`}
        </Badge>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load pending grades</p>
      ) : grades.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-2xl mb-1">✅</p>
          <p className="text-gray-400 text-sm">All grades are up to date!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((item, idx) => (
            <div key={item._id || idx} className="flex gap-4 border-l-4 border-red-500 pl-3 py-1">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {item.title || item.assignmentName || 'Assignment'}
                </p>
                <p className="text-xs text-gray-500">
                  {item.class?.name || item.className || 'Unknown'} - {item.subject?.name || item.subjectName || ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-red-600">
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default PendingGrades;
