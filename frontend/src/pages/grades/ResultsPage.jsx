import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Table from '@/components/common/Table/Table.jsx';
import Spinner from '@/components/common/Spinner.jsx';
import Select from '@/components/common/Select.jsx';
import { useGetGradesQuery } from '@/store/api/gradeApi.js';
import { useGetStudentsQuery } from '@/store/api/studentApi.js';
import { getLetterGrade } from '@/utils/gradeUtils.js';

function ResultsPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const { data: studentsData, isLoading: loadingStudents } = useGetStudentsQuery();
  const { data: gradesData, isLoading: loadingGrades } = useGetGradesQuery(
    { studentId: selectedStudent },
    { skip: !selectedStudent }
  );

  const studentOptions = (studentsData?.data || []).map((s) => ({
    label: `${s.firstName} ${s.lastName} (Roll: ${s.rollNumber})`,
    value: s._id,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Results" subtitle="View student academic marks and progress transcripts" />
      <Card>
        <div className="max-w-xs mb-6">
          {loadingStudents ? (
            <Spinner size="sm" />
          ) : (
            <Select
              label="Select Student"
              value={selectedStudent}
              onChange={setSelectedStudent}
              options={studentOptions}
              placeholder="Select a student to view"
            />
          )}
        </div>

        {selectedStudent ? (
          loadingGrades ? (
            <Spinner size="lg" />
          ) : (
            <Table
              headers={['Subject', 'Exam Type', 'Marks Obtained', 'Max Marks', 'Grade', 'Remarks']}
              data={gradesData?.data || []}
              emptyMessage="No results found for this student."
              renderRow={(row, i) => (
                <>
                  <td className="px-6 py-4 font-medium text-secondary-900">{row.subject?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{row.exam?.name || 'Final Exam'}</td>
                  <td className="px-6 py-4 font-semibold">{row.marks}</td>
                  <td className="px-6 py-4">{row.maxMarks || 100}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-secondary-100 font-bold">
                      {getLetterGrade(row.marks)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">{row.remarks || 'Pass'}</td>
                </>
              )}
            />
          )
        ) : (
          <div className="text-center py-12 text-secondary-500">
            Please select a student to view their academic transcripts.
          </div>
        )}
      </Card>
    </div>
  );
}

export default ResultsPage;
