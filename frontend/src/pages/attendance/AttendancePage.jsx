import React, { useState } from 'react';
import { useGetAttendanceQuery, useMarkAttendanceMutation } from '../../store/api/attendanceApi.js';
import { Button, Spinner, Card } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function AttendancePage() {
  const [filters, setFilters] = useState({ classId: '', date: new Date().toISOString().split('T')[0] });
  const { data, isLoading } = useGetAttendanceQuery(filters);
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const [selectedStudents, setSelectedStudents] = useState({});

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
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Class</option>
              <option value="class_001">Class 1</option>
              <option value="class_002">Class 2</option>
              <option value="class_003">Class 3</option>
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

        {isLoading ? (
          <Spinner size="lg" />
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
                  {data?.data?.map((student, idx) => (
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
                  ))}
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
