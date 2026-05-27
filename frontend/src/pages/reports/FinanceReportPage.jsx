import React, { useState } from 'react';
import { useGetFinanceReportQuery } from '@/store/api/reportApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';

function FinanceReportPage() {
  const [filters, setFilters] = useState({
    classId: '',
    startDate: '',
    endDate: '',
  });

  const { data: response, isLoading } = useGetFinanceReportQuery(filters);
  const report = response?.data || {};

  const getFeeStatusColor = (status) => {
    const colors = {
      PAID: 'text-green-700 bg-green-50',
      PENDING: 'text-yellow-700 bg-yellow-50',
      OVERDUE: 'text-red-700 bg-red-50',
    };
    return colors[status] || 'text-gray-700 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Finance Report</h1>
        <p className="text-secondary-600 mt-1">
          Monitor fee collection and financial transactions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Class
            </label>
            <select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              <option value="CLASS_1">Class 1</option>
              <option value="CLASS_10">Class 10</option>
              <option value="CLASS_12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              size="md"
              className="w-full"
            >
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {report.totalStudents || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Total Fee Collected</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${report.totalCollected || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Pending Amount</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                ${report.totalPending || 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-secondary-600 font-medium">Collection Rate</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {report.collectionRate || 0}%
              </p>
            </Card>
          </div>

          {/* Fee Status Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">
              Fee Status Distribution
            </h3>
            {report.feeStatusDistribution ? (
              <div className="space-y-4">
                {Object.entries(report.feeStatusDistribution).map(([status, count]) => {
                  const percentage = report.totalStudents > 0
                    ? Math.round((count / report.totalStudents) * 100)
                    : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-secondary-900">
                          {status === 'PAID' ? 'Paid' : status === 'PENDING' ? 'Pending' : 'Overdue'}
                        </span>
                        <span className="text-sm text-secondary-600">{count} students ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            status === 'PAID'
                              ? 'bg-green-500'
                              : status === 'PENDING'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No data available</p>
            )}
          </Card>

          {/* Fee Collection by Month */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Monthly Fee Collection
            </h3>
            {report.monthlyCollection && report.monthlyCollection.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">
                        Month
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Total Due
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Amount Collected
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-900">
                        Collection %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.monthlyCollection.map((item, idx) => (
                      <tr key={idx} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="px-4 py-3 font-medium text-secondary-900">{item.month}</td>
                        <td className="px-4 py-3 text-center text-secondary-600">${item.totalDue}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">
                          ${item.collected}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700">
                            {Math.round((item.collected / item.totalDue) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-8">No data available</p>
            )}
          </Card>

          {/* Outstanding Dues */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Outstanding Dues
            </h3>
            {report.outstandingDues && report.outstandingDues.length > 0 ? (
              <div className="space-y-2">
                {report.outstandingDues.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-900">{item.studentName}</p>
                      <p className="text-sm text-secondary-600">{item.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-700 font-bold">${item.amount}</p>
                      <p className="text-xs text-secondary-600">
                        {item.daysOverdue > 0 ? `${item.daysOverdue} days overdue` : 'Due soon'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary-600 py-4">No outstanding dues</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default FinanceReportPage;
