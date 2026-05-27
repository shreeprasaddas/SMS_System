import React, { useState, useCallback } from 'react';
import { Input, Button, Select } from '@/components/common';

function ConcessionForm({ initialData = {}, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    type: initialData.type || 'PERCENTAGE',
    value: initialData.value || '',
    description: initialData.description || '',
  });

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit?.(formData);
  }, [onSubmit, formData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Concession Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="e.g. Merit Scholarship, Sibling Discount"
        />
        <Select
          label="Discount Type"
          value={formData.type}
          onChange={(val) => handleChange('type', val)}
          options={[
            { label: 'Percentage (%)', value: 'PERCENTAGE' },
            { label: 'Fixed Amount', value: 'FIXED_AMOUNT' },
          ]}
          required
        />
        <Input
          label="Discount Value"
          type="number"
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          required
          placeholder="e.g. 50 for 50% or 5000 for amount"
        />
        <Input
          label="Description / Reason"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief details explaining the discount terms"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Save Concession
        </Button>
      </div>
    </form>
  );
}

export default ConcessionForm;
