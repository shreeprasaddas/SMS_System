import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetExamByIdQuery } from '@/store/api/examApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function ExamDetailPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetExamByIdQuery(examId);

  const exam = response?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        Exam not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">{exam.name}</h1>
          <p className="text-secondary-600 mt-1">Exam Type: {exam.examType}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/exams/${examId}/edit`)}
          >
            Edit Exam
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/exams')}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Schedule Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Date</p>
                <p className="text-secondary-900">
                  {new Date(exam.examDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Time</p>
                <p className="text-secondary-900">{exam.startTime} - {exam.endTime}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Duration</p>
                <p className="text-secondary-900">{exam.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Status</p>
                <p className="text-secondary-900">{exam.status}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Exam Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Class</p>
                <p className="text-secondary-900">{exam.classId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Subject</p>
                <p className="text-secondary-900">{exam.subjectId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Total Marks</p>
                <p className="text-secondary-900">{exam.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Passing Marks</p>
                <p className="text-secondary-900">{exam.passingMarks}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/grades?exam=${examId}`)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Grades
              </button>
              <button
                onClick={() => navigate(`/exams/schedule`)}
                className="w-full px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Schedule
              </button>
              <button
                onClick={() => navigate(`/reports?type=exam&id=${examId}`)}
                className="w-full px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Report
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Total Students</span>
                <span className="font-semibold text-secondary-900">{exam.studentCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Submitted</span>
                <span className="font-semibold text-secondary-900">{exam.submittedCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Graded</span>
                <span className="font-semibold text-secondary-900">{exam.gradedCount || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ExamDetailPage;
