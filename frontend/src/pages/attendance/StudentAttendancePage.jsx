import React, { useState } from 'react';
import { useGetStudentAttendanceQuery } from '../../store/api/attendanceApi.js';
import { Spinner, Card } from '../../components/common/index.js';

function StudentAttendancePage() {
  const [studentId, setStudentId] = useState('');
  const { data, isLoading } = useGetStudentAttendanceQuery({ studentId }, { skip: !studentId });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Attendance History</h1>

      <Card>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
        />

        {!studentId ? (
          <p className="text-gray-600">Enter a student ID to view attendance</p>
        ) : isLoading ? (
          <Spinner size="lg" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((record, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        record.status === 'PRESENT'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.remarks || '-'}</td>
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

export default StudentAttendancePage;
