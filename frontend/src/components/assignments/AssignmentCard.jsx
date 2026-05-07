import React from 'react';
import { Card } from '../common/index.js';

function AssignmentCard({ assignmentData, onEdit, onDelete, onViewSubmissions }) {
  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-50 text-green-700',
      DRAFT: 'bg-yellow-50 text-yellow-700',
      ARCHIVED: 'bg-gray-50 text-gray-700',
      CLOSED: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-blue-50 text-blue-700';
  };

  const getTypeColor = (type) => {
    const colors = {
      HOMEWORK: 'bg-blue-50 text-blue-700',
      CLASS_WORK: 'bg-purple-50 text-purple-700',
      PROJECT: 'bg-orange-50 text-orange-700',
      QUIZ: 'bg-pink-50 text-pink-700',
      PRACTICAL: 'bg-green-50 text-green-700',
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = new Date(assignmentData.dueDate) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900">{assignmentData.title}</h3>
            <p className="text-sm text-secondary-600 mt-1">{assignmentData.subjectId}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(assignmentData.status)}`}>
              {assignmentData.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(assignmentData.assignmentType)}`}>
              {assignmentData.assignmentType}
            </span>
          </div>
        </div>

        <p className="text-sm text-secondary-600 line-clamp-2">{assignmentData.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">Class</span>
            <span className="font-semibold text-secondary-900">{assignmentData.classId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Due Date</span>
            <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-secondary-900'}`}>
              {formatDate(assignmentData.dueDate)}
              {isOverdue && <span className="ml-2 text-red-600">(Overdue)</span>}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Total Marks</span>
            <span className="font-semibold text-secondary-900">{assignmentData.totalMarks}</span>
          </div>
          {assignmentData.submissionCount && (
            <div className="flex justify-between">
              <span className="text-secondary-600">Submissions</span>
              <span className="font-semibold text-secondary-900">
                {assignmentData.submissionCount}/{assignmentData.studentCount || 0}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onViewSubmissions(assignmentData._id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
          >
            Submissions
          </button>
          <button
            onClick={() => onEdit(assignmentData._id)}
            className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(assignmentData._id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

export default AssignmentCard;
