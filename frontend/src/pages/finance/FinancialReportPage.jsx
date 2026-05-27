import React, { useState } from 'react';
import { Card, Button, Spinner } from '@/components/common/index.js';
import { useGetFinancialReportQuery } from '@/store/api/financeApi.js';

function FinancialReportPage() {
  const [reportType, setReportType] = useState('REVENUE_REPORT');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading, error } = useGetFinancialReportQuery({
    reportType,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const reportData = data?.data || null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-2">Generate and view financial analytics and summaries</p>
        </div>
      </div>

      <Card className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="REVENUE_REPORT">Revenue Report</option>
              <option value="EXPENSE_REPORT">Expense Report</option>
              <option value="INCOME_STATEMENT">Income Statement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500">Generating report...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg">
            <p className="text-red-700 font-medium">Failed to generate report</p>
            <p className="text-sm text-red-500 mt-1">{error.data?.message || 'Please check your date range and try again.'}</p>
          </div>
        ) : !reportData ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Select parameters to view report data.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <p className="text-green-800 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-green-900 mt-2">${reportData.totalIncome?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                <p className="text-red-800 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-900 mt-2">${reportData.totalExpense?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <p className="text-blue-800 text-sm font-medium">Net Profit/Loss</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">${((reportData.totalIncome || 0) - (reportData.totalExpense || 0)).toLocaleString()}</p>
              </div>
            </div>

            {/* Detailed Table Placeholder */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
              <div className="bg-gray-50 rounded-lg border border-gray-200 h-48 flex items-center justify-center">
                <p className="text-gray-500">Detailed line items and charts will be rendered here based on the selected report type.</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default FinancialReportPage;
