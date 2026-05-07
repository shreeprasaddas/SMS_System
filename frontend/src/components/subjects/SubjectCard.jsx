import React from 'react';
import { Card } from '../common/index.js';

function SubjectCard({ subjectData, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">{subjectData.name}</h3>
          <p className="text-sm text-secondary-600 mt-1">{subjectData.code}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">Credit Hours</span>
            <span className="font-semibold text-secondary-900">{subjectData.creditHours}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Maximum Marks</span>
            <span className="font-semibold text-secondary-900">{subjectData.maxMarks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Department</span>
            <span className="font-semibold text-secondary-900">{subjectData.departmentId || 'N/A'}</span>
          </div>
        </div>

        {subjectData.description && (
          <div className="p-3 bg-secondary-50 rounded-lg">
            <p className="text-xs font-medium text-secondary-600 mb-1">Description</p>
            <p className="text-sm text-secondary-700 line-clamp-2">{subjectData.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(subjectData._id)}
            className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(subjectData._id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

export default SubjectCard;
