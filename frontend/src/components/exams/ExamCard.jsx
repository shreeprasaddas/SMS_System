import React from 'react';
import { Card } from '@/components/common';

function ExamCard({ examData, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-50 text-blue-700',
      ONGOING: 'bg-yellow-50 text-yellow-700',
      COMPLETED: 'bg-green-50 text-green-700',
      CANCELLED: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">{examData.name}</h3>
            <p className="text-sm text-secondary-600 mt-1">{examData.subjectId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(examData.status)}`}>
            {examData.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">Date</span>
            <span className="font-semibold text-secondary-900">
              {formatDate(examData.examDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Time</span>
            <span className="font-semibold text-secondary-900">
              {examData.startTime} - {examData.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Duration</span>
            <span className="font-semibold text-secondary-900">
              {examData.duration} min
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Marks</span>
            <span className="font-semibold text-secondary-900">
              {examData.totalMarks} ({examData.passingMarks} to pass)
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(examData._id)}
            className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(examData._id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ExamCard;
