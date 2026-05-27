import React from 'react';

function SidebarGroup({ label, children }) {
  return (
    <div className="mt-4">
      <h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-500">
        {label}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default SidebarGroup;
