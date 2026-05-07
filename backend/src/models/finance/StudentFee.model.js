/**
 * StudentFee Model
 * Individual student fee allocation and payment tracking
 */

const mongoose = require('mongoose');

const studentFeeSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: [true, 'Fee structure is required'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    concessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concession',
      },
    ],
    feeBreakdown: [
      {
        name: String,
        amount: Number,
        frequency: String,
        dueDate: Date,
        paidAmount: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
          default: 'PENDING',
        },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'DEFAULTER', 'EXEMPTED'],
      default: 'PENDING',
    },
    paymentHistory: [
      {
        amount: Number,
        paidOn: Date,
        paymentMethod: {
          type: String,
          enum: ['CASH', 'CHEQUE', 'ONLINE', 'DD'],
        },
        transactionId: String,
        remarks: String,
      },
    ],
    isExempted: {
      type: Boolean,
      default: false,
    },
    exemptionReason: String,
    lastReminderSentOn: Date,
    reminderCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'student_fees',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
studentFeeSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
studentFeeSchema.index({ schoolId: 1, class: 1, status: 1 });
studentFeeSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

// Pre-save middleware to calculate due amount
studentFeeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Calculate due amount
  this.dueAmount = Math.max(0, this.totalAmount - this.paidAmount - this.discountAmount);

  // Determine status
  if (this.isExempted) {
    this.status = 'EXEMPTED';
  } else if (this.dueAmount === 0) {
    this.status = 'PAID';
  } else if (this.paidAmount > 0) {
    this.status = 'PARTIAL';
  } else if (new Date() > new Date(this.feeBreakdown[0]?.dueDate || Date.now())) {
    this.status = 'OVERDUE';
  } else {
    this.status = 'PENDING';
  }

  next();
});

module.exports = mongoose.model('StudentFee', studentFeeSchema);
