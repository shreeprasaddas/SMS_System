import React, { useState } from 'react';
import { useGetFeeReportQuery } from '@/store/api/feeApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { Card, Button, Spinner } from '@/components/common/index.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6366f1', '#06b6d4'];

function FeesReportPage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', classId: '', status: '' });
  const { data, isLoading, error } = useGetFeeReportQuery(filters);
  const { data: classesData } = useGetClassesQuery({ limit: 50 });

  const classes = classesData?.data?.classes || classesData?.data || [];
  const report = data?.data || {};

  const statusData = [
    { name: 'Paid', value: report.paidCount || 0, color: '#22c55e' },
    { name: 'Pending', value: report.pendingCount || 0, color: '#f59e0b' },
    { name: 'Overdue', value: report.overdueCount || 0, color: '#ef4444' },
    { name: 'Partial', value: report.partialCount || 0, color: '#6366f1' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Fee Reports</h1>
        <p className="text-secondary-600 mt-1">Analyze fee collection and outstanding dues</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Class</label>
            <select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name || cls.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ startDate: '', endDate: '', classId: '', status: '' })}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800 text-center">Failed to load fee report data</p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="bg-green-50 border-green-100">
              <p className="text-sm text-green-700 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                ₹{(report.totalCollected || 0).toLocaleString()}
              </p>
            </Card>
            <Card className="bg-yellow-50 border-yellow-100">
              <p className="text-sm text-yellow-700 font-medium">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-800 mt-1">
                ₹{(report.totalPending || 0).toLocaleString()}
              </p>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <p className="text-sm text-red-700 font-medium">Total Overdue</p>
              <p className="text-2xl font-bold text-red-800 mt-1">
                ₹{(report.totalOverdue || 0).toLocaleString()}
              </p>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <p className="text-sm text-blue-700 font-medium">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {report.collectionRate || '—'}%
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Fee Status Distribution</h3>
              {statusData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={55}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-secondary-400">
                  <p>No data available for chart</p>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Collection Summary</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Collected', amount: report.totalCollected || 0 },
                      { name: 'Pending', amount: report.totalPending || 0 },
                      { name: 'Overdue', amount: report.totalOverdue || 0 },
                    ]}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default FeesReportPage;
