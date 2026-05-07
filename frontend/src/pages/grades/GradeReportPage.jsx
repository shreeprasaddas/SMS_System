import React, { useState } from 'react';
import { useGetGradeReportQuery } from '../../store/api/gradeApi.js';
import { Card, Spinner } from '../../components/common/index.js';

function GradeReportPage() {
  const [filters, setFilters] = useState({
    classId: '',
    examType: 'MID_TERM',
  });

  const { data: response, isLoading } = useGetGradeReportQuery(filters);
  const report = response?.data || {};

  const gradeDistribution = report.gradeDistribution || {
    'A+': 0,
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'F': 0,
  };

  const totalStudents = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Grade Report</h1>
        <p className="text-secondary-600 mt-1">Analysis of grades across classes</p>
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
              <option value="ASSIGNMENT">Assignment</option>
              <option value="PROJECT">Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              &nbsp;
            </label>
            <button className="w-full px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium transition-colors">
              Generate Report
            </button>
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
              <p className="text-sm text-secondary-600">Total Students</p>
              <p className="text-3xl font-bold text-primary-600">{totalStudents}</p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600">Average Percentage</p>
              <p className="text-3xl font-bold text-blue-600">{report.averagePercentage || 0}%</p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600">Pass Rate</p>
              <p className="text-3xl font-bold text-green-600">{report.passRate || 0}%</p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600">Fail Rate</p>
              <p className="text-3xl font-bold text-red-600">{report.failRate || 0}%</p>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Grade Distribution</h3>
            <div className="space-y-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => {
                const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
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
          </Card>

          {/* Top Performers */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performers</h3>
            {report.topPerformers && report.topPerformers.length > 0 ? (
              <div className="space-y-2">
                {report.topPerformers.map((student, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-secondary-900">{index + 1}. {student.name}</span>
                    <span className="text-green-700 font-bold">{student.averagePercentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No data available</p>
            )}
          </Card>

          {/* Students Needing Support */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Students Needing Support</h3>
            {report.strugglingStudents && report.strugglingStudents.length > 0 ? (
              <div className="space-y-2">
                {report.strugglingStudents.map((student, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-secondary-900">{index + 1}. {student.name}</span>
                    <span className="text-red-700 font-bold">{student.averagePercentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No data available</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default GradeReportPage;
