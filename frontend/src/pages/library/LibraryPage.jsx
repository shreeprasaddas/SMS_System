import React, { useState } from 'react';
import { Card, Button, Table, Badge, Input } from '@/components/common/index.js';
import { useGetBooksQuery } from '@/store/api/libraryApi.js';
import { useNavigate } from 'react-router-dom';

function LibraryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: booksData, isLoading } = useGetBooksQuery({ search: searchTerm });

  const columns = [
    { 
      header: 'Book Info', 
      accessor: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.title}</p>
          <p className="text-xs text-gray-500">{row.author}</p>
        </div>
      ) 
    },
    { header: 'ISBN', accessor: 'isbn' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Availability', 
      accessor: (row) => (
        <span className="font-medium">
          {row.availableCopies} / {row.totalCopies}
        </span>
      ) 
    },
    { 
      header: 'Status', 
      accessor: (row) => {
        const isAvailable = row.availableCopies > 0;
        return (
          <Badge variant={isAvailable ? 'success' : 'danger'}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </Badge>
        );
      } 
    },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <Button size="sm" variant="secondary" onClick={() => navigate(`/library/books/${row._id}`)}>
          Manage
        </Button>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="mt-2 text-gray-600">Manage book inventory, categories, and circulation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">View Issues</Button>
          <Button variant="primary">+ Add Book</Button>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading library inventory...</div>
        ) : (
          <Table 
            columns={columns} 
            data={booksData?.data?.books || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default LibraryPage;
