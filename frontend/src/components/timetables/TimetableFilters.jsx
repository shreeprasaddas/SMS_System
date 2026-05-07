import React from 'react';

function TimetableFilters({ onSearch, onClassFilter, onTeacherFilter, onDayFilter, onClearFilters }) {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

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
            placeholder="Search by subject..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Class
          </label>
          <select
            onChange={(e) => onClassFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            <option value="CLASS_1">Class 1</option>
            <option value="CLASS_10">Class 10</option>
            <option value="CLASS_12">Class 12</option>
          </select>
        </div>

        {/* Teacher Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Teacher
          </label>
          <input
            type="text"
            placeholder="Filter by teacher..."
            onChange={(e) => onTeacherFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Day Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Day
          </label>
          <select
            onChange={(e) => onDayFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Days</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
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

export default TimetableFilters;
