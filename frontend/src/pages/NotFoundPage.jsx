import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-secondary-600 mb-6">
            Sorry, the page you're looking for doesn't exist.
          </p>

          <Link to="/">
            <Button variant="primary" size="md" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default NotFoundPage;
