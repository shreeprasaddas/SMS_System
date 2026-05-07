/**
 * Invoice Model
 * School fee invoices for students
 */

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      index: true,
    },
    studentFee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentFee',
      required: [true, 'Student fee is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    taxPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED', 'OVERDUE'],
      default: 'DRAFT',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID'],
      default: 'UNPAID',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    terms: {
      type: String,
      maxlength: [1000, 'Terms cannot exceed 1000 characters'],
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reminderCount: {
      type: Number,
      default: 0,
    },
    lastReminderOn: Date,
    isPrinted: {
      type: Boolean,
      default: false,
    },
    printedOn: Date,
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
    collection: 'invoices',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
invoiceSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
invoiceSchema.index({ schoolId: 1, status: 1, dueDate: 1 });
invoiceSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

// Pre-save middleware to calculate balance and status
invoiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Calculate balance
  this.balanceAmount = this.totalAmount - this.amountPaid;

  // Determine payment status
  if (this.amountPaid === 0) {
    this.paymentStatus = 'UNPAID';
  } else if (this.amountPaid < this.totalAmount) {
    this.paymentStatus = 'PARTIALLY_PAID';
  } else {
    this.paymentStatus = 'PAID';
  }

  // Determine overall status
  if (this.status === 'CANCELLED') {
    // Keep as is
  } else if (this.status === 'DRAFT') {
    // Keep as is
  } else if (this.paymentStatus === 'PAID') {
    this.status = 'PAID';
  } else if (this.paymentStatus === 'PARTIALLY_PAID') {
    this.status = 'PARTIALLY_PAID';
  } else if (new Date() > this.dueDate && this.paymentStatus === 'UNPAID') {
    this.status = 'OVERDUE';
  }

  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
