import React from 'react';
import { Card, Spinner } from '@/components/common';
import { useGetTeacherTimetableQuery } from '@/store/api/timetableApi.js';
import { useSelector } from 'react-redux';

function TodaySchedule() {
  const { user } = useSelector((state) => state.auth);
  // Assuming user object has id or _id representing the teacherId
  const teacherId = user?.id || user?._id || user?.userId;
  const { data, isLoading, error } = useGetTeacherTimetableQuery(teacherId, {
    skip: !teacherId,
  });

  const rawSchedule = data?.data?.timetable?.days || data?.data?.days || [];
  
  // Get today's day name (e.g., "Monday")
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = rawSchedule.find(d => d.day === today)?.periods || [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Today's Schedule ({today})</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">Failed to load schedule</p>
      ) : todaySchedule.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No classes scheduled for today</p>
      ) : (
        <div className="relative border-l border-gray-200 ml-3 space-y-6">
        {todaySchedule.map((item, idx) => (
          <div key={idx} className="relative pl-6">
            {/* Timeline Dot */}
            <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white ring-2 ring-primary-100"></span>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
              <div>
                <p className="font-semibold text-gray-800">{item.subject?.name || item.subjectName}</p>
                <p className="text-sm text-gray-500">{item.class?.name || item.className || 'Class'}</p>
              </div>
              <p className="text-sm font-medium text-primary-600 mt-1 sm:mt-0">
                {item.startTime} - {item.endTime}
              </p>
            </div>
          </div>
        ))}
      </div>
      )}
    </Card>
  );
}

export default TodaySchedule;
