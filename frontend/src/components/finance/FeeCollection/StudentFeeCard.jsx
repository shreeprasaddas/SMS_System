import React from 'react';
import { Card, StatusBadge, Button } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils/formatters.js';

function StudentFeeCard({ feeRecord = {}, onCollectPayment, onViewInvoice }) {
  const {
    studentName = 'Unknown Student',
    rollNumber = 'N/A',
    feeType = 'Tuition Fee',
    amount = 0,
    concession = 0,
    dueDate = '',
    status = 'PENDING',
  } = feeRecord;

  const totalDue = Math.max(0, amount - concession);

  return (
    <Card className="bg-white p-6 shadow-sm border border-secondary-200">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-secondary-900">{studentName}</h4>
          <p className="text-sm text-secondary-500">Roll: {rollNumber} &bull; {feeType}</p>
        </div>
        <StatusBadge variant={status === 'PAID' ? 'success' : status === 'PARTIAL' ? 'warning' : 'danger'}>
          {status}
        </StatusBadge>
      </div>

      <div className="mt-4 pt-4 border-t border-secondary-100 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-secondary-500">Base Amount:</p>
          <p className="font-semibold text-secondary-900">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="text-secondary-500">Concession/Scholarship:</p>
          <p className="font-semibold text-green-600">{concession > 0 ? `-${formatCurrency(concession)}` : formatCurrency(0)}</p>
        </div>
        <div>
          <p className="text-secondary-500">Due Date:</p>
          <p className="font-semibold text-secondary-900">{dueDate ? formatDate(dueDate) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-secondary-500">Total Net Due:</p>
          <p className="font-bold text-primary-600">{formatCurrency(totalDue)}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {status !== 'PAID' && (
          <Button variant="primary" className="flex-1" onClick={() => onCollectPayment?.(feeRecord)}>
            Collect Payment
          </Button>
        )}
        <Button variant="outline" className={status === 'PAID' ? 'w-full' : 'flex-1'} onClick={() => onViewInvoice?.(feeRecord)}>
          View Invoice
        </Button>
      </div>
    </Card>
  );
}

export default StudentFeeCard;
