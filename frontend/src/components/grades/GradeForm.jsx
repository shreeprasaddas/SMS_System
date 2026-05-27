import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '@/components/common';

function GradeForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      studentId: '',
      subjectId: '',
      marks: '',
      maxMarks: '100',
      grade: '',
      feedback: '',
      examType: 'MID_TERM',
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Grade Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Grade Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Student ID"
              type="text"
              placeholder="STU001"
              error={errors.studentId?.message}
              {...register('studentId', {
                required: 'Student ID is required',
              })}
            />

            <Input
              label="Subject ID"
              type="text"
              placeholder="MATH01"
              error={errors.subjectId?.message}
              {...register('subjectId', {
                required: 'Subject ID is required',
              })}
            />

            <Input
              label="Marks Obtained"
              type="number"
              placeholder="85"
              error={errors.marks?.message}
              {...register('marks', {
                required: 'Marks is required',
              })}
            />

            <Input
              label="Maximum Marks"
              type="number"
              placeholder="100"
              error={errors.maxMarks?.message}
              {...register('maxMarks', {
                required: 'Maximum marks is required',
              })}
            />
          </div>
        </div>

        {/* Grade & Exam Type */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Grade Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Grade
              </label>
              <select
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                {...register('grade')}
              >
                <option value="">Select Grade</option>
                <option value="A+">A+ (90-100)</option>
                <option value="A">A (80-89)</option>
                <option value="B">B (70-79)</option>
                <option value="C">C (60-69)</option>
                <option value="D">D (50-59)</option>
                <option value="F">F (Below 50)</option>
              </select>
            </div>

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
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Feedback</h3>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Teacher Feedback
            </label>
            <textarea
              placeholder="Add feedback for the student..."
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="4"
              {...register('feedback')}
            />
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
            {initialData ? 'Update Grade' : 'Add Grade'}
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

export default GradeForm;
