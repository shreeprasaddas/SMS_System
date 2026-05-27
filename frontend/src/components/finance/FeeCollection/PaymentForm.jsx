import React, { useState } from 'react';
import { useGetStudentFeeByIdQuery } from '@/store/api/feeApi.js';
import { useRecordPaymentMutation } from '@/store/api/paymentApi.js';
import { Card, Button, Spinner } from '@/components/common';

function PaymentForm({ studentFeeId }) {
  const { data, isLoading } = useGetStudentFeeByIdQuery(studentFeeId, {
    skip: !studentFeeId
  });
  const [recordPayment, { isLoading: isSubmitting }] = useRecordPaymentMutation();
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const studentFee = data?.data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return alert('Enter a valid amount');
    if (amount > (studentFee?.dueAmount || 0)) return alert('Amount exceeds due amount');

    try {
      await recordPayment({
        studentFeeId,
        amount: Number(amount),
        paymentMethod,
        transactionId,
        remarks,
      }).unwrap();
      
      alert('Payment recorded successfully');
      setAmount('');
      setTransactionId('');
      setRemarks('');
    } catch (err) {
      alert(err.data?.message || 'Failed to record payment');
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Spinner />
      </Card>
    );
  }

  if (!studentFee) {
    return null;
  }

  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-4">
        Record Payment
      </h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-500">Student</div>
        <div className="font-semibold text-gray-900">
          {studentFee.student?.firstName} {studentFee.student?.lastName}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Total Fee</div>
            <div className="font-medium">${studentFee.totalAmount?.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Due Amount</div>
            <div className="font-bold text-red-600">${studentFee.dueAmount?.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount ($) *</label>
          <input
            type="number"
            required
            min="1"
            max={studentFee.dueAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={`Max: ${studentFee.dueAmount}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="CASH">Cash</option>
            <option value="ONLINE">Online</option>
            <option value="CHEQUE">Cheque</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {paymentMethod !== 'CASH' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction/Cheque ID *</label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting || studentFee.dueAmount <= 0}>
            {isSubmitting ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default PaymentForm;
