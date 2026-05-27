import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTimetableCalendarQuery } from '@/store/api/timetableApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function TimetableCalendarPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ class: '', teacher: '' });
  
  const { data: response, isLoading } = useGetTimetableCalendarQuery(filters);

  const schedule = response?.data || {};
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const getTimeSlot = (hour) => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  // Get all unique hours from timetable
  const getAllHours = () => {
    const hours = new Set();
    days.forEach(day => {
      const daySchedule = schedule[day] || [];
      daySchedule.forEach(entry => {
        if (entry.startTime) {
          const hour = parseInt(entry.startTime.split(':')[0]);
          hours.add(hour);
        }
      });
    });
    return Array.from(hours).sort((a, b) => a - b);
  };

  const getEntriesForSlot = (day, hour) => {
    const daySchedule = schedule[day] || [];
    return daySchedule.filter(entry => {
      const startHour = parseInt(entry.startTime.split(':')[0]);
      return startHour === hour;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const hours = getAllHours();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Weekly Timetable</h1>
          <p className="text-secondary-600 mt-1">Class schedule calendar view</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/timetables')}
          >
            List View
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/timetables/create')}
          >
            + Add Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Class</label>
            <input
              type="text"
              placeholder="Filter by class..."
              onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Teacher</label>
            <input
              type="text"
              placeholder="Filter by teacher..."
              onChange={(e) => setFilters(prev => ({ ...prev, teacher: e.target.value }))}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* Calendar Table */}
      <Card className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left bg-primary-50 text-secondary-900 font-semibold border border-secondary-200">Time</th>
              {days.map(day => (
                <th
                  key={day}
                  className="px-4 py-3 text-center bg-primary-50 text-secondary-900 font-semibold border border-secondary-200 min-w-[150px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.length > 0 ? (
              hours.map(hour => (
                <tr key={hour}>
                  <td className="px-4 py-3 text-sm font-semibold text-secondary-900 bg-secondary-50 border border-secondary-200">
                    {getTimeSlot(hour)}
                  </td>
                  {days.map(day => {
                    const entries = getEntriesForSlot(day, hour);
                    return (
                      <td
                        key={`${day}-${hour}`}
                        className="px-2 py-2 border border-secondary-200 bg-white align-top"
                      >
                        <div className="space-y-1">
                          {entries.map(entry => (
                            <div
                              key={entry._id}
                              onClick={() => navigate(`/timetables/${entry._id}/edit`)}
                              className="p-2 bg-blue-50 border-l-4 border-blue-500 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                              <p className="text-xs font-semibold text-secondary-900">{entry.subjectId}</p>
                              <p className="text-xs text-secondary-600">{entry.classId}</p>
                              <p className="text-xs text-secondary-500">
                                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                              </p>
                              {entry.room && (
                                <p className="text-xs text-secondary-500">📍 {entry.room}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-secondary-600">
                  No timetable entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Legend */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-3">How to use</h3>
        <ul className="space-y-2 text-sm text-secondary-600">
          <li>• Click on any class slot to edit the timetable entry</li>
          <li>• Use filters to view specific class or teacher schedules</li>
          <li>• Each colored box represents a class session</li>
          <li>• Time slots shown are class start times</li>
        </ul>
      </Card>
    </div>
  );
}

export default TimetableCalendarPage;
