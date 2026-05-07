import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/common/index.js';

function ReportsPage() {
  const navigate = useNavigate();

  const reports = [
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Track student attendance patterns and trends',
      icon: '📋',
      color: 'blue',
      path: '/reports/attendance',
    },
    {
      id: 'performance',
      title: 'Performance Report',
      description: 'Analyze student academic performance and grades',
      icon: '📊',
      color: 'green',
      path: '/reports/performance',
    },
    {
      id: 'finance',
      title: 'Finance Report',
      description: 'Monitor fee collection and financial transactions',
      icon: '💰',
      color: 'purple',
      path: '/reports/finance',
    },
    {
      id: 'school',
      title: 'School Report',
      description: 'Comprehensive overview of all school operations',
      icon: '🏫',
      color: 'indigo',
      path: '/reports/school',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Reports & Analytics</h1>
        <p className="text-secondary-600 mt-1">
          Generate detailed reports and analytics for school operations
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(report.path)}
          >
            <div className="space-y-4">
              <div className="text-5xl">{report.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {report.title}
                </h3>
                <p className="text-sm text-secondary-600 mt-1">
                  {report.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(report.path);
                }}
              >
                View Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <p className="text-sm text-secondary-600 font-medium">Total Students</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-xs text-secondary-600 mt-2">As of today</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600 font-medium">Avg Attendance</p>
          <p className="text-3xl font-bold text-green-600 mt-2">0%</p>
          <p className="text-xs text-secondary-600 mt-2">This month</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600 font-medium">Fees Collected</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">$0</p>
          <p className="text-xs text-secondary-600 mt-2">This term</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary-600 font-medium">Avg Performance</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">0%</p>
          <p className="text-xs text-secondary-600 mt-2">Last exam</p>
        </Card>
      </div>
    </div>
  );
}

export default ReportsPage;
