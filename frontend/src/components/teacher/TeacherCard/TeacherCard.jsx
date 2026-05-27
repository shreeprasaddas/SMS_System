import React from 'react';
import clsx from 'clsx';
import { Avatar, StatusBadge } from '@/components/common';

function TeacherCard({ teacher, onClick, className = '' }) {
  if (!teacher) return null;
  return (
    <div
      onClick={() => onClick?.(teacher)}
      className={clsx(
        'bg-white rounded-xl border border-secondary-200 p-5 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar
          src={teacher.profileImage}
          name={`${teacher.firstName} ${teacher.lastName}`}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 truncate">
            {teacher.firstName} {teacher.lastName}
          </h3>
          <p className="text-sm text-secondary-500">{teacher.designation || 'Teacher'}</p>
          <p className="text-sm text-secondary-500 truncate">{teacher.email}</p>
        </div>
        <StatusBadge variant={teacher.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {teacher.status || 'Active'}
        </StatusBadge>
      </div>
      <div className="mt-4 pt-4 border-t border-secondary-100 grid grid-cols-2 gap-2 text-xs text-secondary-500">
        <span>Qualification: {teacher.qualification || 'N/A'}</span>
        <span>Phone: {teacher.phone || 'N/A'}</span>
      </div>
    </div>
  );
}

export default TeacherCard;
