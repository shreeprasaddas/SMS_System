/**
 * EmployeePayroll Model
 * Monthly payroll records and salary processing
 */

const mongoose = require('mongoose');

const employeePayrollSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payrollMonth: {
      type: String,
      required: true,
    },
    payrollYear: {
      type: Number,
      required: true,
    },
    salaryStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryStructure',
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    earnings: [
      {
        component: String,
        amount: Number,
        _id: false,
      },
    ],
    totalEarnings: Number,
    deductions: [
      {
        component: String,
        amount: Number,
        _id: false,
      },
    ],
    totalDeductions: Number,
    grossSalary: Number,
    netSalary: Number,
    workingDays: {
      type: Number,
      default: 22,
    },
    presentDays: Number,
    absentDays: Number,
    leavesTaken: Number,
    halfDays: {
      type: Number,
      default: 0,
    },
    attendanceDeduction: {
      type: Number,
      default: 0,
    },
    overtime: {
      hours: {
        type: Number,
        default: 0,
      },
      amount: {
        type: Number,
        default: 0,
      },
      _id: false,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PROCESSED', 'APPROVED', 'PAID', 'REJECTED'],
      default: 'DRAFT',
    },
    processedDate: Date,
    approvedDate: Date,
    paidDate: Date,
    paymentMode: {
      type: String,
      enum: ['BANK_TRANSFER', 'CHEQUE', 'CASH', 'ONLINE'],
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      _id: false,
    },
    remarks: String,
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedDate: Date,
        _id: false,
      },
    ],
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'employeePayrolls',
  }
);

// Indexes
employeePayrollSchema.index({ schoolId: 1, employee: 1, payrollMonth: 1, payrollYear: 1 });
employeePayrollSchema.index({ schoolId: 1, status: 1 });
employeePayrollSchema.index({ schoolId: 1, payrollMonth: 1, payrollYear: 1 });

module.exports = mongoose.model('EmployeePayroll', employeePayrollSchema);
