import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Select from '@/components/common/Select.jsx';
import Table from '@/components/common/Table/Table.jsx';
import Button from '@/components/common/Button.jsx';
import Spinner from '@/components/common/Spinner.jsx';
import { useGetStudentsQuery } from '@/store/api/studentApi.js';
import { useGetGradesQuery } from '@/store/api/gradeApi.js';
import { usePrint } from '@/hooks/usePrint.js';
import { getLetterGrade, calculateGPA } from '@/utils/gradeUtils.js';

function ReportCardsPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const { data: studentsData, isLoading: loadingStudents } = useGetStudentsQuery();
  const { data: gradesData, isLoading: loadingGrades } = useGetGradesQuery(
    { studentId: selectedStudent },
    { skip: !selectedStudent }
  );

  const { printElement } = usePrint();

  const studentOptions = (studentsData?.data || []).map((s) => ({
    label: `${s.firstName} ${s.lastName} (Roll: ${s.rollNumber})`,
    value: s._id,
  }));

  const activeStudent = (studentsData?.data || []).find((s) => s._id === selectedStudent);
  const grades = gradesData?.data || [];
  const gpa = calculateGPA(grades);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Report Cards"
        subtitle="Generate and print official student report cards"
        actions={
          <Button variant="primary" onClick={() => printElement('report-card-area')} disabled={!selectedStudent}>
            Print Report Card
          </Button>
        }
      />
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
              placeholder="Select a student"
            />
          )}
        </div>

        {selectedStudent ? (
          loadingGrades ? (
            <Spinner size="lg" />
          ) : (
            <div id="report-card-area" className="bg-white p-8 border border-secondary-200 rounded-lg max-w-3xl mx-auto">
              <div className="text-center border-b border-secondary-300 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">ACADEMIC REPORT CARD</h2>
                <h3 className="text-lg font-semibold text-secondary-700 mt-1">Delhi Public School</h3>
                <p className="text-sm text-secondary-500">Academic Year: 2025-2026</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p><span className="font-semibold">Student Name:</span> {activeStudent?.firstName} {activeStudent?.lastName}</p>
                  <p><span className="font-semibold">Roll Number:</span> {activeStudent?.rollNumber}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold">Class:</span> {activeStudent?.classId || 'Grade X-A'}</p>
                  <p><span className="font-semibold">Overall GPA:</span> <span className="font-bold text-primary-600">{gpa}</span></p>
                </div>
              </div>

              <Table
                headers={['Subject', 'Marks Obtained', 'Max Marks', 'Letter Grade']}
                data={grades}
                emptyMessage="No grade data recorded for this student."
                renderRow={(row, i) => (
                  <>
                    <td className="px-6 py-3 font-medium text-secondary-900">{row.subject?.name || 'N/A'}</td>
                    <td className="px-6 py-3">{row.marks}</td>
                    <td className="px-6 py-3">{row.maxMarks || 100}</td>
                    <td className="px-6 py-3 font-bold">{getLetterGrade(row.marks)}</td>
                  </>
                )}
              />

              <div className="mt-12 flex justify-between text-center text-sm pt-8 border-t border-secondary-200">
                <div>
                  <div className="w-48 border-b border-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600">Class Teacher Signature</p>
                </div>
                <div>
                  <div className="w-48 border-b border-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600">Principal Signature</p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-secondary-500">
            Please select a student to generate their academic report card.
          </div>
        )}
      </Card>
    </div>
  );
}

export default ReportCardsPage;
