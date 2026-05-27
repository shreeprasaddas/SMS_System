import React from 'react';
import { Table, Button } from '@/components/common';

function ConcessionList({ concessions = [], onEdit, onDelete }) {
  return (
    <Table
      headers={['Name', 'Type', 'Discount Value', 'Description', 'Actions']}
      data={concessions}
      emptyMessage="No fee concessions or discounts configured yet."
      renderRow={(con, i) => (
        <>
          <td className="px-6 py-4 font-semibold text-secondary-900">{con.name}</td>
          <td className="px-6 py-4 text-sm text-secondary-600">{con.type}</td>
          <td className="px-6 py-4 font-mono text-sm">
            {con.type === 'PERCENTAGE' ? `${con.value}%` : `$${con.value}`}
          </td>
          <td className="px-6 py-4 text-sm text-secondary-500">{con.description || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(con)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete?.(con)}>Delete</Button>
            </div>
          </td>
        </>
      )}
    />
  );
}

export default ConcessionList;
