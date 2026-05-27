import React, { useState } from 'react';
import { Card, Button, Badge, Table } from '@/components/common/index.js';
import { useGetLeaveApplicationsQuery, useApproveLeaveMutation, useRejectLeaveMutation } from '@/store/api/hrApi.js';
import toast from 'react-hot-toast';

function LeaveManagementPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { data: leaveData, isLoading, refetch } = useGetLeaveApplicationsQuery({ status: statusFilter });
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const handleApprove = async (id) => {
    try {
      await approveLeave({ applicationId: id, remarks: 'Approved by HR' }).unwrap();
      toast.success('Leave approved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave({ applicationId: id, remarks: 'Rejected by HR' }).unwrap();
      toast.success('Leave rejected');
      refetch();
    } catch (error) {
      toast.error('Failed to reject leave');
    }
  };

  const columns = [
    { 
      header: 'Applicant', 
      accessor: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.applicant?.firstName} {row.applicant?.lastName}</p>
          <p className="text-xs text-gray-500">{row.applicantType}</p>
        </div>
      )
    },
    { 
      header: 'Leave Type', 
      accessor: (row) => <span className="font-medium">{row.leaveType?.name || 'Standard'}</span> 
    },
    { 
      header: 'Duration', 
      accessor: (row) => (
        <span className="text-sm">
          {new Date(row.startDate).toLocaleDateString()} to {new Date(row.endDate).toLocaleDateString()}
        </span>
      )
    },
    { header: 'Reason', accessor: 'reason' },
    { 
      header: 'Status', 
      accessor: (row) => {
        let variant = 'warning';
        if (row.status === 'APPROVED') variant = 'success';
        if (row.status === 'REJECTED') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status === 'PENDING' && (
            <>
              <Button size="sm" variant="primary" onClick={() => handleApprove(row._id)}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => handleReject(row._id)}>Reject</Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="mt-2 text-gray-600">Review and process staff and teacher leave applications.</p>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === 'ALL' ? '' : status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (statusFilter === status) || (status === 'ALL' && statusFilter === '')
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading leave requests...</div>
        ) : (
          <Table 
            columns={columns} 
            data={leaveData?.data?.applications || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default LeaveManagementPage;
