import React from 'react';
import { Input } from '@/components/common';

function ParentInfoStep({ data = {}, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Guardian Name"
        value={data.guardianName || ''}
        onChange={(e) => onChange('guardianName', e.target.value)}
        required
      />
      <Input
        label="Relationship to Student"
        value={data.guardianRelation || ''}
        onChange={(e) => onChange('guardianRelation', e.target.value)}
        required
      />
      <Input
        label="Guardian Phone"
        type="tel"
        value={data.guardianPhone || ''}
        onChange={(e) => onChange('guardianPhone', e.target.value)}
        required
      />
      <Input
        label="Guardian Email"
        type="email"
        value={data.guardianEmail || ''}
        onChange={(e) => onChange('guardianEmail', e.target.value)}
        required
      />
      <Input
        label="Guardian Occupation"
        value={data.guardianOccupation || ''}
        onChange={(e) => onChange('guardianOccupation', e.target.value)}
      />
      <Input
        label="Emergency Contact Number"
        type="tel"
        value={data.emergencyContact || ''}
        onChange={(e) => onChange('emergencyContact', e.target.value)}
        required
      />
    </div>
  );
}

export default ParentInfoStep;
