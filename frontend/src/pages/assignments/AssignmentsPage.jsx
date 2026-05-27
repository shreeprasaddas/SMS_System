import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAssignmentsQuery, useDeleteAssignmentMutation } from '@/store/api/assignmentApi.js';
import { AssignmentCard, AssignmentFilters } from '@/components/assignments/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function AssignmentsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    subject: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading } = useGetAssignmentsQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteAssignment] = useDeleteAssignmentMutation();

  const assignments = response?.data?.assignments || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleClassFilter = (value) => {
    setFilters(prev => ({ ...prev, class: value }));
    setPage(1);
  };

  const handleSubjectFilter = (value) => {
    setFilters(prev => ({ ...prev, subject: value }));
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', class: '', subject: '', status: '' });
    setPage(1);
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId).unwrap();
        toast.success('Assignment deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete assignment');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Assignments</h1>
          <p className="text-secondary-600 mt-1">
            Manage assignments and track submissions ({total} total)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/assignments/create')}
        >
          + Create Assignment
        </Button>
      </div>

      {/* Filters */}
      <AssignmentFilters
        onSearch={handleSearch}
        onClassFilter={handleClassFilter}
        onSubjectFilter={handleSubjectFilter}
        onStatusFilter={handleStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Assignments Grid */}
      {!isLoading && assignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignmentData={assignment}
              onEdit={(id) => navigate(`/assignments/${id}/edit`)}
              onDelete={handleDelete}
              onViewSubmissions={(id) => navigate(`/assignments/${id}/submissions`)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && assignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No assignments found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/assignments/create')}
          >
            Create First Assignment
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

export default AssignmentsPage;
