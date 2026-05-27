import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSubjectByIdQuery } from '@/store/api/subjectApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function SubjectDetailPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetSubjectByIdQuery(subjectId);

  const subject = response?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        Subject not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">{subject.name}</h1>
          <p className="text-secondary-600 mt-1">Code: {subject.code}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/subjects/${subjectId}/edit`)}
          >
            Edit Subject
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/subjects')}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Subject Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Subject Name</p>
                <p className="text-secondary-900">{subject.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Subject Code</p>
                <p className="text-secondary-900">{subject.code}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Credit Hours</p>
                <p className="text-secondary-900">{subject.creditHours}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Maximum Marks</p>
                <p className="text-secondary-900">{subject.maxMarks}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Department</p>
                <p className="text-secondary-900">{subject.departmentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Status</p>
                <p className="text-secondary-900">{subject.status || 'ACTIVE'}</p>
              </div>
            </div>
          </Card>

          {subject.description && (
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Description</h3>
              <p className="text-secondary-600">{subject.description}</p>
            </Card>
          )}

          {subject.syllabus && (
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Syllabus</h3>
              <div className="prose max-w-none">
                <p className="text-secondary-600 whitespace-pre-wrap">{subject.syllabus}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/exams?subject=${subjectId}`)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Exams
              </button>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/teachers`)}
                className="w-full px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors"
              >
                Assign Teachers
              </button>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/classes`)}
                className="w-full px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Classes
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Classes</span>
                <span className="font-semibold text-secondary-900">{subject.classCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Teachers</span>
                <span className="font-semibold text-secondary-900">{subject.teacherCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Students</span>
                <span className="font-semibold text-secondary-900">{subject.studentCount || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetailPage;
