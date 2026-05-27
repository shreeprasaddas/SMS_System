import React from 'react';
import { Card, BarChart } from '@/components/common';
import { formatCurrency } from '@/utils/formatters.js';

function RevenueSummary({ revenue = {} }) {
  const { collected = 550000, pending = 120000, total = 670000 } = revenue;

  const chartData = {
    labels: ['Collected', 'Pending', 'Total Target'],
    datasets: [
      {
        label: 'Revenue Overview',
        data: [collected, pending, total],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(59, 130, 246, 0.6)'],
      },
    ],
  };

  return (
    <Card className="bg-white p-6 shadow-sm border border-secondary-200">
      <h3 className="text-lg font-bold text-secondary-900 mb-4">Fee Revenue Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-secondary-100">
            <span className="text-sm text-secondary-500 font-medium">Collected Revenue</span>
            <span className="font-bold text-green-600">{formatCurrency(collected)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-secondary-100">
            <span className="text-sm text-secondary-500 font-medium">Pending Collection</span>
            <span className="font-bold text-red-500">{formatCurrency(pending)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-secondary-100">
            <span className="text-sm text-secondary-500 font-medium">Total Billed Target</span>
            <span className="font-bold text-secondary-900">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="flex justify-center items-center h-48">
          <BarChart data={chartData} />
        </div>
      </div>
    </Card>
  );
}

export default RevenueSummary;
