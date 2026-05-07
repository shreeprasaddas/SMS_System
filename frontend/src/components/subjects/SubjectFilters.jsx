import React from 'react';

function SubjectFilters({ onSearch, onDepartmentFilter, onClearFilters }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name or code..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Department
          </label>
          <select
            onChange={(e) => onDepartmentFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="SCIENCE">Science</option>
            <option value="MATH">Mathematics</option>
            <option value="HUMANITIES">Humanities</option>
            <option value="COMMERCE">Commerce</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Status
          </label>
          <select
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-lg text-sm font-medium transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default SubjectFilters;
