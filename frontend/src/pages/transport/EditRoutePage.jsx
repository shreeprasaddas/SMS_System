import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRouteByIdQuery, useUpdateRouteMutation } from '@/store/api/transportApi.js';
import { RouteForm } from '@/components/transport/index.js';
import { Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function EditRoutePage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isFetching } = useGetRouteByIdQuery(routeId);
  const [updateRoute, { isLoading }] = useUpdateRouteMutation();

  const route = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateRoute({ id: routeId, ...data }).unwrap();
      toast.success('Route updated successfully');
      navigate('/transport/routes');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update route');
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Edit Transport Route</h1>
        <p className="text-secondary-600 mt-1">{route?.routeName}</p>
      </div>

      <RouteForm
        initialData={route}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditRoutePage;
