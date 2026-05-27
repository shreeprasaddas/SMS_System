import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGradesQuery, useDeleteGradeMutation } from '@/store/api/gradeApi.js';
import { GradeCard, GradeFilters } from '@/components/grades/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function GradesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    grade: '',
    examType: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading, error } = useGetGradesQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteGrade] = useDeleteGradeMutation();

  const grades = response?.data?.grades || [];
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

  const handleGradeFilter = (value) => {
    setFilters(prev => ({ ...prev, grade: value }));
    setPage(1);
  };

  const handleExamTypeFilter = (value) => {
    setFilters(prev => ({ ...prev, examType: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', class: '', grade: '', examType: '' });
    setPage(1);
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await deleteGrade(gradeId).unwrap();
        toast.success('Grade deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete grade');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Grades</h1>
          <p className="text-secondary-600 mt-1">
            View and manage student grades ({total} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/grades/mark')}
          >
            Mark Grades
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/grades/report')}
          >
            View Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GradeFilters
        onSearch={handleSearch}
        onClassFilter={handleClassFilter}
        onGradeFilter={handleGradeFilter}
        onExamTypeFilter={handleExamTypeFilter}
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
          Error loading grades. Please try again.
        </div>
      )}

      {/* Grades Grid */}
      {!isLoading && grades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <GradeCard
              key={grade._id}
              gradeData={grade}
              onEdit={(id) => navigate(`/grades/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && grades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No grades found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/grades/mark')}
          >
            Mark First Grade
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

export default GradesPage;
