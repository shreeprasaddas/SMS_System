import React from 'react';
import { Card, Spinner } from '@/components/common';
import { useGetAssignmentsQuery } from '@/store/api/assignmentApi.js';

function AcademicTab({ student }) {
  const classId = student?.class?._id || student?.classId;
  const { data: assignmentsData, isLoading } = useGetAssignmentsQuery(
    { class: classId, limit: 5, status: 'PUBLISHED' },
    { skip: !classId }
  );
  
  const assignments = assignmentsData?.data?.assignments || assignmentsData?.data || [];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Academic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Roll Number</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">{student.rollNumber || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Class</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">{student.class?.name || student.className || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Admission Date</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Assignments</h3>
        {isLoading ? (
          <div className="flex justify-center py-4"><Spinner size="sm" /></div>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No recent assignments found.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.subject?.name || item.subjectName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default AcademicTab;
