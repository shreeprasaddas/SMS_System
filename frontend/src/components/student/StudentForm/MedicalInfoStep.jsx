import React from 'react';
import { Input, Select } from '@/components/common';

function MedicalInfoStep({ data = {}, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Select
        label="Blood Group"
        value={data.bloodGroup || ''}
        onChange={(val) => onChange('bloodGroup', val)}
        options={[
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
        ]}
      />
      <Input
        label="Allergies (If any)"
        value={data.allergies || ''}
        onChange={(e) => onChange('allergies', e.target.value)}
        placeholder="e.g. Peanuts, Penicillin"
      />
      <div className="md:col-span-2">
        <Input
          label="Medical Conditions / Chronic Illness"
          value={data.medicalConditions || ''}
          onChange={(e) => onChange('medicalConditions', e.target.value)}
          placeholder="e.g. Asthma, Diabetes"
        />
      </div>
      <div className="md:col-span-2">
        <Input
          label="Additional Health/Dietary Notes"
          value={data.healthNotes || ''}
          onChange={(e) => onChange('healthNotes', e.target.value)}
        />
      </div>
    </div>
  );
}

export default MedicalInfoStep;
