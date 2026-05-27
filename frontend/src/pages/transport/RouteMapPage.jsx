import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRoutesQuery } from '@/store/api/transportApi.js';
import { Card, Button, Spinner } from '@/components/common/index.js';

function RouteMapPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: 'ACTIVE' });

  const { data: response, isLoading } = useGetRoutesQuery(filters);

  const routes = response?.data?.routes || [];

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 border-green-500',
      INACTIVE: 'bg-gray-100 border-gray-500',
      MAINTENANCE: 'bg-orange-100 border-orange-500',
    };
    return colors[status] || 'bg-blue-100 border-blue-500';
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Route Map</h1>
          <p className="text-secondary-600 mt-1">Visual overview of all transport routes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/transport/routes')}
          >
            List View
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/transport/routes/create')}
          >
            + Add Route
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      <Card>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="ACTIVE"
              checked={filters.status === 'ACTIVE'}
              onChange={(e) => setFilters({ status: e.target.value })}
            />
            <span className="text-secondary-700">Active Routes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="INACTIVE"
              checked={filters.status === 'INACTIVE'}
              onChange={(e) => setFilters({ status: e.target.value })}
            />
            <span className="text-secondary-700">Inactive Routes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value=""
              checked={filters.status === ''}
              onChange={(e) => setFilters({ status: e.target.value })}
            />
            <span className="text-secondary-700">All Routes</span>
          </label>
        </div>
      </Card>

      {/* Routes Overview */}
      <div className="grid grid-cols-1 gap-6">
        {routes.map((route) => (
          <Card key={route._id} className={`border-l-4 ${getStatusColor(route.status)}`}>
            <div className="grid grid-cols-12 gap-4">
              {/* Route Info */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold text-secondary-900">{route.routeName}</h3>
                <p className="text-sm text-secondary-600 mt-1">
                  {route.capacity} Seats • ₹{route.fare}/month
                </p>
              </div>

              {/* Route Details */}
              <div className="col-span-3 space-y-2">
                <div className="text-sm">
                  <p className="text-secondary-600">From:</p>
                  <p className="font-semibold text-secondary-900">{route.startPoint}</p>
                </div>
                <div className="text-sm">
                  <p className="text-secondary-600">To:</p>
                  <p className="font-semibold text-secondary-900">{route.endPoint}</p>
                </div>
              </div>

              {/* Schedule & Distance */}
              <div className="col-span-3 space-y-2">
                <div className="text-sm">
                  <p className="text-secondary-600">Schedule:</p>
                  <p className="font-semibold text-secondary-900">
                    {formatTime(route.pickupTime)} → {formatTime(route.dropTime)}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-secondary-600">Distance:</p>
                  <p className="font-semibold text-secondary-900">{route.distance} km</p>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/transport/routes/${route._id}/edit`)}
                  className="px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/transport/routes/${route._id}`)}
                  className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Details
                </button>
              </div>
            </div>

            {/* Driver & Vehicle */}
            <div className="mt-4 pt-4 border-t border-secondary-200 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-600">Driver</p>
                <p className="font-semibold text-secondary-900">{route.driverId}</p>
              </div>
              <div>
                <p className="text-secondary-600">Vehicle</p>
                <p className="font-semibold text-secondary-900">{route.vehicleId}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {routes.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-secondary-600 mb-4">No routes found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/transport/routes/create')}
          >
            Create First Route
          </Button>
        </Card>
      )}
    </div>
  );
}

export default RouteMapPage;
