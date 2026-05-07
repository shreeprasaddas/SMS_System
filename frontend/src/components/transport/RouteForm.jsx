import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../common/index.js';

function RouteForm({ initialData, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      routeName: '',
      startPoint: '',
      endPoint: '',
      distance: '0',
      pickupTime: '07:00',
      dropTime: '16:00',
      vehicleId: '',
      driverId: '',
      capacity: '40',
      fare: '0',
      status: 'ACTIVE',
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Route Information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Route Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Route Name"
              type="text"
              placeholder="Route A - Downtown"
              error={errors.routeName?.message}
              {...register('routeName', {
                required: 'Route name is required',
              })}
            />

            <Input
              label="Distance (km)"
              type="number"
              placeholder="25"
              error={errors.distance?.message}
              {...register('distance')}
            />

            <Input
              label="Start Point"
              type="text"
              placeholder="School Main Gate"
              error={errors.startPoint?.message}
              {...register('startPoint', {
                required: 'Start point is required',
              })}
            />

            <Input
              label="End Point"
              type="text"
              placeholder="Downtown Terminal"
              error={errors.endPoint?.message}
              {...register('endPoint', {
                required: 'End point is required',
              })}
            />
          </div>
        </div>

        {/* Schedule & Capacity */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Schedule & Capacity</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pickup Time"
              type="time"
              error={errors.pickupTime?.message}
              {...register('pickupTime')}
            />

            <Input
              label="Drop Time"
              type="time"
              error={errors.dropTime?.message}
              {...register('dropTime')}
            />

            <Input
              label="Capacity"
              type="number"
              placeholder="40"
              error={errors.capacity?.message}
              {...register('capacity')}
            />

            <Input
              label="Monthly Fare (₹)"
              type="number"
              placeholder="5000"
              error={errors.fare?.message}
              {...register('fare')}
            />
          </div>
        </div>

        {/* Vehicle & Driver Assignment */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assignment</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vehicle"
              type="text"
              placeholder="Vehicle ID or Name"
              error={errors.vehicleId?.message}
              {...register('vehicleId', {
                required: 'Vehicle is required',
              })}
            />

            <Input
              label="Driver"
              type="text"
              placeholder="Driver Name"
              error={errors.driverId?.message}
              {...register('driverId', {
                required: 'Driver is required',
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Under Maintenance</option>
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
            {initialData ? 'Update Route' : 'Create Route'}
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

export default RouteForm;
