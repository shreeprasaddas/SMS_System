import React, { useState } from 'react';
import TeacherTabsPanel from './TeacherTabsPanel.jsx';
import TeacherProfileTab from './TeacherProfileTab.jsx';
import TeacherSubjects from './TeacherSubjects.jsx';
import TeacherTimetableView from './TeacherTimetableView.jsx';
import { Card, Avatar, StatusBadge } from '@/components/common';

function TeacherProfile({ teacher = {}, subjects = [], classes = [], timetable = [] }) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Details' },
    { id: 'subjects', label: 'Assigned Subjects' },
    { id: 'timetable', label: 'Timetable' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-white p-6 shadow-sm border border-secondary-200">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            src={teacher.profileImage}
            name={`${teacher.firstName} ${teacher.lastName}`}
            size="xl"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-secondary-900">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-secondary-500 font-medium">{teacher.designation || 'Teacher'}</p>
            <p className="text-sm text-secondary-500 mt-1">Email: {teacher.email}</p>
          </div>
          <div>
            <StatusBadge variant={teacher.status === 'ACTIVE' ? 'success' : 'neutral'}>
              {teacher.status || 'Active'}
            </StatusBadge>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <TeacherTabsPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          {activeTab === 'profile' && <TeacherProfileTab teacher={teacher} />}
          {activeTab === 'subjects' && <TeacherSubjects subjects={subjects} classes={classes} />}
          {activeTab === 'timetable' && <TeacherTimetableView timetable={timetable} />}
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
