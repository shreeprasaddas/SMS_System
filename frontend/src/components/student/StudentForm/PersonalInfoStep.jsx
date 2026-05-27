import React from 'react';
import { Input, Select } from '@/components/common';

function PersonalInfoStep({ data = {}, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="First Name"
        value={data.firstName || ''}
        onChange={(e) => onChange('firstName', e.target.value)}
        required
      />
      <Input
        label="Last Name"
        value={data.lastName || ''}
        onChange={(e) => onChange('lastName', e.target.value)}
        required
      />
      <Input
        label="Date of Birth"
        type="date"
        value={data.dateOfBirth || ''}
        onChange={(e) => onChange('dateOfBirth', e.target.value)}
        required
      />
      <Select
        label="Gender"
        value={data.gender || ''}
        onChange={(val) => onChange('gender', val)}
        options={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ]}
        required
      />
      <Input
        label="Roll Number"
        value={data.rollNumber || ''}
        onChange={(e) => onChange('rollNumber', e.target.value)}
        required
      />
      <Input
        label="Admission Number"
        value={data.admissionNumber || ''}
        onChange={(e) => onChange('admissionNumber', e.target.value)}
        required
      />
    </div>
  );
}

export default PersonalInfoStep;
