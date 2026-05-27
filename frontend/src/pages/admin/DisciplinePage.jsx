import React, { useState } from 'react';
import { Card, Button, Table, Badge, Input } from '@/components/common/index.js';
import { useGetIncidentsQuery } from '@/store/api/disciplineApi.js';

function DisciplinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: incidentsData, isLoading } = useGetIncidentsQuery({ 
    search: searchTerm 
  });

  const columns = [
    { header: 'Date', accessor: (row) => new Date(row.incidentDate).toLocaleDateString() },
    { 
      header: 'Student', 
      accessor: (row) => (
        <span className="font-medium text-gray-900">
          {row.student?.firstName} {row.student?.lastName}
        </span>
      ) 
    },
    { header: 'Type', accessor: 'incidentType' },
    { 
      header: 'Reported By', 
      accessor: (row) => row.reportedBy ? `${row.reportedBy.firstName} ${row.reportedBy.lastName}` : 'N/A' 
    },
    { 
      header: 'Severity', 
      accessor: (row) => {
        let variant = 'secondary';
        if (row.severity === 'MINOR') variant = 'info';
        if (row.severity === 'MODERATE') variant = 'warning';
        if (row.severity === 'SEVERE') variant = 'danger';
        return <Badge variant={variant}>{row.severity}</Badge>;
      } 
    },
    { 
      header: 'Status', 
      accessor: (row) => (
        <Badge variant={row.status === 'RESOLVED' ? 'success' : 'secondary'}>{row.status}</Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="outline">Review</Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discipline Management</h1>
          <p className="mt-2 text-gray-600">Track and manage student disciplinary incidents and actions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">View Actions</Button>
          <Button variant="primary">+ Report Incident</Button>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by student name or incident..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading incidents...</div>
        ) : (
          <Table 
            columns={columns} 
            data={incidentsData?.data?.incidents || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default DisciplinePage;
