import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Select from '@/components/common/Select.jsx';
import Table from '@/components/common/Table/Table.jsx';
import Spinner from '@/components/common/Spinner.jsx';
import { useGetTimetablesQuery } from '@/store/api/timetableApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';

function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('');
  
  const { data: classesData, isLoading: loadingClasses } = useGetClassesQuery();
  const { data: timetableData, isLoading: loadingTimetables } = useGetTimetablesQuery(
    { classId: selectedClass },
    { skip: !selectedClass }
  );

  const classesOptions = (classesData?.data || []).map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <PageHeader title="Class Timetable" subtitle="View and manage weekly academic timetables" />
      <Card>
        <div className="max-w-xs mb-6">
          {loadingClasses ? (
            <Spinner size="sm" />
          ) : (
            <Select
              label="Select Class"
              value={selectedClass}
              onChange={setSelectedClass}
              options={classesOptions}
              placeholder="Select a class to view"
            />
          )}
        </div>

        {selectedClass ? (
          loadingTimetables ? (
            <Spinner size="lg" />
          ) : (
            <Table
              headers={['Day', 'Subject', 'Teacher', 'Time Slot', 'Room']}
              data={timetableData?.data || []}
              emptyMessage="No timetable configured for this class yet."
              renderRow={(row, i) => (
                <>
                  <td className="px-6 py-4 font-medium text-secondary-900">{row.day}</td>
                  <td className="px-6 py-4">{row.subject?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : 'N/A'}</td>
                  <td className="px-6 py-4">{`${row.startTime} - ${row.endTime}`}</td>
                  <td className="px-6 py-4">{row.roomNumber || 'N/A'}</td>
                </>
              )}
            />
          )
        ) : (
          <div className="text-center py-12 text-secondary-500">
            Please select a class to view its weekly timetable.
          </div>
        )}
      </Card>
    </div>
  );
}

export default TimetablePage;
