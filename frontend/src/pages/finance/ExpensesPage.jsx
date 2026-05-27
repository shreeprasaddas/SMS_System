import React, { useState } from 'react';
import { Card, Button } from '@/components/common/index.js';
import ExpenseList from '@/components/finance/Expense/ExpenseList.jsx';
import ExpenseForm from '@/components/finance/Expense/ExpenseForm.jsx';

function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-2">Track and manage school operational expenses</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Back to List' : 'Record New Expense'}
        </Button>
      </div>

      <div>
        {showForm ? (
          <ExpenseForm onCancel={() => setShowForm(false)} />
        ) : (
          <ExpenseList />
        )}
      </div>
    </div>
  );
}

export default ExpensesPage;
