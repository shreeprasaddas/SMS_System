import React from 'react';
import { Card, StatusBadge } from '@/components/common';

function ActivitiesTab({ activities = [] }) {
  const mockActivities = [
    { id: 1, name: 'Science Club', type: 'Club', role: 'Member', joinedDate: '2025-09-10' },
    { id: 2, name: 'Annual Sports Day', type: 'Event', role: 'Participant', joinedDate: '2025-11-20' },
    { id: 3, name: 'School Choir', type: 'Music', role: 'Vocalist', joinedDate: '2026-01-15' },
  ];

  const list = activities.length > 0 ? activities : mockActivities;

  return (
    <Card className="bg-white p-6 shadow-sm border border-secondary-200">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Co-Curricular & Extracurricular Activities</h3>
      <div className="divide-y divide-secondary-100">
        {list.map((act) => (
          <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
            <div>
              <p className="font-semibold text-secondary-900">{act.name}</p>
              <p className="text-xs text-secondary-500">{act.type} &bull; Joined: {act.joinedDate}</p>
            </div>
            <StatusBadge variant="info">{act.role}</StatusBadge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ActivitiesTab;
