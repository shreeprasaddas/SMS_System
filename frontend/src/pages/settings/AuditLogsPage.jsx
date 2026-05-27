import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Table from '@/components/common/Table/Table.jsx';
import StatusBadge from '@/components/common/StatusBadge/StatusBadge.jsx';
import SearchBar from '@/components/common/SearchBar/SearchBar.jsx';

const mockLogs = [
  { id: 1, user: 'admin@school.com', action: 'Update System Settings', module: 'Settings', ip: '192.168.1.10', timestamp: '2026-05-22 10:14:02', status: 'success' },
  { id: 2, user: 'finance@school.com', action: 'Record Fee Payment', module: 'Finance', ip: '192.168.1.25', timestamp: '2026-05-22 09:44:11', status: 'success' },
  { id: 3, user: 'principal@school.com', action: 'Edit Teacher Profile', module: 'Academics', ip: '192.168.1.5', timestamp: '2026-05-22 08:30:15', status: 'success' },
  { id: 4, user: 'librarian@school.com', action: 'Issue Book (ID: B104)', module: 'Library', ip: '192.168.1.18', timestamp: '2026-05-22 08:15:00', status: 'success' },
  { id: 5, user: 'unknown@school.com', action: 'Failed Login Attempt', module: 'Auth', ip: '203.0.113.50', timestamp: '2026-05-22 07:11:59', status: 'danger' },
];

function AuditLogsPage() {
  const [search, setSearch] = useState('');

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="System Audit Logs" subtitle="Track user actions and critical changes across modules" />
      <Card>
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Filter audit logs..." />
        </div>
        <Table
          headers={['User', 'Action', 'Module', 'IP Address', 'Timestamp', 'Status']}
          data={filteredLogs}
          renderRow={(row, i) => (
            <>
              <td className="px-6 py-4 font-medium text-secondary-900">{row.user}</td>
              <td className="px-6 py-4">{row.action}</td>
              <td className="px-6 py-4">{row.module}</td>
              <td className="px-6 py-4 font-mono text-xs">{row.ip}</td>
              <td className="px-6 py-4 text-secondary-500">{row.timestamp}</td>
              <td className="px-6 py-4">
                <StatusBadge variant={row.status === 'success' ? 'success' : 'danger'}>
                  {row.status.toUpperCase()}
                </StatusBadge>
              </td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

export default AuditLogsPage;
