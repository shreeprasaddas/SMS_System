import React, { useState } from 'react';
import { useGetAttendanceReportQuery } from '@/store/api/reportApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function AttendanceReportPage() {
  const [filters, setFilters] = useState({
    classId: '',
    startDate: '',
    endDate: '',
  });

  const { data: response, isLoading } = useGetAttendanceReportQuery(filters);
  const report = response?.data || {};

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-700 bg-green-50';
    if (percentage >= 70) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Attendance Report</h1>
        <p className="text-secondary-600 mt-1">Track student attendance patterns and trends</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Class
            </label>
            <select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              <option value="CLASS_1">Class 1</option>
              <option value="CLASS_10">Class 10</option>
              <option value="CLASS_12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              size="md"
              className="w-full"
            >
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Classes</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {report.totalClasses || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {report.totalStudents || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Avg Attendance</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {report.averageAttendance || 0}%
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Days</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {report.totalDays || 0}
              </p>
            </Card>
          </div>

          {/* Attendance by Class */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Attendance by Class
            </h3>
            {report.attendanceByClass && report.attendanceByClass.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Class
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Total Students
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Present
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Absent
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.attendanceByClass.map((item, idx) => (
                      <tr key={idx} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="px-4 py-3 font-medium text-secondary-900">{item.class}</td>
                        <td className="px-4 py-3 text-center text-secondary-600">{item.totalStudents}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">
                          {item.present}
                        </td>
                        <td className="px-4 py-3 text-center text-red-600 font-semibold">
                          {item.absent}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAttendanceColor(item.percentage)}`}>
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-8">No data available</p>
            )}
          </Card>

          {/* Students with Low Attendance */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Students with Low Attendance (&lt;75%)
            </h3>
            {report.lowAttendanceStudents && report.lowAttendanceStudents.length > 0 ? (
              <div className="space-y-2">
                {report.lowAttendanceStudents.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-900">{student.name}</p>
                      <p className="text-sm text-secondary-600">{student.rollNumber}</p>
                    </div>
                    <span className="text-red-700 font-bold">{student.attendance}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">All students have good attendance</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default AttendanceReportPage;
