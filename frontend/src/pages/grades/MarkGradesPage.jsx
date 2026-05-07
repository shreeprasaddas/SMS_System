import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkBulkGradesMutation } from '../../store/api/gradeApi.js';
import { Card, Button, Spinner } from '../../components/common/index.js';
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

  // Mock students data - in real app, fetch from API
  const mockStudents = [
    { _id: '1', name: 'Alice Johnson', rollNumber: '001' },
    { _id: '2', name: 'Bob Smith', rollNumber: '002' },
    { _id: '3', name: 'Charlie Brown', rollNumber: '003' },
  ];

  const [studentGrades, setStudentGrades] = useState(
    mockStudents.map(s => ({
      studentId: s._id,
      studentName: s.name,
      marks: '',
      maxMarks: 100,
      feedback: '',
    }))
  );

  const handleGradeChange = (index, field, value) => {
    const updated = [...studentGrades];
    updated[index][field] = value;
    setStudentGrades(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markBulkGrades({
        ...formData,
        grades: studentGrades,
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
                <option value="CLASS_1">Class 1</option>
                <option value="CLASS_10">Class 10</option>
                <option value="CLASS_12">Class 12</option>
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
                <option value="MATH">Mathematics</option>
                <option value="ENGLISH">English</option>
                <option value="SCIENCE">Science</option>
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
                      {mockStudents[index]?.rollNumber}
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
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-600">
                      {student.maxMarks}
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
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
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
