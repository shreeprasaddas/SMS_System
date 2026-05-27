import React, { useState } from 'react';
import { Input, Button, Select } from '@/components/common';

function FeeStructureForm({ initialData = {}, onSubmit, onCancel, isSubmitting = false, classes = [], categories = [] }) {
  const [formData, setFormData] = useState({
    classId: initialData.classId || '',
    categoryId: initialData.categoryId || '',
    amount: initialData.amount || '',
    frequency: initialData.frequency || 'MONTHLY',
    dueDate: initialData.dueDate || '',
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
        <Select
          label="Target Class/Grade"
          value={formData.classId}
          onChange={(val) => handleChange('classId', val)}
          options={classes.map((c) => ({ label: c.name, value: c._id }))}
          required
        />
        <Select
          label="Fee Category"
          value={formData.categoryId}
          onChange={(val) => handleChange('categoryId', val)}
          options={categories.map((cat) => ({ label: cat.name, value: cat._id }))}
          required
        />
        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          required
        />
        <Select
          label="Billing Frequency"
          value={formData.frequency}
          onChange={(val) => handleChange('frequency', val)}
          options={[
            { label: 'One Time', value: 'ONE_TIME' },
            { label: 'Monthly', value: 'MONTHLY' },
            { label: 'Quarterly', value: 'QUARTERLY' },
            { label: 'Annually', value: 'ANNUALLY' },
          ]}
          required
        />
        <Input
          label="Payment Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Save Fee Structure
        </Button>
      </div>
    </form>
  );
}

export default FeeStructureForm;
