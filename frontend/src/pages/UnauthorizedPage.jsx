import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button.jsx';

function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-red-500 text-6xl mb-4 font-bold">403</div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Access Denied</h1>
      <p className="text-secondary-600 mb-6 max-w-md">
        You do not have the required permissions to access this page. Please contact your system administrator if you believe this is in error.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
