import React, { useState } from 'react';
import { useGetStudentFeesQuery } from '@/store/api/feeApi.js';
import { useRecordPaymentMutation } from '@/store/api/paymentApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { Button, Spinner, Card } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function FeesPage() {
  const [filters, setFilters] = useState({ status: '', classId: '', page: 1, limit: 12, search: '' });
  const { data, isLoading, error } = useGetStudentFeesQuery(filters);
  const { data: classesData } = useGetClassesQuery({ limit: 50 });
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'CASH', reference: '' });

  const classes = classesData?.data?.classes || classesData?.data || [];

  const handleRecordPayment = async () => {
    if (!selectedFee || !paymentForm.amount) {
      toast.error('Please select a fee and enter amount');
      return;
    }
    try {
      await recordPayment({
        studentFeeId: selectedFee._id,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.method,
        reference: paymentForm.reference,
      }).unwrap();
      toast.success('Payment recorded successfully');
      setSelectedFee(null);
      setPaymentForm({ amount: '', method: 'CASH', reference: '' });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to record payment');
    }
  };

  const fees = data?.data?.fees || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Fee Management</h1>
          <p className="text-secondary-600 mt-1">
            Manage student fees and track payments ({pagination.total || fees.length} records)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search by student name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
              <option value="EXEMPTED">Exempted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Class</label>
            <select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name || cls.className} {cls.section ? `- ${cls.section}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ status: '', classId: '', page: 1, limit: 12, search: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Fees List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800 text-center">
            {error?.data?.message || 'Failed to load fee records. Please try again.'}
          </p>
        </Card>
      ) : fees.length === 0 ? (
        <Card className="bg-gray-50">
          <div className="text-center py-8">
            <p className="text-4xl mb-3">💰</p>
            <p className="text-secondary-600 text-lg">No fee records found</p>
            <p className="text-secondary-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm border">
            <thead className="bg-secondary-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Class</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Total Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Paid</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Balance</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-secondary-700 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id} className="border-t hover:bg-secondary-25 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-secondary-900">
                      {fee.studentName || fee.student?.firstName
                        ? `${fee.student?.firstName || ''} ${fee.student?.lastName || ''}`
                        : 'Student'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {fee.className || fee.class?.name || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{(fee.totalAmount || fee.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-600">
                    ₹{(fee.paidAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-medium">
                    ₹{(fee.balanceAmount || fee.dueAmount || (fee.totalAmount - (fee.paidAmount || 0)) || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      fee.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : fee.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-800'
                        : fee.status === 'PARTIAL'
                        ? 'bg-blue-100 text-blue-800'
                        : fee.status === 'EXEMPTED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {fee.status !== 'PAID' && fee.status !== 'EXEMPTED' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedFee(fee)}
                      >
                        Pay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="text-secondary-600 text-sm">
            Page {filters.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Payment Modal */}
      {selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">Record Payment</h3>
            <div className="space-y-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-sm text-secondary-600">Student</p>
                <p className="font-medium">
                  {selectedFee.studentName || `${selectedFee.student?.firstName || ''} ${selectedFee.student?.lastName || ''}`}
                </p>
                <p className="text-sm text-secondary-500 mt-1">
                  Balance: ₹{(selectedFee.balanceAmount || selectedFee.dueAmount || selectedFee.totalAmount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="Enter payment amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="ONLINE">Online</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Reference (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="Transaction ID / Cheque No."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleRecordPayment}
                  isLoading={isRecording}
                  className="flex-1"
                >
                  Record Payment
                </Button>
                <Button variant="outline" onClick={() => setSelectedFee(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FeesPage;
