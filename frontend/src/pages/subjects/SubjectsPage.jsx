import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSubjectsQuery, useDeleteSubjectMutation } from '@/store/api/subjectApi.js';
import { SubjectCard, SubjectFilters } from '@/components/subjects/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function SubjectsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    department: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading } = useGetSubjectsQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteSubject] = useDeleteSubjectMutation();

  const subjects = response?.data?.subjects || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleDepartmentFilter = (value) => {
    setFilters(prev => ({ ...prev, department: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', department: '' });
    setPage(1);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(subjectId).unwrap();
        toast.success('Subject deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Subjects</h1>
          <p className="text-secondary-600 mt-1">
            Manage school subjects and curriculum ({total} total)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/subjects/create')}
        >
          + Add New Subject
        </Button>
      </div>

      {/* Filters */}
      <SubjectFilters
        onSearch={handleSearch}
        onDepartmentFilter={handleDepartmentFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Subjects Grid */}
      {!isLoading && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subjectData={subject}
              onEdit={(id) => navigate(`/subjects/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && subjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No subjects found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/subjects/create')}
          >
            Create First Subject
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

export default SubjectsPage;
