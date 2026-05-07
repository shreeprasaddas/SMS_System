import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetClassByIdQuery } from '../../store/api/classApi.js';
import { Card, Spinner, Button } from '../../components/common/index.js';

function ClassDetailPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetClassByIdQuery(classId);

  const classData = response?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        Class not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">{classData.name}</h1>
          <p className="text-secondary-600 mt-1">Section {classData.section}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/classes/${classId}/edit`)}
          >
            Edit Class
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/classes')}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Class Name</p>
                <p className="text-secondary-900">{classData.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Section</p>
                <p className="text-secondary-900">{classData.section}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Academic Year</p>
                <p className="text-secondary-900">{classData.academicYear}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Capacity</p>
                <p className="text-secondary-900">{classData.capacity} students</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Teacher Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Class Teacher</p>
                <p className="text-secondary-900">{classData.classTeacher}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Teacher ID</p>
                <p className="text-secondary-900">{classData.teacherId}</p>
              </div>
            </div>
          </Card>

          {classData.description && (
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Description</h3>
              <p className="text-secondary-600">{classData.description}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/classes`)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Students
              </button>
              <button
                onClick={() => navigate(`/classes`)}
                className="w-full px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Subjects
              </button>
              <button
                onClick={() => navigate(`/classes`)}
                className="w-full px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
              >
                View Schedule
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Total Students</span>
                <span className="font-semibold text-secondary-900">{classData.studentCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Available Seats</span>
                <span className="font-semibold text-secondary-900">
                  {classData.capacity - (classData.studentCount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Occupancy Rate</span>
                <span className="font-semibold text-secondary-900">
                  {Math.round(((classData.studentCount || 0) / classData.capacity) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailPage;
