import React from 'react';

function RouteFilters({ onSearch, onStatusFilter, onDriverFilter, onClearFilters }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by route name..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Status
          </label>
          <select
            onChange={(e) => onStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        {/* Driver Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Driver
          </label>
          <input
            type="text"
            placeholder="Filter by driver..."
            onChange={(e) => onDriverFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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

export default RouteFilters;
