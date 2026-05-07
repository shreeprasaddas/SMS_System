import React from 'react';
import { Input } from '../common/index.js';

function StudentFilters({ onFiltersChange, filters = {} }) {
  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleClassChange = (e) => {
    onFiltersChange({ ...filters, classId: e.target.value, page: 1 });
  };

  const handleStatusChange = (e) => {
    onFiltersChange({ ...filters, status: e.target.value, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({ search: '', classId: '', status: '', page: 1 });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select
            value={filters.classId || ''}
            onChange={handleClassChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            <option value="class_001">Class 1</option>
            <option value="class_002">Class 2</option>
            <option value="class_003">Class 3</option>
            <option value="class_004">Class 4</option>
            <option value="class_005">Class 5</option>
            <option value="class_006">Class 6</option>
            <option value="class_007">Class 7</option>
            <option value="class_008">Class 8</option>
            <option value="class_009">Class 9</option>
            <option value="class_010">Class 10</option>
            <option value="class_011">Class 11</option>
            <option value="class_012">Class 12</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="TRANSFERRED">Transferred</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentFilters;
