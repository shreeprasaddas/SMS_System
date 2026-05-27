import React, { useState } from 'react';
import { Table, Pagination } from '@/components/common';
import StudentListFilters from './StudentListFilters.jsx';
import StudentListRow from './StudentListRow.jsx';

function StudentList({ students = [], classes = [], onEdit, onDelete, onView }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    const matchesClass = !classFilter || student.classId === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <StudentListFilters
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        classFilter={classFilter}
        onClassChange={setClassFilter}
        classes={classes}
      />
      <Table
        headers={['Name', 'Roll Number', 'Class', 'Status', 'Actions']}
        data={displayedStudents}
        emptyMessage="No students found matching the selected filters."
        renderRow={(student) => (
          <StudentListRow
            key={student._id || student.id}
            student={student}
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

export default StudentList;
