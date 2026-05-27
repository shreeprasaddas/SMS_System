import React from 'react';
import clsx from 'clsx';
import { Avatar, StatusBadge } from '@/components/common';
import { formatDate } from '@/utils/formatters.js';

function StudentCard({ student, onClick, className = '' }) {
  if (!student) return null;
  return (
    <div
      onClick={() => onClick?.(student)}
      className={clsx(
        'bg-white rounded-xl border border-secondary-200 p-5 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar
          src={student.profileImage}
          name={`${student.firstName} ${student.lastName}`}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 truncate">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-secondary-500">Roll: {student.rollNumber}</p>
          <p className="text-sm text-secondary-500">{student.classId || 'No Class'}</p>
        </div>
        <StatusBadge variant={student.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {student.status || 'Active'}
        </StatusBadge>
      </div>
      <div className="mt-4 pt-4 border-t border-secondary-100 grid grid-cols-2 gap-2 text-xs text-secondary-500">
        <span>DOB: {student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}</span>
        <span>Gender: {student.gender || 'N/A'}</span>
      </div>
    </div>
  );
}

export default StudentCard;
