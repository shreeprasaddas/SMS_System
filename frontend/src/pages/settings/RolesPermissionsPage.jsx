import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Table from '@/components/common/Table/Table.jsx';
import Button from '@/components/common/Button.jsx';
import { useNotifications } from '@/hooks/useNotifications.js';

const mockPermissions = [
  { module: 'Students', view: true, create: true, edit: true, delete: false },
  { module: 'Teachers', view: true, create: true, edit: true, delete: false },
  { module: 'Fees', view: true, create: true, edit: false, delete: false },
  { module: 'Grades', view: true, create: true, edit: true, delete: true },
  { module: 'Timetables', view: true, create: true, edit: true, delete: true },
  { module: 'Settings', view: true, create: false, edit: false, delete: false },
];

function RolesPermissionsPage() {
  const [role, setRole] = useState('ADMIN');
  const { toast } = useNotifications();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast('success', `Permissions for ${role} updated successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Configure role-based access control rules for school roles"
        actions={
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="font-semibold text-secondary-900 mb-4 text-sm uppercase">Select Role</h3>
          <div className="space-y-2">
            {['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT', 'LIBRARIAN'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  role === r ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-3">
          <h3 className="font-semibold text-secondary-900 mb-4">Module Permissions Matrix</h3>
          <Table
            headers={['Module', 'View', 'Create', 'Edit', 'Delete']}
            data={mockPermissions}
            renderRow={(row, i) => (
              <>
                <td className="px-6 py-4 font-medium text-secondary-900">{row.module}</td>
                <td className="px-6 py-4">
                  <input type="checkbox" defaultChecked={row.view} className="rounded text-primary-600 focus:ring-primary-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="checkbox" defaultChecked={row.create} className="rounded text-primary-600 focus:ring-primary-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="checkbox" defaultChecked={row.edit} className="rounded text-primary-600 focus:ring-primary-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="checkbox" defaultChecked={row.delete} className="rounded text-primary-600 focus:ring-primary-500" />
                </td>
              </>
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default RolesPermissionsPage;
