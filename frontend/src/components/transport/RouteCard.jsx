import React from 'react';
import { Card } from '../common/index.js';

function RouteCard({ routeData, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-50 text-green-700',
      INACTIVE: 'bg-gray-50 text-gray-700',
      MAINTENANCE: 'bg-orange-50 text-orange-700',
    };
    return colors[status] || 'bg-blue-50 text-blue-700';
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">{routeData.routeName}</h3>
            <p className="text-sm text-secondary-600 mt-1">
              {routeData.capacity} Seats • ₹{routeData.fare}/month
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(routeData.status)}`}>
            {routeData.status}
          </span>
        </div>

        <div className="border-t border-secondary-200 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">📍 Start Point</span>
            <span className="font-semibold text-secondary-900">{routeData.startPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">📍 End Point</span>
            <span className="font-semibold text-secondary-900">{routeData.endPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Distance</span>
            <span className="font-semibold text-secondary-900">{routeData.distance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Schedule</span>
            <span className="font-semibold text-secondary-900">
              {formatTime(routeData.pickupTime)} - {formatTime(routeData.dropTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Vehicle</span>
            <span className="font-semibold text-secondary-900">{routeData.vehicleId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Driver</span>
            <span className="font-semibold text-secondary-900">{routeData.driverId}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(routeData._id)}
            className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(routeData._id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

export default RouteCard;
