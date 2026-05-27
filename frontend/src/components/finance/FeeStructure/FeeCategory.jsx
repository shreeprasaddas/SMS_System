import React, { useState } from 'react';
import { Card, Button, Input, Table } from '@/components/common';

function FeeCategory({ categories = [], onAddCategory, onDeleteCategory }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCategory?.(name.trim());
    setName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-white p-6 shadow-sm border border-secondary-200">
        <h3 className="font-semibold text-secondary-900 mb-4">Add Fee Category</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Admission Fee, Tuition Fee"
          />
          <Button type="submit" variant="primary" className="w-full">
            Create Category
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2 bg-white p-6 shadow-sm border border-secondary-200">
        <h3 className="font-semibold text-secondary-900 mb-4">Existing Fee Categories</h3>
        <Table
          headers={['Category Name', 'Actions']}
          data={categories}
          emptyMessage="No fee categories added yet."
          renderRow={(cat, idx) => (
            <>
              <td className="px-6 py-4 font-medium text-secondary-900">{cat.name || cat}</td>
              <td className="px-6 py-4 text-right">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteCategory?.(cat._id || cat)}
                >
                  Delete
                </Button>
              </td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

export default FeeCategory;
