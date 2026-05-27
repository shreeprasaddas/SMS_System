import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTeachersQuery, useDeleteTeacherMutation } from '@/store/api/teacherApi.js';
import { TeacherCard, TeacherForm } from '@/components/teachers/index.js';
import { Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function TeachersPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1, limit: 12 });
  const { data, isLoading, error } = useGetTeachersQuery(filters);
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreate = () => {
    navigate('/teachers/create');
  };

  const handleView = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  const handleEdit = (teacherId) => {
    navigate(`/teachers/${teacherId}/edit`);
  };

  const handleDelete = async (teacherId) => {
    try {
      await deleteTeacher(teacherId).unwrap();
      toast.success('Teacher deleted successfully');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete teacher');
    }
  };

  const teachers = data?.data?.teachers || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-2">
            Manage all teacher records ({pagination.total || 0} total)
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Add New Teacher
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Department"
            value={filters.department || ''}
            onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            {error?.data?.message || 'Failed to load teachers. Please try again.'}
          </p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No teachers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher._id}
              teacher={teacher}
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

export default TeachersPage;
