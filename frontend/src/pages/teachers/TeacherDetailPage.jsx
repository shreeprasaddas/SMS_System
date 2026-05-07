import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTeacherByIdQuery } from '../../store/api/teacherApi.js';
import { Button, Card, Spinner } from '../../components/common/index.js';

function TeacherDetailPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data, isLoading, error } = useGetTeacherByIdQuery(teacherId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">
          {error?.data?.message || 'Failed to load teacher details'}
        </p>
      </div>
    );
  }

  const teacher = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </h1>
          <p className="text-gray-600 mt-2">{teacher.department}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/teachers/${teacherId}/edit`)}
          >
            Edit
          </Button>
          <Button variant="outline" onClick={() => navigate('/teachers')}>
            Back to List
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          teacher.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {teacher.status || 'ACTIVE'}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="text-lg font-medium">
                  {teacher.dateOfBirth
                    ? new Date(teacher.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-lg font-medium">{teacher.gender || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Qualification</p>
                <p className="text-lg font-medium">{teacher.qualification || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-medium">{teacher.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="text-lg font-medium">{teacher.specialization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-lg font-medium">{teacher.experience || '0'} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="text-lg font-medium">
                  {teacher.joinDate
                    ? new Date(teacher.joinDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="text-lg font-medium">{teacher.employmentType || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Street Address</p>
                <p className="text-lg font-medium">{teacher.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="text-lg font-medium">{teacher.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="text-lg font-medium">{teacher.state || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Postal Code</p>
                <p className="text-lg font-medium">{teacher.postalCode || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Salary & Banking */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Salary & Banking</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Salary</p>
                <p className="text-lg font-medium">₹{teacher.salary || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Account</p>
                <p className="text-lg font-medium">{teacher.bankAccount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank IFSC</p>
                <p className="text-lg font-medium">{teacher.bankIFSC || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full text-center">
                View Classes
              </Button>
              <Button variant="primary" className="w-full text-center">
                View Attendance
              </Button>
              <Button variant="outline" className="w-full text-center">
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailPage;
