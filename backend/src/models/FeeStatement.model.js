/**
 * FeeStatement Model
 * Fee invoices, payment history, and balance tracking for parent portal
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const feeStatementSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentProfile',
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    monthYear: String,
    feeStructureId: mongoose.Schema.Types.ObjectId,
    feeComponents: [
      {
        componentId: mongoose.Schema.Types.ObjectId,
        componentName: {
          type: String,
          required: true,
        },
        feeCategory: {
          type: String,
          enum: ['TUITION', 'TRANSPORTATION', 'HOSTEL', 'ACTIVITY', 'EXAMINATION', 'SPORTS', 'MISCELLANEOUS'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        isMandatory: Boolean,
        discountApplied: Number,
        finalAmount: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    totalDiscountAmount: Number,
    netAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    issuanceDetails: {
      issueDate: {
        type: Date,
        default: Date.now,
      },
      invoiceNumber: String,
      issuedByUserId: mongoose.Schema.Types.ObjectId,
      dueDate: {
        type: Date,
        required: true,
      },
      lateFeeApplicableAfter: Number, // in days
      lateFeePercentage: Number,
    },
    paymentDetails: [
      {
        paymentId: mongoose.Schema.Types.ObjectId,
        paymentDate: Date,
        paymentAmount: Number,
        paymentMethod: {
          type: String,
          enum: ['CASH', 'CHEQUE', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'ONLINE', 'OTHER'],
        },
        referenceNumber: String,
        transactionId: String,
        processedByUserId: mongoose.Schema.Types.ObjectId,
        receiptNumber: String,
        remarks: String,
      },
    ],
    paidAmount: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
    },
    lateFeesApplied: {
      isLate: Boolean,
      lateFeeAmount: Number,
      lateFeeAppliedDate: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE', 'WAIVED', 'WRITTEN_OFF'],
      default: 'UNPAID',
      index: true,
    },
    concessions: [
      {
        concessionType: {
          type: String,
          enum: ['SCHOLARSHIP', 'MERIT_DISCOUNT', 'SIBLING_DISCOUNT', 'FINANCIAL_AID', 'HARDSHIP', 'OTHER'],
        },
        concessionPercentage: Number,
        concessionAmount: Number,
        approverUserId: mongoose.Schema.Types.ObjectId,
        approvalDate: Date,
        reason: String,
      },
    ],
    reminders: [
      {
        reminderId: mongoose.Schema.Types.ObjectId,
        reminderType: {
          type: String,
          enum: ['ADVANCE_REMINDER', 'DUE_DATE_REMINDER', 'OVERDUE_REMINDER', 'FINAL_NOTICE'],
        },
        sentDate: Date,
        sentVia: {
          type: String,
          enum: ['EMAIL', 'SMS', 'IN_APP', 'PORTAL'],
        },
        acknowledgedBy: mongoose.Schema.Types.ObjectId,
        acknowledgedDate: Date,
      },
    ],
    parentViewingDetails: {
      hasBeenViewed: Boolean,
      viewedDate: Date,
      downloadCount: {
        type: Number,
        default: 0,
      },
      lastDownloadDate: Date,
    },
    notes: String,
    internalRemarks: String,
    status: {
      type: String,
      enum: ['DRAFT', 'ISSUED', 'VIEWED', 'PAID', 'CANCELLED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware for code generation
feeStatementSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('FEES', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  // Update balanceAmount automatically
  this.balanceAmount = (this.netAmount || 0) - (this.paidAmount || 0);
  next();
});

// Indexes
feeStatementSchema.index({ schoolId, studentId: 1 });
feeStatementSchema.index({ schoolId, paymentStatus: 1 });
feeStatementSchema.index({ schoolId, parentId: 1 });
feeStatementSchema.index({ code: 1, schoolId: 1 });

// Virtual: Is overdue
feeStatementSchema.virtual('isOverdue').get(function () {
  if (this.paymentStatus === 'PAID' || this.paymentStatus === 'WAIVED') return false;
  return new Date() > this.issuanceDetails?.dueDate;
});

// Virtual: Days overdue
feeStatementSchema.virtual('daysOverdue').get(function () {
  if (!this.isOverdue) return 0;
  const now = new Date();
  const dueDate = this.issuanceDetails?.dueDate;
  const timeDiff = now - dueDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Payment percentage
feeStatementSchema.virtual('paymentPercentage').get(function () {
  if (!this.netAmount) return 0;
  return Math.round((this.paidAmount / this.netAmount) * 100);
});

// Virtual: Remaining days to pay
feeStatementSchema.virtual('daysUntilDue').get(function () {
  if (this.isOverdue) return 0;
  const dueDate = this.issuanceDetails?.dueDate;
  const now = new Date();
  const timeDiff = dueDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('FeeStatement', feeStatementSchema);
