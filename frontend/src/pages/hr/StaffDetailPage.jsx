import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/common/index.js';
import { useGetStaffByIdQuery } from '@/store/api/hrApi.js';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function StaffDetailPage() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetStaffByIdQuery(staffId);

  if (isLoading) return <div className="p-8 text-center">Loading staff details...</div>;
  if (error || !response?.data) return <div className="p-8 text-center text-red-500">Error loading staff details</div>;

  const staff = response.data;
  const user = staff.user || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500">Employee ID: {staff.employeeId}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant={staff.employmentStatus === 'ACTIVE' ? 'success' : 'danger'}>
            {staff.employmentStatus}
          </Badge>
          <Button variant="secondary">Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Professional Information</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{staff.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium text-gray-900">{staff.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <p className="font-medium text-gray-900">{new Date(staff.joiningDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-gray-900">{staff.qualification}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2 flex flex-col">
              <Button variant="outline" className="w-full text-left justify-start">View Payslips</Button>
              <Button variant="outline" className="w-full text-left justify-start">Leave History</Button>
              <Button variant="outline" className="w-full text-left justify-start">Performance Appraisals</Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Leave Balance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Casual Leave</span>
                <span className="font-medium">12 / 15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sick Leave</span>
                <span className="font-medium">8 / 10</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StaffDetailPage;
