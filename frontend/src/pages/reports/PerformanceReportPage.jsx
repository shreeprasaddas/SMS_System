import React, { useState } from 'react';
import { useGetPerformanceReportQuery } from '@/store/api/reportApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function PerformanceReportPage() {
  const [filters, setFilters] = useState({
    classId: '',
    examType: 'FINAL',
  });

  const { data: response, isLoading } = useGetPerformanceReportQuery(filters);
  const report = response?.data || {};

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-700 bg-green-50',
      'A': 'text-green-600 bg-green-50',
      'B': 'text-blue-600 bg-blue-50',
      'C': 'text-yellow-600 bg-yellow-50',
      'D': 'text-orange-600 bg-orange-50',
      'F': 'text-red-600 bg-red-50',
    };
    return gradeColors[grade] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Performance Report</h1>
        <p className="text-secondary-600 mt-1">
          Analyze student academic performance and grades across exams
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Exam Type
            </label>
            <select
              value={filters.examType}
              onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="MID_TERM">Mid Term</option>
              <option value="FINAL">Final</option>
            </select>
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
          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {report.totalStudents || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Average Percentage</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {report.averagePercentage || 0}%
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Pass Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {report.passRate || 0}%
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Fail Rate</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {report.failRate || 0}%
              </p>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">
              Grade Distribution
            </h3>
            {report.gradeDistribution ? (
              <div className="space-y-4">
                {Object.entries(report.gradeDistribution).map(([grade, count]) => {
                  const percentage = report.totalStudents > 0 
                    ? Math.round((count / report.totalStudents) * 100)
                    : 0;
                  return (
                    <div key={grade}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-secondary-900">Grade {grade}</span>
                        <span className="text-sm text-secondary-600">{count} students ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            grade === 'A+' || grade === 'A'
                              ? 'bg-green-500'
                              : grade === 'B'
                              ? 'bg-blue-500'
                              : grade === 'C'
                              ? 'bg-yellow-500'
                              : grade === 'D'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No data available</p>
            )}
          </Card>

          {/* Top Performers */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performers</h3>
            {report.topPerformers && report.topPerformers.length > 0 ? (
              <div className="space-y-2">
                {report.topPerformers.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-900">
                        {idx + 1}. {student.name}
                      </p>
                      <p className="text-sm text-secondary-600">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </span>
                      <p className="text-sm text-secondary-600 mt-1">{student.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No data available</p>
            )}
          </Card>

          {/* Students Needing Support */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Students Needing Support (&lt;60%)
            </h3>
            {report.strugglingStudents && report.strugglingStudents.length > 0 ? (
              <div className="space-y-2">
                {report.strugglingStudents.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-900">
                        {idx + 1}. {student.name}
                      </p>
                      <p className="text-sm text-secondary-600">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </span>
                      <p className="text-sm text-secondary-600 mt-1">{student.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">All students are performing well</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default PerformanceReportPage;
