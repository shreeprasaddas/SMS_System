import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/common/index.js';
import { useGetApplicationByIdQuery, useUpdateApplicationMutation } from '@/store/api/admissionApi.js';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetApplicationByIdQuery(applicationId);
  const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();

  if (isLoading) return <div className="p-8 text-center">Loading application...</div>;
  if (error || !response?.data) return <div className="p-8 text-center text-red-500">Error loading application</div>;

  const app = response.data;
  const student = app.studentDetails || {};
  const parent = app.parentDetails || {};

  const handleStatusUpdate = async (status) => {
    try {
      await updateApplication({ id: applicationId, status }).unwrap();
      toast.success(`Application marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application: {app.applicationNumber}</h1>
          <p className="text-gray-500">Submitted on {new Date(app.submissionDate).toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant={app.status === 'ACCEPTED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'}>
            {app.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Student Details</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium text-gray-900">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium text-gray-900">{student.bloodGroup}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Parent / Guardian Details</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Primary Contact Name</p>
                <p className="font-medium text-gray-900">{parent.fatherName || parent.motherName || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{parent.primaryContactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{parent.email || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Academic Context</h3>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">Applied Class</p>
                <p className="font-medium text-gray-900">{app.appliedClass?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Year</p>
                <p className="font-medium text-gray-900">{app.academicYear?.year || 'N/A'}</p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3 border-t pt-4">Decisions</h3>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full"
                loading={isUpdating}
                disabled={app.status === 'ACCEPTED'}
                onClick={() => handleStatusUpdate('ACCEPTED')}
              >
                Approve Application
              </Button>
              <Button 
                variant="danger" 
                className="w-full"
                loading={isUpdating}
                disabled={app.status === 'REJECTED'}
                onClick={() => handleStatusUpdate('REJECTED')}
              >
                Reject Application
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                loading={isUpdating}
                disabled={app.status === 'UNDER_REVIEW'}
                onClick={() => handleStatusUpdate('UNDER_REVIEW')}
              >
                Mark as Under Review
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;
