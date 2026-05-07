import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRouteMutation } from '../../store/api/transportApi.js';
import { RouteForm } from '../../components/transport/index.js';
import toast from 'react-hot-toast';

function CreateRoutePage() {
  const navigate = useNavigate();
  const [createRoute, { isLoading }] = useCreateRouteMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createRoute(data).unwrap();
      toast.success('Route created successfully');
      navigate('/transport/routes');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create route');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Add Transport Route</h1>
        <p className="text-secondary-600 mt-1">Create a new bus route with schedule and assignments</p>
      </div>

      <RouteForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateRoutePage;
