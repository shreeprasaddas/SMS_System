import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card.jsx';

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-1">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="0"
          icon="👨‍🎓"
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value="0"
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="Fee Collection"
          value="$0"
          icon="💰"
          color="yellow"
        />
        <StatCard
          title="Attendance Rate"
          value="0%"
          icon="📊"
          color="purple"
        />
      </div>

      {/* Welcome Message */}
      <Card>
        <h2 className="text-xl font-bold text-secondary-900 mb-2">
          Welcome to School Management System
        </h2>
        <p className="text-secondary-600">
          This is your dashboard. Features for managing students, teachers, finances, and analytics
          will be added in the upcoming phases.
        </p>
        <p className="text-secondary-500 text-sm mt-4">
          Current Phase: 1 - Foundation & Core Setup (Complete)
        </p>
      </Card>

      {/* Upcoming Features */}
      <Card>
        <h3 className="text-lg font-bold text-secondary-900 mb-4">
          Upcoming Features
        </h3>
        <ul className="space-y-2 text-secondary-700">
          <li>✓ Phase 1: Foundation & Core Setup (Complete)</li>
          <li>• Phase 2: Student Management</li>
          <li>• Phase 3: Teacher Management</li>
          <li>• Phase 4: Finance & Revenue</li>
          <li>• Phase 5: Analytics & Reporting</li>
          <li>• Phase 6: Supporting Features</li>
        </ul>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <Card className={`${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

export default DashboardPage;
