import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from '@/components/common/index.js';
import { useGetStudentsQuery } from '@/store/api/studentApi.js';
import { useGetTeachersQuery } from '@/store/api/teacherApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';

function ReportsPage() {
  const navigate = useNavigate();

  // Fetch real stats
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery({ limit: 1 });
  const { data: teachersData, isLoading: teachersLoading } = useGetTeachersQuery({ limit: 1 });
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery({ limit: 1 });

  const totalStudents = studentsData?.data?.pagination?.total || 0;
  const totalTeachers = teachersData?.data?.pagination?.total || 0;
  const totalClasses = classesData?.data?.pagination?.total || 0;

  const reports = [
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Track student attendance patterns and trends',
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      path: '/reports/attendance',
    },
    {
      id: 'performance',
      title: 'Performance Report',
      description: 'Analyze student academic performance and grades',
      icon: '📊',
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      path: '/reports/performance',
    },
    {
      id: 'finance',
      title: 'Finance Report',
      description: 'Monitor fee collection and financial transactions',
      icon: '💰',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      path: '/reports/finance',
    },
    {
      id: 'school',
      title: 'School Report',
      description: 'Comprehensive overview of all school operations',
      icon: '🏫',
      color: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      path: '/reports/school',
    },
  ];

  const isLoading = studentsLoading || teachersLoading || classesLoading;

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
          <div
            key={report.id}
            onClick={() => navigate(report.path)}
            className="bg-white rounded-xl border border-secondary-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className={`bg-gradient-to-r ${report.color} p-4`}>
              <span className="text-4xl">{report.icon}</span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                {report.title}
              </h3>
              <p className="text-sm text-secondary-600 mt-1">
                {report.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(report.path);
                }}
              >
                View Report →
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStat
          label="Total Students"
          value={totalStudents}
          color="text-primary-600"
          note="As of today"
          loading={studentsLoading}
        />
        <QuickStat
          label="Total Teachers"
          value={totalTeachers}
          color="text-green-600"
          note="Active staff"
          loading={teachersLoading}
        />
        <QuickStat
          label="Total Classes"
          value={totalClasses}
          color="text-blue-600"
          note="Current session"
          loading={classesLoading}
        />
        <QuickStat
          label="Avg Performance"
          value="—"
          color="text-purple-600"
          note="Last exam"
          loading={false}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value, color, note, loading }) {
  return (
    <Card>
      <p className="text-sm text-secondary-600 font-medium">{label}</p>
      {loading ? (
        <div className="mt-2"><Spinner size="sm" /></div>
      ) : (
        <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
      )}
      <p className="text-xs text-secondary-500 mt-2">{note}</p>
    </Card>
  );
}

export default ReportsPage;
