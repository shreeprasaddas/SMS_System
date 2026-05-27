import React from 'react';
import { Input, Select } from '@/components/common';

function PersonalDetails({ data = {}, onChange }) {
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
        label="Email"
        type="email"
        value={data.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        value={data.phone || ''}
        onChange={(e) => onChange('phone', e.target.value)}
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
        label="Joining Date"
        type="date"
        value={data.joiningDate || ''}
        onChange={(e) => onChange('joiningDate', e.target.value)}
        required
      />
    </div>
  );
}

export default PersonalDetails;
