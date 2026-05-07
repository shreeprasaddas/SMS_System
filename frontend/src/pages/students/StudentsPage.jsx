import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../store/api/studentApi.js';
import { StudentCard, StudentFilters } from '../../components/students/index.js';
import { Button, Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function StudentsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', classId: '', status: '', page: 1, limit: 12 });
  const { data, isLoading, error } = useGetStudentsQuery(filters);
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreate = () => {
    navigate('/students/create');
  };

  const handleView = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleEdit = (studentId) => {
    navigate(`/students/${studentId}/edit`);
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteStudent(studentId).unwrap();
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete student');
    }
  };

  const students = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">
            Manage all student records in the system ({pagination.total || 0} total)
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Add New Student
        </Button>
      </div>

      {/* Filters */}
      <StudentFilters onFiltersChange={handleFiltersChange} filters={filters} />

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 text-center">
            {error?.data?.message || 'Failed to load students. Please try again.'}
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No students found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new student</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {filters.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
