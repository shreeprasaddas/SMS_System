import React from 'react';
import { Card } from '@/components/common';
import { formatCurrency } from '@/utils/formatters.js';

function BudgetOverview({ budget = {} }) {
  const { total = 1000000, allocated = 750000, spent = 450000 } = budget;
  const remaining = total - spent;
  const allocationPercentage = ((allocated / total) * 100).toFixed(1);
  const spentPercentage = ((spent / total) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white p-6 shadow-sm border border-secondary-200">
        <h4 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Total Annual Budget</h4>
        <p className="text-3xl font-bold text-secondary-900 mt-2">{formatCurrency(total)}</p>
        <div className="mt-4 w-full bg-secondary-100 h-2 rounded-full overflow-hidden">
          <div className="bg-primary-600 h-full" style={{ width: '100%' }}></div>
        </div>
      </Card>

      <Card className="bg-white p-6 shadow-sm border border-secondary-200">
        <h4 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Allocated Funds</h4>
        <p className="text-3xl font-bold text-secondary-900 mt-2">{formatCurrency(allocated)}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-secondary-500">
          <span>{allocationPercentage}% of Total</span>
        </div>
        <div className="mt-2 w-full bg-secondary-100 h-2 rounded-full overflow-hidden">
          <div className="bg-yellow-500 h-full" style={{ width: `${allocationPercentage}%` }}></div>
        </div>
      </Card>

      <Card className="bg-white p-6 shadow-sm border border-secondary-200">
        <h4 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Spent & Disbursed</h4>
        <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(spent)}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-secondary-500">
          <span>{spentPercentage}% of Total</span>
          <span className="font-semibold text-green-600">Remaining: {formatCurrency(remaining)}</span>
        </div>
        <div className="mt-2 w-full bg-secondary-100 h-2 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full" style={{ width: `${spentPercentage}%` }}></div>
        </div>
      </Card>
    </div>
  );
}

export default BudgetOverview;
