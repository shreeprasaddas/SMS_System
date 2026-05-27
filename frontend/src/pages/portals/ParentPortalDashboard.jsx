import React from 'react';
import { Card, Button, Badge, Spinner } from '@/components/common';
import { useGetParentDashboardQuery } from '@/store/api/parentPortalApi.js';
import { AcademicCapIcon, CalendarIcon, DocumentTextIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

function ParentPortalDashboard() {
  const { data: dashboardData, isLoading } = useGetParentDashboardQuery();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-2/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 flex items-center justify-center">
              <Spinner />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const children = dashboardData?.data?.children || [];
  const announcements = dashboardData?.data?.recentAnnouncements || [];
  const fees = dashboardData?.data?.pendingFees || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back. Here is an overview of your children's progress.</p>
      </div>

      {children.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            No enrolled children found linked to your account. Please contact administration.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child._id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge variant={child.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {child.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {child.user?.firstName?.[0]}{child.user?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {child.user?.firstName} {child.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {child.currentClass?.name} | Roll No: {child.rollNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span className="flex items-center gap-2"><AcademicCapIcon className="w-5 h-5"/> Attendance</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </Button>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span className="flex items-center gap-2"><DocumentTextIcon className="w-5 h-5"/> Recent Grades</span>
                  <span>View &rarr;</span>
                </Button>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <span className="flex items-center gap-2"><CalendarIcon className="w-5 h-5"/> Timetable</span>
                  <span>View &rarr;</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="w-6 h-6 text-gray-500" />
            Pending Fees Due
          </h2>
          {fees.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending fees.</p>
          ) : (
            <div className="space-y-3">
              {fees.map((fee, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-red-900">{fee.feeStructure?.feeType?.name || 'Term Fee'}</p>
                    <p className="text-xs text-red-700">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-700">${fee.amount - (fee.paidAmount || 0)}</p>
                    <Button size="sm" variant="danger" className="mt-1">Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">School Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent announcements.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann, idx) => (
                <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{ann.title}</h3>
                    <span className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}

export default ParentPortalDashboard;
