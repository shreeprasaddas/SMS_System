import React from 'react';
import { Card } from '../common/index.js';

function TimetableCard({ timetableData, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-50 text-green-700',
      INACTIVE: 'bg-gray-50 text-gray-700',
      CANCELLED: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-blue-50 text-blue-700';
  };

  const getDayColor = (day) => {
    const colors = {
      MONDAY: 'bg-blue-50',
      TUESDAY: 'bg-purple-50',
      WEDNESDAY: 'bg-pink-50',
      THURSDAY: 'bg-orange-50',
      FRIDAY: 'bg-green-50',
      SATURDAY: 'bg-red-50',
    };
    return colors[day] || 'bg-gray-50';
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const getDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '0';
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const duration = (endHour - startHour) * 60 + (endMin - startMin);
    return Math.round(duration / 60 * 10) / 10; // Duration in hours
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getDayColor(timetableData.day)}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">{timetableData.subjectId}</h3>
            <p className="text-sm text-secondary-600 mt-1">{timetableData.classId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(timetableData.status)}`}>
            {timetableData.status}
          </span>
        </div>

        <div className="border-t border-secondary-200 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">Day</span>
            <span className="font-semibold text-secondary-900">{timetableData.day}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Time</span>
            <span className="font-semibold text-secondary-900">
              {formatTime(timetableData.startTime)} - {formatTime(timetableData.endTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Duration</span>
            <span className="font-semibold text-secondary-900">
              {getDuration(timetableData.startTime, timetableData.endTime)} hrs
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Teacher</span>
            <span className="font-semibold text-secondary-900">{timetableData.teacherId}</span>
          </div>
          {timetableData.room && (
            <div className="flex justify-between">
              <span className="text-secondary-600">Room</span>
              <span className="font-semibold text-secondary-900">{timetableData.room}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(timetableData._id)}
            className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(timetableData._id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

export default TimetableCard;
