import React from 'react';
import { Card } from '@/components/common';

function TeacherProfileTab({ teacher }) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">First Name</p>
            <p className="text-lg font-medium">{teacher.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Name</p>
            <p className="text-lg font-medium">{teacher.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium">{teacher.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-lg font-medium">{teacher.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employee ID</p>
            <p className="text-lg font-medium">{teacher.employeeId || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="text-lg font-medium">{teacher.department || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Join Date</p>
            <p className="text-lg font-medium">
              {teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Qualification</p>
            <p className="text-lg font-medium">{teacher.qualification || 'N/A'}</p>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-600">Full Address</p>
            <p className="text-lg font-medium">{teacher.address || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TeacherProfileTab;
