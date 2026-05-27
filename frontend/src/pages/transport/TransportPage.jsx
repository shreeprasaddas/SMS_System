import React from 'react';
import { Card, Button, Table, Badge } from '@/components/common/index.js';
import { useGetVehiclesQuery } from '@/store/api/transportApi.js';

function TransportPage() {
  const { data: vehiclesData, isLoading } = useGetVehiclesQuery();

  const columns = [
    { header: 'Vehicle Number', accessor: 'vehicleNumber' },
    { header: 'Type', accessor: 'type' },
    { header: 'Capacity', accessor: 'capacity' },
    { 
      header: 'Driver', 
      accessor: (row) => row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : 'Unassigned' 
    },
    { 
      header: 'Status', 
      accessor: (row) => {
        let variant = 'success';
        if (row.status === 'MAINTENANCE') variant = 'warning';
        if (row.status === 'OUT_OF_SERVICE') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      } 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="secondary">View Details</Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Fleet Management</h1>
          <p className="mt-2 text-gray-600">Manage school vehicles, drivers, and maintenance records.</p>
        </div>
        <Button variant="primary">+ Add Vehicle</Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Vehicle Roster</h2>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading vehicles...</div>
        ) : (
          <Table 
            columns={columns} 
            data={vehiclesData?.data?.vehicles || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default TransportPage;
