import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Button from '@/components/common/Button.jsx';
import Spinner from '@/components/common/Spinner.jsx';
import { useFees } from '@/hooks/useFees.js';
import { usePrint } from '@/hooks/usePrint.js';
import { formatCurrency, formatDate } from '@/utils/formatters.js';

function InvoicePage() {
  const { id } = useParams();
  const { feesList, isLoading } = useFees();
  const { printElement } = usePrint();

  // Find fee invoice in list or mock details
  const invoice = feesList.find((f) => f._id === id) || {
    invoiceNumber: `INV-2026-${id?.slice(-4) || '9821'}`,
    student: { firstName: 'Rahul', lastName: 'Sharma', rollNumber: 'R-102', class: 'Grade X-A' },
    amount: 15000,
    dueDate: '2026-06-15',
    status: 'PAID',
    paymentMethod: 'ONLINE',
    paymentDate: '2026-05-20',
  };

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Details"
        subtitle="Manage student billing invoice and transaction receipt"
        actions={
          <>
            <Link to="/finance/fees">
              <Button variant="outline">Back to Fees</Button>
            </Link>
            <Button variant="primary" onClick={() => printElement('printable-invoice')}>
              Print Invoice
            </Button>
          </>
        }
      />
      <Card id="printable-invoice" className="max-w-3xl mx-auto bg-white p-8">
        <div className="flex justify-between items-start border-b border-secondary-200 pb-6 mb-6">
          <div>
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2">
              SMS
            </div>
            <h2 className="text-xl font-bold text-secondary-900">Delhi Public School</h2>
            <p className="text-xs text-secondary-500">Sector 12, Dwarka, New Delhi</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-secondary-900">INVOICE</h3>
            <p className="text-sm font-mono text-secondary-600">{invoice.invoiceNumber}</p>
            <p className="text-xs text-secondary-500 mt-1">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-secondary-700 uppercase tracking-wider text-xs mb-2">Billed To:</h4>
            <p className="font-bold text-secondary-900">
              {invoice.student?.firstName} {invoice.student?.lastName}
            </p>
            <p className="text-secondary-600">Roll No: {invoice.student?.rollNumber}</p>
            <p className="text-secondary-600">Class: {invoice.student?.class || 'N/A'}</p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-secondary-700 uppercase tracking-wider text-xs mb-2">Payment Details:</h4>
            <p className="text-secondary-900 font-medium">Status: {invoice.status}</p>
            <p className="text-secondary-600">Method: {invoice.paymentMethod || 'N/A'}</p>
            <p className="text-secondary-600">Date: {invoice.paymentDate ? formatDate(invoice.paymentDate) : 'N/A'}</p>
          </div>
        </div>

        <div className="border border-secondary-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary-50 font-semibold text-secondary-700">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              <tr>
                <td className="px-4 py-3 font-medium text-secondary-900">Tuition Fees - Term 1</td>
                <td className="px-4 py-3 text-right">{formatCurrency(invoice.amount)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-secondary-900">Extracurricular Activities & Lab Charges</td>
                <td className="px-4 py-3 text-right">{formatCurrency(0)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-right">
          <div className="w-64 text-sm space-y-2">
            <div className="flex justify-between text-secondary-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-secondary-900 pt-2 border-t border-secondary-200">
              <span>Total Due:</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default InvoicePage;
