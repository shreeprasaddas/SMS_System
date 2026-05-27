import React from 'react';
import RevenueSummary from './RevenueSummary.jsx';
import ExpenseSummary from './ExpenseSummary.jsx';

function FinancialReport({ financialData = {} }) {
  const { revenue = {}, expenses = [] } = financialData;

  return (
    <div className="space-y-6">
      <RevenueSummary revenue={revenue} />
      <ExpenseSummary expenses={expenses} />
    </div>
  );
}

export default FinancialReport;
