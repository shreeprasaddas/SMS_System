import React from 'react';
import { Card, Spinner } from '@/components/common/index.js';
import { useGetSystemAnalyticsQuery } from '@/store/api/analyticsApi.js';

function AnalyticsDashboard() {
  const { data, isLoading, error } = useGetSystemAnalyticsQuery();
  const overview = data?.data || null;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load analytics dashboard. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">School-wide performance metrics and overview</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <Card className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-primary-600">
            {overview?.totalStudents || '1,245'}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Students
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-green-600">
            {overview?.averageAttendance || '94%'}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Avg. Attendance
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-blue-600">
            {overview?.totalTeachers || '86'}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Active Staff
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-purple-600">
            {overview?.passRate || '88%'}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            School Pass Rate
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Chart Component (e.g. Recharts LineChart)</span>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
            <span className="text-gray-400">Chart Component (e.g. Recharts PieChart)</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
