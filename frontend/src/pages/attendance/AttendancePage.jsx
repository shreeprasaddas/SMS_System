import React, { useState } from 'react';
import { useGetAttendanceQuery, useMarkAttendanceMutation } from '@/store/api/attendanceApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { Button, Spinner, Card } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function AttendancePage() {
  const [filters, setFilters] = useState({ classId: '', date: new Date().toISOString().split('T')[0] });
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery({ limit: 100 });
  const { data, isLoading } = useGetAttendanceQuery(filters, { skip: !filters.classId });
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [selectedStudents, setSelectedStudents] = useState({});

  const classes = classesData?.data?.classes || classesData?.data || [];

  const handleAttendanceToggle = (studentId) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceData = {
        classId: filters.classId,
        date: filters.date,
        attendance: Object.entries(selectedStudents).map(([studentId, isPresent]) => ({
          studentId,
          status: isPresent ? 'PRESENT' : 'ABSENT'
        }))
      };
      await markAttendance(attendanceData).unwrap();
      toast.success('Attendance marked successfully');
      setSelectedStudents({});
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mark Attendance</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <select
              value={filters.classId}
              onChange={(e) => {
                setFilters({ ...filters, classId: e.target.value });
                setSelectedStudents({});
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Class</option>
              {classesLoading && <option disabled>Loading classes...</option>}
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name || cls.className} {cls.section ? `- ${cls.section}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {!filters.classId ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>Select a class to view and mark attendance</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Roll</th>
                    <th className="px-4 py-2 text-left font-semibold">Student Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.data || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                        No students found for this class
                      </td>
                    </tr>
                  ) : (
                    (data?.data || []).map((student) => (
                      <tr key={student._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{student.rollNumber}</td>
                        <td className="px-4 py-3">{student.firstName} {student.lastName}</td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents[student._id] || false}
                            onChange={() => handleAttendanceToggle(student._id)}
                            className="w-4 h-4"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleSubmitAttendance}
                isLoading={isMarking}
              >
                Submit Attendance
              </Button>
              <Button variant="outline" onClick={() => setSelectedStudents({})}>
                Clear
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default AttendancePage;
