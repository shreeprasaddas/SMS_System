import React from 'react';
import { Outlet } from 'react-router-dom';

function PrintLayout() {
  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-0 print:m-0">
      <Outlet />
    </div>
  );
}

export default PrintLayout;
