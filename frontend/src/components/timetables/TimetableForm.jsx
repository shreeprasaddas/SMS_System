import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../common/index.js';

function TimetableForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      classId: '',
      subjectId: '',
      teacherId: '',
      day: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      room: '',
      capacity: '40',
      status: 'ACTIVE',
    },
  });

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Schedule Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Schedule Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class"
              type="text"
              placeholder="Class 10 A"
              error={errors.classId?.message}
              {...register('classId', {
                required: 'Class is required',
              })}
            />

            <Input
              label="Subject"
              type="text"
              placeholder="Mathematics"
              error={errors.subjectId?.message}
              {...register('subjectId', {
                required: 'Subject is required',
              })}
            />

            <Input
              label="Teacher"
              type="text"
              placeholder="John Doe"
              error={errors.teacherId?.message}
              {...register('teacherId', {
                required: 'Teacher is required',
              })}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Day of Week
              </label>
              <select
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                {...register('day')}
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Time & Location */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Time & Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime', {
                required: 'Start time is required',
              })}
            />

            <Input
              label="End Time"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime', {
                required: 'End time is required',
              })}
            />

            <Input
              label="Room/Classroom"
              type="text"
              placeholder="Room 101"
              error={errors.room?.message}
              {...register('room')}
            />

            <Input
              label="Room Capacity"
              type="number"
              placeholder="40"
              error={errors.capacity?.message}
              {...register('capacity')}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Status</h3>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Current Status
            </label>
            <select
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              {...register('status')}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
          >
            {initialData ? 'Update Timetable Entry' : 'Create Timetable Entry'}
          </Button>
          <Button
            type="reset"
            variant="secondary"
            size="md"
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default TimetableForm;
