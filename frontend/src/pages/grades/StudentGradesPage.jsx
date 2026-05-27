import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStudentGradesQuery } from '@/store/api/gradeApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function StudentGradesPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetStudentGradesQuery(studentId);

  const grades = response?.data || [];

  // Calculate statistics
  const stats = {
    totalSubjects: grades.length,
    averageMarks: grades.length > 0 
      ? Math.round(grades.reduce((sum, g) => sum + (g.marks / g.maxMarks * 100), 0) / grades.length)
      : 0,
    highestGrade: grades.length > 0 ? Math.max(...grades.map(g => parseInt(g.marks))) : 0,
    lowestGrade: grades.length > 0 ? Math.min(...grades.map(g => parseInt(g.marks))) : 0,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Student Grades</h1>
          <p className="text-secondary-600 mt-1">Grade report for student</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-secondary-600">Total Subjects</p>
          <p className="text-3xl font-bold text-primary-600">{stats.totalSubjects}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600">Average Percentage</p>
          <p className="text-3xl font-bold text-blue-600">{stats.averageMarks}%</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600">Highest Marks</p>
          <p className="text-3xl font-bold text-green-600">{stats.highestGrade}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600">Lowest Marks</p>
          <p className="text-3xl font-bold text-orange-600">{stats.lowestGrade}</p>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Grade Details</h3>
        {grades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                    Exam Type
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                    Marks
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => {
                  const percentage = Math.round((grade.marks / grade.maxMarks) * 100);
                  return (
                    <tr key={grade._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="px-4 py-3 font-medium text-secondary-900">
                        {grade.subjectName || grade.subjectId}
                      </td>
                      <td className="px-4 py-3 text-secondary-600">
                        {grade.examType}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-secondary-900">
                        {grade.marks}/{grade.maxMarks}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-secondary-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage >= 80
                                  ? 'bg-green-500'
                                  : percentage >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          grade.grade === 'A+' || grade.grade === 'A'
                            ? 'bg-green-100 text-green-700'
                            : grade.grade === 'B'
                            ? 'bg-blue-100 text-blue-700'
                            : grade.grade === 'C'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-secondary-600 py-8">No grades found for this student</p>
        )}
      </Card>
    </div>
  );
}

export default StudentGradesPage;
