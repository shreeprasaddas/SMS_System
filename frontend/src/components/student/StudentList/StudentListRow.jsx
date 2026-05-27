import React from 'react';
import { Avatar, StatusBadge, Button } from '@/components/common';

function StudentListRow({ student, onEdit, onDelete, onView }) {
  if (!student) return null;

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar src={student.profileImage} name={`${student.firstName} ${student.lastName}`} size="sm" />
          <div>
            <div className="text-sm font-semibold text-secondary-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-xs text-secondary-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
        {student.rollNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
        {student.classId || 'Unassigned'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge variant={student.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {student.status || 'Active'}
        </StatusBadge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView?.(student)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(student)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(student)}>Delete</Button>
        </div>
      </td>
    </>
  );
}

export default StudentListRow;
