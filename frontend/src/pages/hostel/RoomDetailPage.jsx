import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Table } from '@/components/common/index.js';
import { useGetAllocationsQuery } from '@/store/api/hostelApi.js';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // Assuming the API allows filtering allocations by room
  const { data: allocationsData, isLoading } = useGetAllocationsQuery({ roomId });

  const columns = [
    { 
      header: 'Student Name', 
      accessor: (row) => (
        <span className="font-medium text-gray-900">
          {row.student?.user?.firstName} {row.student?.user?.lastName}
        </span>
      ) 
    },
    { header: 'Admission No.', accessor: (row) => row.student?.admissionNumber },
    { header: 'Date Allocated', accessor: (row) => new Date(row.allocationDate).toLocaleDateString() },
    { 
      header: 'Status', 
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'secondary'}>{row.status}</Badge>
      ) 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button size="sm" variant="danger">Evict</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Details</h1>
          <p className="text-gray-500">Manage occupants for this room</p>
        </div>
        <div className="ml-auto">
          <Button variant="primary">+ Allocate Student</Button>
        </div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Current Occupants</h2>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading allocations...</div>
        ) : (
          <Table 
            columns={columns} 
            data={allocationsData?.data?.allocations || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default RoomDetailPage;
