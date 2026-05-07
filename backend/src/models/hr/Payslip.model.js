/**
 * Payslip Model
 * Generated salary slip for each employee
 */

const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    payslipNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeePayroll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeePayroll',
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
    employeeDetails: {
      employeeId: String,
      name: String,
      designation: String,
      department: String,
      _id: false,
    },
    baseSalary: Number,
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
    attendanceDetails: {
      workingDays: Number,
      presentDays: Number,
      absentDays: Number,
      leavesTaken: Number,
      attendancePercentage: Number,
      _id: false,
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      _id: false,
    },
    paymentMode: String,
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'GENERATED', 'SENT', 'VIEWED', 'DOWNLOADED'],
      default: 'DRAFT',
    },
    sentDate: Date,
    viewedDate: Date,
    downloadedDate: Date,
    remarks: String,
  },
  {
    timestamps: true,
    collection: 'payslips',
  }
);

// Indexes
payslipSchema.index({ schoolId: 1, employee: 1, payrollMonth: 1 });
payslipSchema.index({ payslipNumber: 1, unique: true, sparse: true });
payslipSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('Payslip', payslipSchema);
