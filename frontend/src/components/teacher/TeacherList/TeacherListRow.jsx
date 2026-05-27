import React from 'react';
import { Avatar, StatusBadge, Button } from '@/components/common';

function TeacherListRow({ teacher, onEdit, onDelete, onView }) {
  if (!teacher) return null;

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar src={teacher.profileImage} name={`${teacher.firstName} ${teacher.lastName}`} size="sm" />
          <div>
            <div className="text-sm font-semibold text-secondary-900">
              {teacher.firstName} {teacher.lastName}
            </div>
            <div className="text-xs text-secondary-500">{teacher.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
        {teacher.designation || 'Teacher'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
        {teacher.phone || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge variant={teacher.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {teacher.status || 'Active'}
        </StatusBadge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView?.(teacher)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(teacher)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(teacher)}>Delete</Button>
        </div>
      </td>
    </>
  );
}

export default TeacherListRow;
