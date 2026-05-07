import React from 'react';
import { Button } from '../common/index.js';

function TeacherCard({ teacher, onEdit, onDelete, onView }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      onDelete(teacher._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </h3>
          <p className="text-sm text-gray-600">{teacher.department || 'Department'}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            teacher.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {teacher.status || 'ACTIVE'}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <p>📧 {teacher.email}</p>
        <p>📞 {teacher.phone || 'N/A'}</p>
        <p>🎓 {teacher.qualification || 'N/A'}</p>
        <p>⏱️ {teacher.experience || '0'} years exp.</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onView(teacher._id)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(teacher._id)}
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

export default TeacherCard;
