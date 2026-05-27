import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRoutesQuery, useDeleteRouteMutation } from '@/store/api/transportApi.js';
import { RouteCard, RouteFilters } from '@/components/transport/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function RoutesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    driver: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading } = useGetRoutesQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteRoute] = useDeleteRouteMutation();

  const routes = response?.data?.routes || [];
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

  const handleDriverFilter = (value) => {
    setFilters(prev => ({ ...prev, driver: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', driver: '' });
    setPage(1);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteRoute(routeId).unwrap();
        toast.success('Route deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete route');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Transport Routes</h1>
          <p className="text-secondary-600 mt-1">
            Manage bus routes and schedules ({total} total)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/transport/routes/create')}
        >
          + Add Route
        </Button>
      </div>

      {/* Filters */}
      <RouteFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDriverFilter={handleDriverFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Routes Grid */}
      {!isLoading && routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <RouteCard
              key={route._id}
              routeData={route}
              onEdit={(id) => navigate(`/transport/routes/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && routes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No routes found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/transport/routes/create')}
          >
            Create First Route
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

export default RoutesPage;
