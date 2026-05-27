import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAttendanceQuery } from '@/store/api/attendanceApi.js';
import { Card, Spinner } from '@/components/common';

function MyAttendance() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAttendanceQuery({
    studentId: user?._id,
    limit: 1,
  });

  const stats = data?.data?.stats || {};
  const percentage = stats.percentage || stats.attendancePercentage || null;
  const totalDays = stats.totalDays || stats.total || 0;
  const presentDays = stats.presentDays || stats.present || 0;
  const absentDays = stats.absentDays || stats.absent || 0;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">My Attendance</h3>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : error ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <p className="text-3xl font-bold text-primary-600">—</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Data unavailable</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <p className="text-3xl font-bold text-primary-600">
              {percentage !== null ? `${percentage}%` : '—'}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-gray-500">Total Days: {totalDays}</p>
            <p className="text-sm text-green-600">Present: {presentDays}</p>
            <p className="text-sm text-red-500">Absent: {absentDays}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default MyAttendance;
