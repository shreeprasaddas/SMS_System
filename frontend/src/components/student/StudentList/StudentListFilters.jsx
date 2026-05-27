import React from 'react';
import { SearchBar, Select } from '@/components/common';

function StudentListFilters({ search, onSearch, statusFilter, onStatusChange, classFilter, onClassChange, classes = [] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <SearchBar value={search} onChange={onSearch} placeholder="Search students..." className="flex-1 max-w-xs" />
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Graduated', value: 'GRADUATED' },
        ]}
        placeholder="All Statuses"
        className="w-40"
      />
      <Select
        value={classFilter}
        onChange={onClassChange}
        options={classes.map((c) => ({ label: c.name, value: c._id }))}
        placeholder="All Classes"
        className="w-40"
      />
    </div>
  );
}

export default StudentListFilters;
