import React, { useState } from 'react';
import { Card, Button, Input, Table, Badge } from '@/components/common/index.js';
import { useGetStaffQuery } from '@/store/api/hrApi.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function StaffPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch staff with the hrApi
  const { data: staffData, isLoading } = useGetStaffQuery({ search: searchTerm });

  const columns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { 
      header: 'Name', 
      accessor: (row) => (
        <div className="font-medium text-gray-900">
          {row.user?.firstName} {row.user?.lastName}
        </div>
      )
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { 
      header: 'Status', 
      accessor: (row) => (
        <Badge variant={row.employmentStatus === 'ACTIVE' ? 'success' : 'danger'}>
          {row.employmentStatus}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate(`/hr/staff/${row._id}`)}
        >
          View Profile
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
          <p className="mt-2 text-gray-600">Manage all non-teaching and administrative staff.</p>
        </div>
        <Button onClick={() => toast('Registration moved to Admin Panel')} variant="primary">
          + Register Staff
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by name, ID or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading staff records...</div>
        ) : (
          <Table 
            columns={columns} 
            data={staffData?.data?.staff || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default StaffPage;
