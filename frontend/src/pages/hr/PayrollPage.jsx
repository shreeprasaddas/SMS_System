import React, { useState } from 'react';
import { Card, Button, Table, Badge } from '@/components/common/index.js';
import { useGetPayrollRecordsQuery, useApprovePayrollMutation } from '@/store/api/hrApi.js';
import toast from 'react-hot-toast';

function PayrollPage() {
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  
  const { data: payrollData, isLoading, refetch } = useGetPayrollRecordsQuery({ 
    month: monthFilter, 
    year: yearFilter 
  });
  
  const [approvePayroll] = useApprovePayrollMutation();

  const handleApprove = async (id) => {
    try {
      await approvePayroll({ payrollId: id }).unwrap();
      toast.success('Payroll approved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to approve payroll');
    }
  };

  const columns = [
    { 
      header: 'Employee', 
      accessor: (row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.staff?.user?.firstName} {row.staff?.user?.lastName}
          </p>
          <p className="text-xs text-gray-500">{row.staff?.employeeId}</p>
        </div>
      )
    },
    { 
      header: 'Basic Salary', 
      accessor: (row) => <span className="font-medium text-gray-700">${row.basicSalary?.toFixed(2)}</span> 
    },
    { 
      header: 'Allowances', 
      accessor: (row) => <span className="text-green-600">+${row.totalAllowances?.toFixed(2)}</span> 
    },
    { 
      header: 'Deductions', 
      accessor: (row) => <span className="text-red-600">-${row.totalDeductions?.toFixed(2)}</span> 
    },
    { 
      header: 'Net Salary', 
      accessor: (row) => <span className="font-bold text-gray-900">${row.netSalary?.toFixed(2)}</span> 
    },
    { 
      header: 'Status', 
      accessor: (row) => {
        let variant = 'warning';
        if (row.status === 'APPROVED') variant = 'success';
        if (row.status === 'PAID') variant = 'primary';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status === 'DRAFT' && (
            <Button size="sm" variant="primary" onClick={() => handleApprove(row._id)}>Approve</Button>
          )}
          <Button size="sm" variant="secondary">View Slip</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Processing</h1>
          <p className="mt-2 text-gray-600">Review and process staff salaries and generate payslips.</p>
        </div>
        <Button variant="primary">+ Generate Monthly Payroll</Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading payroll records...</div>
        ) : (
          <Table 
            columns={columns} 
            data={payrollData?.data?.payrolls || []} 
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
}

export default PayrollPage;
