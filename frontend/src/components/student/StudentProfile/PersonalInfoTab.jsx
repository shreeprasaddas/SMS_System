import React from 'react';
import { Card } from '@/components/common';

function PersonalInfoTab({ student }) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">First Name</p>
            <p className="text-lg font-medium">{student.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Name</p>
            <p className="text-lg font-medium">{student.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-lg font-medium">{student.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="text-lg font-medium">
              {student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="text-lg font-medium">{student.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Group</p>
            <p className="text-lg font-medium">{student.bloodGroup || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Street Address</p>
            <p className="text-lg font-medium">{student.address?.street || (typeof student.address === 'string' ? student.address : 'N/A')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">City</p>
            <p className="text-lg font-medium">{student.address?.city || student.city || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">State</p>
            <p className="text-lg font-medium">{student.address?.state || student.state || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Postal Code</p>
            <p className="text-lg font-medium">{student.address?.postalCode || student.postalCode || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Parent Information */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Parent Name</p>
            <p className="text-lg font-medium">{student.guardians?.[0]?.name || student.parentName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Parent Phone</p>
            <p className="text-lg font-medium">{student.guardians?.[0]?.phone || student.parentPhone || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Parent Email</p>
            <p className="text-lg font-medium">{student.guardians?.[0]?.email || student.parentEmail || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PersonalInfoTab;
