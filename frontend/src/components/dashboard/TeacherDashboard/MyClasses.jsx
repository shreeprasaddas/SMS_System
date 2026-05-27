import React from 'react';
import { useSelector } from 'react-redux';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { Card, Spinner, Badge } from '@/components/common';

function MyClasses() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetClassesQuery({ limit: 10 });

  const classes = data?.data?.classes || data?.data || [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">My Assigned Classes</h3>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load classes</p>
      ) : classes.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No classes assigned yet</p>
      ) : (
        <div className="space-y-4">
          {classes.slice(0, 5).map((cls) => (
            <div key={cls._id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-gray-800">{cls.name || cls.className}</p>
                <p className="text-sm text-gray-500">Section {cls.section || '—'}</p>
              </div>
              <div className="text-right">
                <Badge variant="primary">
                  {cls.studentCount || cls.students?.length || 0} Students
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default MyClasses;
