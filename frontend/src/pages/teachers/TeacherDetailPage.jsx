import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTeacherByIdQuery } from '@/store/api/teacherApi.js';
import { Button, Card, Spinner } from '@/components/common/index.js';
import {
  TeacherTabsPanel,
  TeacherProfileTab,
  TeacherSubjects,
  TeacherTimetableView,
} from '@/components/teacher/TeacherProfile/index.js';

function TeacherDetailPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data, isLoading, error } = useGetTeacherByIdQuery(teacherId);
  const [activeTab, setActiveTab] = useState('personal');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">
          {error?.data?.message || 'Failed to load teacher details'}
        </p>
      </div>
    );
  }

  const teacher = data?.data || {};

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return <TeacherProfileTab teacher={teacher} />;
      case 'subjects':
        return <TeacherSubjects teacher={teacher} />;
      case 'timetable':
        return <TeacherTimetableView teacher={teacher} />;
      default:
        return <TeacherProfileTab teacher={teacher} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </h1>
          <p className="text-gray-600 mt-2">{teacher.department || 'Staff Member'}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/teachers/${teacherId}/edit`)}
          >
            Edit
          </Button>
          <Button variant="outline" onClick={() => navigate('/teachers')}>
            Back to List
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          teacher.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {teacher.status || 'ACTIVE'}
        </span>
      </div>

      {/* Tabbed Interface */}
      <Card className="p-0 overflow-hidden">
        <TeacherTabsPanel activeTab={activeTab} onTabChange={setActiveTab} />
      </Card>

      {/* Tab Content */}
      <div className="mt-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default TeacherDetailPage;
