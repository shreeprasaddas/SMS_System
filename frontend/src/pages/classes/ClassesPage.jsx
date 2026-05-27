import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetClassesQuery, useDeleteClassMutation } from '@/store/api/classApi.js';
import { ClassCard, ClassFilters } from '@/components/classes/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function ClassesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    year: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading, error } = useGetClassesQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteClass] = useDeleteClassMutation();

  const classes = response?.data?.classes || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPage(1);
  };

  const handleYearFilter = (value) => {
    setFilters(prev => ({ ...prev, year: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', year: '' });
    setPage(1);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(classId).unwrap();
        toast.success('Class deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete class');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Classes</h1>
          <p className="text-secondary-600 mt-1">
            Manage all classes in the system ({total} total)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/classes/create')}
        >
          + Add New Class
        </Button>
      </div>

      {/* Filters */}
      <ClassFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onYearFilter={handleYearFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Error loading classes. Please try again.
        </div>
      )}

      {/* Classes Grid */}
      {!isLoading && classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem._id}
              classData={classItem}
              onView={(id) => navigate(`/classes/${id}`)}
              onEdit={(id) => navigate(`/classes/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No classes found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/classes/create')}
          >
            Create First Class
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ClassesPage;
