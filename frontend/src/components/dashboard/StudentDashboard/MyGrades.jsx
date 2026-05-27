import React from 'react';
import { useSelector } from 'react-redux';
import { useGetGradesQuery } from '@/store/api/gradeApi.js';
import { Card, Spinner } from '@/components/common';

function MyGrades() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetGradesQuery({
    studentId: user?._id,
    limit: 5,
  });

  const grades = data?.data?.grades || data?.data || [];

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return 'bg-green-100 text-green-800';
    if (g.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (g.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Recent Grades</h3>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : error ? (
        <p className="text-gray-400 text-sm text-center py-4">Unable to load grades</p>
      ) : grades.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No grades available yet</p>
      ) : (
        <div className="space-y-4">
          {grades.map((grade, idx) => (
            <div key={grade._id || idx} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  {grade.subjectName || grade.subject?.name || 'Subject'}
                </p>
                <p className="text-xs text-gray-500">
                  {grade.examName || grade.exam?.name || 'Assessment'}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-md font-semibold text-sm ${getGradeColor(grade.grade || grade.letterGrade)}`}>
                {grade.grade || grade.letterGrade || `${grade.marks || grade.score || 0}%`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default MyGrades;
