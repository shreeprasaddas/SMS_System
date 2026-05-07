import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../common/index.js';

function AssignmentForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      classId: '',
      subjectId: '',
      dueDate: '',
      totalMarks: '100',
      assignmentType: 'HOMEWORK',
      attachments: '',
      status: 'ACTIVE',
      instructions: '',
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Assignment Title"
              type="text"
              placeholder="Chapter 5: Algebra Problems"
              error={errors.title?.message}
              {...register('title', {
                required: 'Assignment title is required',
              })}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the assignment..."
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                {...register('description', {
                  required: 'Description is required',
                })}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assignment Details</h3>
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
              label="Due Date"
              type="date"
              error={errors.dueDate?.message}
              {...register('dueDate', {
                required: 'Due date is required',
              })}
            />

            <Input
              label="Total Marks"
              type="number"
              placeholder="100"
              error={errors.totalMarks?.message}
              {...register('totalMarks', {
                required: 'Total marks is required',
              })}
            />
          </div>
        </div>

        {/* Assignment Type & Status */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Type & Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assignment Type
              </label>
              <select
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                {...register('assignmentType')}
              >
                <option value="HOMEWORK">Homework</option>
                <option value="CLASS_WORK">Class Work</option>
                <option value="PROJECT">Project</option>
                <option value="QUIZ">Quiz</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                {...register('status')}
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Instructions & Attachments */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Instructions</h3>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Instructions (Optional)
            </label>
            <textarea
              placeholder="Provide detailed instructions for the assignment..."
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="3"
              {...register('instructions')}
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
            {initialData ? 'Update Assignment' : 'Create Assignment'}
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

export default AssignmentForm;
