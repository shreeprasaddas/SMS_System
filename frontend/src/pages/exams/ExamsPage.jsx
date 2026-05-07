import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetExamsQuery, useDeleteExamMutation } from '../../store/api/examApi.js';
import { ExamCard, ExamFilters } from '../../components/exams/index.js';
import { Button, Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function ExamsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading } = useGetExamsQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteExam] = useDeleteExamMutation();

  const exams = response?.data?.exams || [];
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

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', class: '', status: '' });
    setPage(1);
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId).unwrap();
        toast.success('Exam deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete exam');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Exams</h1>
          <p className="text-secondary-600 mt-1">
            Manage exams and exam schedules ({total} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/exams/schedule')}
          >
            View Schedule
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/exams/create')}
          >
            + Add New Exam
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ExamFilters
        onSearch={handleSearch}
        onClassFilter={handleClassFilter}
        onStatusFilter={handleStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Exams Grid */}
      {!isLoading && exams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard
              key={exam._id}
              examData={exam}
              onEdit={(id) => navigate(`/exams/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && exams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No exams found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/exams/create')}
          >
            Create First Exam
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

export default ExamsPage;
