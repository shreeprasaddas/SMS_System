import React, { useState } from 'react';
import { Card, Button, Table, Input } from '@/components/common/index.js';
import { useGetAlumniQuery } from '@/store/api/alumniApi.js';

function AlumniPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: alumniData, isLoading } = useGetAlumniQuery({ search: searchTerm });

  const columns = [
    { 
      header: 'Name', 
      accessor: (row) => (
        <span className="font-medium text-gray-900">
          {row.user?.firstName} {row.user?.lastName}
        </span>
      ) 
    },
    { header: 'Graduation Year', accessor: 'graduationYear' },
    { header: 'Current Occupation', accessor: 'currentOccupation' },
    { header: 'Company/Institution', accessor: 'companyOrInstitution' },
    { header: 'Email', accessor: (row) => row.user?.email },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="outline">View Profile</Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
          <p className="mt-2 text-gray-600">Maintain the school's alumni network and graduation records.</p>
        </div>
        <Button variant="primary">+ Register Alumni</Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by name, year, or occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading alumni records...</div>
        ) : (
          <Table 
            columns={columns} 
            data={alumniData?.data?.alumni || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default AlumniPage;
