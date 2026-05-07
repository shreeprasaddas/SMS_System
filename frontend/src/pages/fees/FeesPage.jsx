import React, { useState } from 'react';
import { useGetFeesQuery, useRecordPaymentMutation } from '../../store/api/feeApi.js';
import { Button, Spinner, Card } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function FeesPage() {
  const [filters, setFilters] = useState({ status: '', classId: '', page: 1, limit: 12 });
  const { data, isLoading } = useGetFeesQuery(filters);
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'CASH' });

  const handleRecordPayment = async () => {
    if (!selectedFee || !paymentForm.amount) {
      toast.error('Please select a fee and enter amount');
      return;
    }
    try {
      await recordPayment({
        feeId: selectedFee._id,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.method
      }).unwrap();
      toast.success('Payment recorded successfully');
      setSelectedFee(null);
      setPaymentForm({ amount: '', method: 'CASH' });
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const fees = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fee Management</h1>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <select
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Classes</option>
            <option value="class_001">Class 1</option>
            <option value="class_002">Class 2</option>
            <option value="class_003">Class 3</option>
          </select>
          <Button variant="primary">+ Add New Fee</Button>
        </div>
      </Card>

      {/* Fees List */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Class</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{fee.studentName}</td>
                  <td className="px-4 py-3">{fee.className}</td>
                  <td className="px-4 py-3">₹{fee.amount}</td>
                  <td className="px-4 py-3">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      fee.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : fee.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {fee.status !== 'PAID' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedFee(fee)}
                      >
                        Record Payment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {selectedFee && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="TRANSFER">Bank Transfer</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleRecordPayment}
                isLoading={isRecording}
              >
                Record Payment
              </Button>
              <Button variant="outline" onClick={() => setSelectedFee(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default FeesPage;
