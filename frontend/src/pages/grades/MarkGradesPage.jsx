import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkBulkGradesMutation } from '@/store/api/gradeApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { useGetSubjectsQuery } from '@/store/api/subjectApi.js';
import { useGetStudentsQuery } from '@/store/api/studentApi.js';
import { Card, Button, Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function MarkGradesPage() {
  const navigate = useNavigate();
  const [markBulkGrades, { isLoading }] = useMarkBulkGradesMutation();

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    examType: 'MID_TERM',
    grades: [],
  });

  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery({ limit: 100 });
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsQuery({ limit: 100 });
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery(
    { classId: formData.classId, limit: 100 },
    { skip: !formData.classId }
  );

  const classes = classesData?.data?.classes || classesData?.data || [];
  const subjects = subjectsData?.data?.subjects || subjectsData?.data || [];
  const students = studentsData?.data?.students || studentsData?.data || [];

  const [studentGrades, setStudentGrades] = useState([]);

  useEffect(() => {
    if (students && students.length > 0) {
      setStudentGrades(
        students.map(s => ({
          studentId: s._id,
          studentName: `${s.firstName} ${s.lastName}`,
          rollNumber: s.rollNumber || '—',
          marks: '',
          maxMarks: 100,
          feedback: '',
        }))
      );
    } else {
      setStudentGrades([]);
    }
  }, [students]);

  const handleGradeChange = (index, field, value) => {
    const updated = [...studentGrades];
    updated[index][field] = value;
    setStudentGrades(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classId || !formData.subjectId) {
      toast.error('Please select class and subject');
      return;
    }
    if (studentGrades.length === 0) {
      toast.error('No students found in the selected class');
      return;
    }
    try {
      await markBulkGrades({
        ...formData,
        grades: studentGrades.map(g => ({
          studentId: g.studentId,
          marks: Number(g.marks),
          maxMarks: Number(g.maxMarks),
          feedback: g.feedback,
        })),
      }).unwrap();
      toast.success('Grades marked successfully');
      navigate('/grades');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to mark grades');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Mark Grades</h1>
        <p className="text-secondary-600 mt-1">Enter grades for students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Filter Section */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Select Class & Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Class
              </label>
              <select
                required
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Subject
              </label>
              <select
                required
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Subject</option>
                {subjectsLoading && <option disabled>Loading subjects...</option>}
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Exam Type
              </label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="MID_TERM">Mid Term</option>
                <option value="FINAL">Final</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Grades Table */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Student Grades</h3>
          {!formData.classId ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>Select a class and subject to input student grades</p>
            </div>
          ) : studentsLoading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : studentGrades.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No students enrolled in this class yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                      Marks
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                      Max Marks
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map((student, index) => (
                    <tr key={student.studentId} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-secondary-900">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max={student.maxMarks}
                          value={student.marks}
                          onChange={(e) => handleGradeChange(index, 'marks', e.target.value)}
                          className="w-20 px-2 py-1 border border-secondary-300 rounded text-center"
                          placeholder="0"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        <input
                          type="number"
                          min="1"
                          value={student.maxMarks}
                          onChange={(e) => handleGradeChange(index, 'maxMarks', e.target.value)}
                          className="w-20 px-2 py-1 border border-secondary-300 rounded text-center"
                          placeholder="100"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={student.feedback}
                          onChange={(e) => handleGradeChange(index, 'feedback', e.target.value)}
                          className="w-full px-2 py-1 border border-secondary-300 rounded text-sm"
                          placeholder="Add feedback..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={studentGrades.length === 0}
          >
            Mark Grades
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => navigate('/grades')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MarkGradesPage;
