import React from 'react';
import { Card } from '@/components/common';

function ClassCard({ classData, onView, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">
            {classData.name}
          </h3>
          <p className="text-sm text-secondary-500">Section {classData.section}</p>
        </div>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
          {classData.academicYear}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-secondary-600">
          <span className="font-medium">Teacher:</span> {classData.classTeacher}
        </p>
        <p className="text-sm text-secondary-600">
          <span className="font-medium">Capacity:</span> {classData.capacity} students
        </p>
        <p className="text-sm text-secondary-600">
          <span className="font-medium">Students:</span> {classData.studentCount || 0}
        </p>
      </div>

      {classData.description && (
        <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
          {classData.description}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onView(classData._id)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onEdit(classData._id)}
          className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(classData._id)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}

export default ClassCard;
