import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyClasses from './MyClasses.jsx';
import PendingGrades from './PendingGrades.jsx';
import TodaySchedule from './TodaySchedule.jsx';
import { Card } from '@/components/common';
import { ClipboardDocumentCheckIcon, PencilSquareIcon, DocumentPlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleTakeAttendance = useCallback(() => {
    navigate('/attendance');
  }, [navigate]);

  const handleEnterGrades = useCallback(() => {
    navigate('/grades');
  }, [navigate]);

  const handleCreateAssignment = useCallback(() => {
    navigate('/assignments/create');
  }, [navigate]);

  const handleViewTimetable = useCallback(() => {
    navigate('/timetables');
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-primary-600 rounded-lg p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Teacher'}!</h2>
        <p className="mt-2 text-primary-100">Here's your schedule and tasks for today.</p>
      </div>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MyClasses />
        <PendingGrades />
        <TodaySchedule />
      </div>

      {/* Bottom Full Width Widget */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={handleTakeAttendance}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-primary-50 rounded-xl text-primary-700 font-medium hover:bg-primary-100 transition-colors border border-primary-100 hover:shadow-sm"
            >
              <ClipboardDocumentCheckIcon className="w-8 h-8" />
              Take Attendance
            </button>
            <button 
              onClick={handleEnterGrades}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-green-50 rounded-xl text-green-700 font-medium hover:bg-green-100 transition-colors border border-green-100 hover:shadow-sm"
            >
              <PencilSquareIcon className="w-8 h-8" />
              Enter Grades
            </button>
            <button 
              onClick={handleCreateAssignment}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-yellow-50 rounded-xl text-yellow-700 font-medium hover:bg-yellow-100 transition-colors border border-yellow-100 hover:shadow-sm"
            >
              <DocumentPlusIcon className="w-8 h-8" />
              Create Assignment
            </button>
            <button 
              onClick={handleViewTimetable}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-blue-50 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-colors border border-blue-100 hover:shadow-sm"
            >
              <CalendarDaysIcon className="w-8 h-8" />
              View Timetable
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default TeacherDashboard;

