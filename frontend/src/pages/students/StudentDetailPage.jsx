import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../../store/api/studentApi.js';
import { Button, Card, Spinner } from '../../components/common/index.js';

function StudentDetailPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { data, isLoading, error } = useGetStudentByIdQuery(studentId);

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
          {error?.data?.message || 'Failed to load student details'}
        </p>
      </div>
    );
  }

  const student = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-600 mt-2">Student Profile</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/students/${studentId}/edit`)}
          >
            Edit
          </Button>
          <Button variant="outline" onClick={() => navigate('/students')}>
            Back to List
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            student.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : student.status === 'INACTIVE'
              ? 'bg-gray-100 text-gray-800'
              : student.status === 'SUSPENDED'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {student.status || 'ACTIVE'}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Street Address</p>
                <p className="text-lg font-medium">{student.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="text-lg font-medium">{student.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="text-lg font-medium">{student.state || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Postal Code</p>
                <p className="text-lg font-medium">{student.postalCode || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Parent Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-600">Parent Name</p>
                <p className="text-lg font-medium">{student.parentName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parent Phone</p>
                <p className="text-lg font-medium">{student.parentPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parent Email</p>
                <p className="text-lg font-medium">{student.parentEmail || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Academic Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="text-lg font-medium">{student.rollNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-medium">{student.classId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admission Date</p>
                <p className="text-lg font-medium">
                  {student.admissionDate
                    ? new Date(student.admissionDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full text-center">
                View Attendance
              </Button>
              <Button variant="primary" className="w-full text-center">
                View Grades
              </Button>
              <Button variant="primary" className="w-full text-center">
                View Fees
              </Button>
              <Button variant="outline" className="w-full text-center">
                Print Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailPage;
