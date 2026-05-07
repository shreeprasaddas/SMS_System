import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTimetablesQuery, useDeleteTimetableMutation } from '../../store/api/timetableApi.js';
import { TimetableCard, TimetableFilters } from '../../components/timetables/index.js';
import { Button, Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function TimetablesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    teacher: '',
    day: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: response, isLoading } = useGetTimetablesQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const [deleteTimetable] = useDeleteTimetableMutation();

  const timetables = response?.data?.timetables || [];
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

  const handleTeacherFilter = (value) => {
    setFilters(prev => ({ ...prev, teacher: value }));
    setPage(1);
  };

  const handleDayFilter = (value) => {
    setFilters(prev => ({ ...prev, day: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', class: '', teacher: '', day: '' });
    setPage(1);
  };

  const handleDelete = async (timetableId) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        await deleteTimetable(timetableId).unwrap();
        toast.success('Timetable entry deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete timetable entry');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Timetable</h1>
          <p className="text-secondary-600 mt-1">
            Manage class schedules and time slots ({total} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/timetables/calendar')}
          >
            Calendar View
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/timetables/create')}
          >
            + Add Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TimetableFilters
        onSearch={handleSearch}
        onClassFilter={handleClassFilter}
        onTeacherFilter={handleTeacherFilter}
        onDayFilter={handleDayFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Timetables Grid */}
      {!isLoading && timetables.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timetables.map((timetable) => (
            <TimetableCard
              key={timetable._id}
              timetableData={timetable}
              onEdit={(id) => navigate(`/timetables/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && timetables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 mb-4">No timetable entries found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/timetables/create')}
          >
            Create First Entry
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

export default TimetablesPage;
