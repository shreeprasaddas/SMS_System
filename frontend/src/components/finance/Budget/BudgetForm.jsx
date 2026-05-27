import React, { useState } from 'react';
import { Input, Button, Select } from '@/components/common';

function BudgetForm({ initialData = {}, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || '',
    amount: initialData.amount || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Budget Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          placeholder="e.g. Science Laboratory Upgrade"
        />
        <Select
          label="Category"
          value={formData.category}
          onChange={(val) => handleChange('category', val)}
          options={[
            { label: 'Infrastructure', value: 'INFRASTRUCTURE' },
            { label: 'Salaries', value: 'SALARIES' },
            { label: 'Extracurricular', value: 'EXTRACURRICULAR' },
            { label: 'Academics', value: 'ACADEMICS' },
            { label: 'Operations', value: 'OPERATIONS' },
          ]}
          required
        />
        <Input
          label="Target Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          required
        />
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Save Budget
        </Button>
      </div>
    </form>
  );
}

export default BudgetForm;
