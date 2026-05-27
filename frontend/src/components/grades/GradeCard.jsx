import React from 'react';
import { Card } from '@/components/common';

function GradeCard({ gradeData, onEdit, onDelete }) {
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

  const percentage = gradeData.maxMarks 
    ? Math.round((gradeData.marks / gradeData.maxMarks) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">
            {gradeData.studentName || gradeData.studentId}
          </h3>
          <p className="text-sm text-secondary-500">{gradeData.subjectName || gradeData.subjectId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(gradeData.grade)}`}>
          {gradeData.grade}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary-600">Marks</span>
          <span className="font-semibold text-secondary-900">
            {gradeData.marks}/{gradeData.maxMarks}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage >= 80
                ? 'bg-green-500'
                : percentage >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Percentage</span>
          <span className="font-semibold text-secondary-900">{percentage}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary-600">Exam Type</span>
          <span className="font-medium text-secondary-900">{gradeData.examType}</span>
        </div>
      </div>

      {gradeData.feedback && (
        <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
          <p className="text-xs font-medium text-secondary-600 mb-1">Feedback</p>
          <p className="text-sm text-secondary-700 line-clamp-2">{gradeData.feedback}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(gradeData._id)}
          className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(gradeData._id)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}

export default GradeCard;
