import React from 'react';
import { useSelector } from 'react-redux';
import MyAttendance from './MyAttendance.jsx';
import MyGrades from './MyGrades.jsx';
import UpcomingExams from './UpcomingExams.jsx';
import { Card } from '@/components/common';

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-primary-600 rounded-lg p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Student'}!</h2>
        <p className="mt-2 text-primary-100">Here's an overview of your academic performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MyAttendance />
        <MyGrades />
        <UpcomingExams />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
          <p className="text-gray-500 text-sm">No new announcements from your teachers.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Pending Assignments</h3>
          <p className="text-gray-500 text-sm">You have no pending assignments due this week! Great job.</p>
        </Card>
      </div>
    </div>
  );
}

export default StudentDashboard;
