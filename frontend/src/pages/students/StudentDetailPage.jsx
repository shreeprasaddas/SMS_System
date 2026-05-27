import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStudentByIdQuery } from '@/store/api/studentApi.js';
import { Button, Card, Spinner } from '@/components/common/index.js';
import {
  StudentTabsPanel,
  PersonalInfoTab,
  AcademicTab,
  AttendanceTab,
  DocumentsTab,
  FeesTab,
} from '@/components/student/StudentProfile/index.js';
import StudentSummaryCard from '@/components/student/StudentProfile/StudentSummaryCard.jsx';

function StudentDetailPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { data, isLoading, error } = useGetStudentByIdQuery(studentId);
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
          {error?.data?.message || 'Failed to load student details'}
        </p>
      </div>
    );
  }

  const student = data?.data || {};

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab student={student} />;
      case 'academic':
        return <AcademicTab student={student} />;
      case 'attendance':
        return <AttendanceTab student={student} />;
      case 'documents':
        return <DocumentsTab student={student} />;
      case 'fees':
        return <FeesTab student={student} />;
      default:
        return <PersonalInfoTab student={student} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/students/${studentId}/edit`)}
          >
            Edit Student
          </Button>
          <Button variant="outline" onClick={() => navigate('/students')}>
            Back to List
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <StudentSummaryCard student={student} />

      {/* Tabbed Interface */}
      <Card className="p-0 overflow-hidden">
        <StudentTabsPanel activeTab={activeTab} onTabChange={setActiveTab} />
      </Card>

      {/* Tab Content */}
      <div className="mt-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default StudentDetailPage;
