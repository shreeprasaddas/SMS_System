import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Card } from '../common/index.js';

function ClassForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      section: '',
      teacherId: '',
      classTeacher: '',
      academicYear: new Date().getFullYear().toString(),
      capacity: '',
      description: '',
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
              label="Class Name"
              type="text"
              placeholder="Class 10-A"
              error={errors.name?.message}
              {...register('name', {
                required: 'Class name is required',
              })}
            />

            <Input
              label="Section"
              type="text"
              placeholder="A"
              error={errors.section?.message}
              {...register('section', {
                required: 'Section is required',
              })}
            />

            <Input
              label="Academic Year"
              type="text"
              placeholder="2024"
              error={errors.academicYear?.message}
              {...register('academicYear', {
                required: 'Academic year is required',
              })}
            />

            <Input
              label="Class Capacity"
              type="number"
              placeholder="50"
              error={errors.capacity?.message}
              {...register('capacity', {
                required: 'Capacity is required',
              })}
            />
          </div>
        </div>

        {/* Teacher Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Teacher Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class Teacher"
              type="text"
              placeholder="John Smith"
              error={errors.classTeacher?.message}
              {...register('classTeacher', {
                required: 'Class teacher is required',
              })}
            />

            <Input
              label="Teacher ID"
              type="text"
              placeholder="TEACH-001"
              error={errors.teacherId?.message}
              {...register('teacherId', {
                required: 'Teacher ID is required',
              })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Additional Details</h3>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Class description and notes..."
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="4"
              {...register('description')}
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
            {initialData ? 'Update Class' : 'Create Class'}
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

export default ClassForm;
