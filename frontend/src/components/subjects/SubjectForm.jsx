import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../common/index.js';

function SubjectForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      code: '',
      description: '',
      creditHours: '4',
      syllabus: '',
      departmentId: '',
      maxMarks: '100',
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
              label="Subject Name"
              type="text"
              placeholder="Mathematics"
              error={errors.name?.message}
              {...register('name', {
                required: 'Subject name is required',
              })}
            />

            <Input
              label="Subject Code"
              type="text"
              placeholder="MATH101"
              error={errors.code?.message}
              {...register('code', {
                required: 'Subject code is required',
              })}
            />

            <Input
              label="Credit Hours"
              type="number"
              placeholder="4"
              error={errors.creditHours?.message}
              {...register('creditHours', {
                required: 'Credit hours is required',
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

        {/* Department & Details */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Details</h3>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Department ID
            </label>
            <select
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              {...register('departmentId')}
            >
              <option value="">Select Department</option>
              <option value="SCIENCE">Science</option>
              <option value="MATH">Mathematics</option>
              <option value="HUMANITIES">Humanities</option>
              <option value="COMMERCE">Commerce</option>
            </select>
          </div>
        </div>

        {/* Syllabus & Description */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Curriculum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Subject description and overview..."
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                {...register('description')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Syllabus
              </label>
              <textarea
                placeholder="Detailed syllabus and course outline..."
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="4"
                {...register('syllabus')}
              />
            </div>
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
            {initialData ? 'Update Subject' : 'Create Subject'}
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

export default SubjectForm;
