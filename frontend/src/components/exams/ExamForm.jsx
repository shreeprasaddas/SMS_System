import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '@/components/common';

function ExamForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      examType: 'MID_TERM',
      classId: '',
      subjectId: '',
      examDate: '',
      startTime: '',
      endTime: '',
      totalMarks: '100',
      passingMarks: '40',
      duration: '120',
      status: 'SCHEDULED',
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Exam Name"
              type="text"
              placeholder="Mathematics Mid Term"
              error={errors.name?.message}
              {...register('name', {
                required: 'Exam name is required',
              })}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Exam Type
              </label>
              <select
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                {...register('examType')}
              >
                <option value="MID_TERM">Mid Term</option>
                <option value="FINAL">Final</option>
                <option value="UNIT_TEST">Unit Test</option>
                <option value="PRACTICE">Practice</option>
              </select>
            </div>

            <Input
              label="Total Marks"
              type="number"
              placeholder="100"
              error={errors.totalMarks?.message}
              {...register('totalMarks', {
                required: 'Total marks is required',
              })}
            />

            <Input
              label="Passing Marks"
              type="number"
              placeholder="40"
              error={errors.passingMarks?.message}
              {...register('passingMarks', {
                required: 'Passing marks is required',
              })}
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Schedule</h3>
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
              label="Exam Date"
              type="date"
              error={errors.examDate?.message}
              {...register('examDate', {
                required: 'Exam date is required',
              })}
            />

            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="120"
              error={errors.duration?.message}
              {...register('duration', {
                required: 'Duration is required',
              })}
            />

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
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
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
            {initialData ? 'Update Exam' : 'Create Exam'}
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

export default ExamForm;
