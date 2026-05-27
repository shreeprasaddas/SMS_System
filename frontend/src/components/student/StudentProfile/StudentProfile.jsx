import React, { useState } from 'react';
import StudentSummaryCard from './StudentSummaryCard.jsx';
import StudentTabsPanel from './StudentTabsPanel.jsx';
import PersonalInfoTab from './PersonalInfoTab.jsx';
import AcademicTab from './AcademicTab.jsx';
import AttendanceTab from './AttendanceTab.jsx';
import DocumentsTab from './DocumentsTab.jsx';
import FeesTab from './FeesTab.jsx';
import ActivitiesTab from './ActivitiesTab.jsx';

function StudentProfile({ student = {}, academicData = {}, attendanceData = {}, feeData = {}, documents = [], activities = [] }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'academic', label: 'Academic & Grades' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'fees', label: 'Fees & Finance' },
    { id: 'activities', label: 'Activities' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <StudentSummaryCard student={student} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <StudentTabsPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-4">
          {activeTab === 'personal' && <PersonalInfoTab student={student} />}
          {activeTab === 'academic' && <AcademicTab grades={academicData?.grades} exams={academicData?.exams} />}
          {activeTab === 'attendance' && <AttendanceTab attendance={attendanceData} />}
          {activeTab === 'fees' && <FeesTab fees={feeData} />}
          {activeTab === 'activities' && <ActivitiesTab activities={activities} />}
          {activeTab === 'documents' && <DocumentsTab documents={documents} />}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
