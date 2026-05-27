import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common';

function StudentCard({ student, onEdit, onDelete, onView }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      onDelete(student._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-gray-600">Roll: {student.rollNumber || 'N/A'}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            student.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : student.status === 'INACTIVE'
              ? 'bg-gray-100 text-gray-800'
              : student.status === 'SUSPENDED'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {student.status || 'ACTIVE'}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <p>📧 {student.email}</p>
        <p>📞 {student.phone || 'N/A'}</p>
        <p>🎓 Class {student.class?.name || student.className || student.class || 'N/A'}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onView(student._id)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(student._id)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default StudentCard;
