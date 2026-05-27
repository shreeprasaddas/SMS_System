import React from 'react';
import { Card } from '@/components/common';

function TeacherSubjects({ teacher }) {
  // Use assigned subjects from the teacher object, or a placeholder if empty
  const subjects = teacher?.subjects || [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assigned Subjects</h3>
          <button className="text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-md hover:bg-primary-100 font-medium">
            Manage Subjects
          </button>
        </div>
        {subjects.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No subjects assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Hours</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default TeacherSubjects;
