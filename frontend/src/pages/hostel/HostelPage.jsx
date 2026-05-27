import React, { useState } from 'react';
import { Card, Button, Table, Badge } from '@/components/common/index.js';
import { useGetHostelsQuery, useGetRoomsQuery } from '@/store/api/hostelApi.js';
import { useNavigate } from 'react-router-dom';

function HostelPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hostels'); // 'hostels' or 'rooms'

  const { data: hostelsData, isLoading: isLoadingHostels } = useGetHostelsQuery();
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery(
    {}, 
    { skip: activeTab !== 'rooms' }
  );

  const hostelColumns = [
    { header: 'Hostel Name', accessor: 'name' },
    { header: 'Type', accessor: (row) => <Badge variant={row.type === 'BOYS' ? 'primary' : 'secondary'}>{row.type}</Badge> },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Warden', accessor: (row) => row.warden ? `${row.warden.firstName} ${row.warden.lastName}` : 'Unassigned' },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="outline">Manage Rooms</Button>
      ) 
    }
  ];

  const roomColumns = [
    { header: 'Room Number', accessor: 'roomNumber' },
    { header: 'Hostel', accessor: (row) => row.hostel?.name },
    { header: 'Type', accessor: 'roomType' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Occupancy', accessor: 'currentOccupancy' },
    { 
      header: 'Status', 
      accessor: (row) => (
        <Badge variant={row.currentOccupancy >= row.capacity ? 'danger' : 'success'}>
          {row.currentOccupancy >= row.capacity ? 'Full' : 'Available'}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="secondary" onClick={() => navigate(`/hostels/rooms/${row._id}`)}>
          View Occupants
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="mt-2 text-gray-600">Manage boarding houses, rooms, and student allocations.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'hostels' ? (
             <Button variant="primary">+ Add Hostel</Button>
          ) : (
             <Button variant="primary">+ Add Room</Button>
          )}
        </div>
      </div>

      <Card>
        <div className="mb-6 flex gap-4 border-b pb-4">
          <button
            onClick={() => setActiveTab('hostels')}
            className={`font-medium pb-2 -mb-4 ${activeTab === 'hostels' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          >
            Hostels
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`font-medium pb-2 -mb-4 ${activeTab === 'rooms' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          >
            Rooms
          </button>
        </div>

        {activeTab === 'hostels' ? (
          isLoadingHostels ? (
            <div className="py-8 text-center text-gray-500">Loading hostels...</div>
          ) : (
            <Table 
              columns={hostelColumns} 
              data={hostelsData?.data?.hostels || []} 
              keyExtractor={(item) => item._id}
            />
          )
        ) : (
          isLoadingRooms ? (
            <div className="py-8 text-center text-gray-500">Loading rooms...</div>
          ) : (
            <Table 
              columns={roomColumns} 
              data={roomsData?.data?.rooms || []} 
              keyExtractor={(item) => item._id}
            />
          )
        )}
      </Card>
    </div>
  );
}

export default HostelPage;
