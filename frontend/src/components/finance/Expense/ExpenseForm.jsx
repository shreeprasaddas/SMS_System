import React, { useState } from 'react';
import { useRecordExpenseMutation } from '@/store/api/financeApi.js';
import { Card, Button } from '@/components/common';

function ExpenseForm({ onCancel }) {
  const [recordExpense, { isLoading }] = useRecordExpenseMutation();
  
  const [formData, setFormData] = useState({
    category: 'STAFF_SALARY',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER',
    vendor: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordExpense({
        ...formData,
        amount: Number(formData.amount),
      }).unwrap();
      
      alert('Expense recorded successfully');
      onCancel();
    } catch (err) {
      alert(err.data?.message || 'Failed to record expense');
    }
  };

  return (
    <Card>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Record New Expense</h2>
        <p className="text-sm text-gray-500 mt-1">Enter details of the school expenditure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="STAFF_SALARY">Staff Salary</option>
              <option value="UTILITIES">Utilities</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="SUPPLIES">Supplies</option>
              <option value="EVENTS">Events</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              name="expenseDate"
              required
              value={formData.expenseDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="ONLINE">Online</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Payee (Optional)</label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ExpenseForm;
