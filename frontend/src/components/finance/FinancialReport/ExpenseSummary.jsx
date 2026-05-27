import React from 'react';
import { Card, PieChart } from '@/components/common';
import { formatCurrency } from '@/utils/formatters.js';

function ExpenseSummary({ expenses = [] }) {
  const mockExpenses = [
    { category: 'Salaries', amount: 350000 },
    { category: 'Infrastructure', amount: 80000 },
    { category: 'Utilities', amount: 20000 },
    { category: 'Academics', amount: 15000 },
  ];

  const dataList = expenses.length > 0 ? expenses : mockExpenses;
  const totalSpent = dataList.reduce((sum, item) => sum + item.amount, 0);

  const chartData = {
    labels: dataList.map((item) => item.category),
    datasets: [
      {
        data: dataList.map((item) => item.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(16, 185, 129, 0.6)',
        ],
      },
    ],
  };

  return (
    <Card className="bg-white p-6 shadow-sm border border-secondary-200">
      <h3 className="text-lg font-bold text-secondary-900 mb-4">Expense Breakdowns</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {dataList.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-secondary-100">
              <span className="text-sm text-secondary-500 font-medium">{item.category}</span>
              <span className="font-semibold text-secondary-900">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 font-bold text-red-600 border-t border-secondary-200">
            <span>Total Outflow</span>
            <span>{formatCurrency(totalSpent)}</span>
          </div>
        </div>
        <div className="flex justify-center items-center h-48">
          <PieChart data={chartData} />
        </div>
      </div>
    </Card>
  );
}

export default ExpenseSummary;
