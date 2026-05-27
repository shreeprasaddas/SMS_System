import React, { useState } from 'react';
import { useGetAttendanceReportQuery } from '@/store/api/attendanceApi.js';
import { Spinner, Card } from '@/components/common/index.js';

function AttendanceReportPage() {
  const [filters, setFilters] = useState({ classId: '', startDate: '', endDate: '' });
  const { data, isLoading } = useGetAttendanceReportQuery(filters);

  const report = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Report</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Classes</option>
            <option value="class_001">Class 1</option>
            <option value="class_002">Class 2</option>
            <option value="class_003">Class 3</option>
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Class</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Present</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Absent</th>
                  <th className="px-4 py-2 text-left font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{row.className}</td>
                    <td className="px-4 py-3">{row.totalPresent}</td>
                    <td className="px-4 py-3">{row.totalAbsent}</td>
                    <td className="px-4 py-3">{row.percentage}%</td>
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

export default AttendanceReportPage;
