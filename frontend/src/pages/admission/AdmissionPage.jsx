import React, { useState } from 'react';
import { Card, Button, Table, Badge, Input } from '@/components/common/index.js';
import { useGetApplicationsQuery } from '@/store/api/admissionApi.js';
import { useNavigate } from 'react-router-dom';

function AdmissionPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: applicationsData, isLoading } = useGetApplicationsQuery({ 
    search: searchTerm,
    status: statusFilter
  });

  const columns = [
    { header: 'App. ID', accessor: 'applicationNumber' },
    { 
      header: 'Student Name', 
      accessor: (row) => (
        <div className="font-medium text-gray-900">
          {row.studentDetails?.firstName} {row.studentDetails?.lastName}
        </div>
      ) 
    },
    { header: 'Applied Class', accessor: (row) => row.appliedClass?.name || 'N/A' },
    { header: 'Submission Date', accessor: (row) => new Date(row.submissionDate).toLocaleDateString() },
    { 
      header: 'Status', 
      accessor: (row) => {
        let variant = 'secondary';
        if (row.status === 'SUBMITTED') variant = 'primary';
        if (row.status === 'UNDER_REVIEW') variant = 'warning';
        if (row.status === 'ACCEPTED') variant = 'success';
        if (row.status === 'REJECTED') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      } 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="secondary" onClick={() => navigate(`/admissions/${row._id}`)}>
          Review
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admissions Processing</h1>
          <p className="mt-2 text-gray-600">Review and process new student applications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Admission Cycles</Button>
          <Button variant="primary">+ Open New Application</Button>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <Input
              placeholder="Search by name or App ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading applications...</div>
        ) : (
          <Table 
            columns={columns} 
            data={applicationsData?.data?.applications || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default AdmissionPage;
