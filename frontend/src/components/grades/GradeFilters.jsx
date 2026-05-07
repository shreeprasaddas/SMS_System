import React from 'react';

function GradeFilters({ onSearch, onClassFilter, onGradeFilter, onExamTypeFilter, onClearFilters }) {
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
            placeholder="Search by student, subject..."
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
            <option value="CLASS_2">Class 2</option>
            <option value="CLASS_3">Class 3</option>
            <option value="CLASS_10">Class 10</option>
            <option value="CLASS_12">Class 12</option>
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Grade
          </label>
          <select
            onChange={(e) => onGradeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>

        {/* Exam Type Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Exam Type
          </label>
          <select
            onChange={(e) => onExamTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="MID_TERM">Mid Term</option>
            <option value="FINAL">Final</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="PROJECT">Project</option>
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

export default GradeFilters;
