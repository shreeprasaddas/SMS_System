import React, { useState } from 'react';
import { Table, Pagination, SearchBar, Select } from '@/components/common';
import TeacherListRow from './TeacherListRow.jsx';

function TeacherList({ teachers = [], onEdit, onDelete, onView }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.phone?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const displayedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search teachers..." className="flex-1 max-w-xs" />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
          ]}
          placeholder="All Statuses"
          className="w-40"
        />
      </div>
      <Table
        headers={['Name', 'Designation', 'Phone', 'Status', 'Actions']}
        data={displayedTeachers}
        emptyMessage="No teachers found matching the selected filters."
        renderRow={(teacher) => (
          <TeacherListRow
            key={teacher._id || teacher.id}
            teacher={teacher}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        )}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default TeacherList;
