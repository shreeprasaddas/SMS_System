import React from 'react';
import { Input } from '@/components/common';

function ContactInfoStep({ data = {}, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="md:col-span-2">
        <Input
          label="Address Line"
          value={data.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          required
        />
      </div>
      <Input
        label="City"
        value={data.city || ''}
        onChange={(e) => onChange('city', e.target.value)}
        required
      />
      <Input
        label="State/Province"
        value={data.state || ''}
        onChange={(e) => onChange('state', e.target.value)}
        required
      />
      <Input
        label="Postal Code"
        value={data.postalCode || ''}
        onChange={(e) => onChange('postalCode', e.target.value)}
        required
      />
    </div>
  );
}

export default ContactInfoStep;
