const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HRStaff',
      required: true
    },
    staffName: String,
    designation: String,
    payrollMonth: {
      type: String,
      required: true
    },
    payrollYear: {
      type: Number,
      required: true
    },
    processDate: {
      type: Date,
      required: true
    },
    salaryStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryStructure'
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0
    },
    earnings: [{
      component: String,
      amount: Number,
      percentage: Number
    }],
    totalEarnings: {
      type: Number,
      min: 0
    },
    deductions: [{
      component: String,
      amount: Number,
      percentage: Number
    }],
    totalDeductions: {
      type: Number,
      min: 0
    },
    grossSalary: {
      type: Number,
      min: 0
    },
    netSalary: {
      type: Number,
      min: 0
    },
    attendanceDays: {
      type: Number,
      default: 0,
      min: 0
    },
    workingDays: {
      type: Number,
      default: 0,
      min: 0
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: 0
    },
    overtimeAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'PAID', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    paymentMode: {
      type: String,
      enum: ['BANK_TRANSFER', 'CHEQUE', 'CASH', 'OTHER'],
      default: 'BANK_TRANSFER'
    },
    paymentDate: Date,
    transactionId: String,
    approvalStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'DRAFT'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    remarks: String,
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
payrollSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Payroll').countDocuments({ schoolId: this.schoolId });
    this.code = `PAYROLL-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
payrollSchema.index({ schoolId: 1, paymentStatus: 1 });
payrollSchema.index({ schoolId: 1, staffId: 1, payrollMonth: 1, payrollYear: 1 });
payrollSchema.index({ schoolId: 1, processDate: 1 });

module.exports = mongoose.model('Payroll', payrollSchema);
