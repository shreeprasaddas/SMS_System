import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/common/index.js';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// In a real app, you'd fetch the route details and allocated students via transportApi
function RouteDetailPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Details</h1>
          <p className="text-gray-500">Route ID: {routeId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Stops & Schedule</h2>
            <div className="text-center py-8 text-gray-500">
              Stop list will render here.
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Allocated Students</h2>
            <div className="text-center py-8 text-gray-500">
              Student roster will render here.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RouteDetailPage;
