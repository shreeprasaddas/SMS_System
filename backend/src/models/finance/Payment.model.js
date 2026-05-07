/**
 * Payment Model
 * Student fee payment records and transactions
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    paymentReference: {
      type: String,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    studentFee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentFee',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CHEQUE', 'ONLINE', 'DD', 'BANK_TRANSFER'],
      required: [true, 'Payment method is required'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    transactionId: {
      type: String,
      index: true,
    },
    referenceNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'COMPLETED',
    },
    paymentGateway: {
      type: String,
      enum: ['RAZORPAY', 'PAYPAL', 'STRIPE', 'MANUAL', 'INTERNAL'],
      default: 'MANUAL',
    },
    gatewayResponse: mongoose.Schema.Types.Mixed,
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    receiptNumber: String,
    receiptUrl: String,
    isReceiptGenerated: {
      type: Boolean,
      default: false,
    },
    receiptGeneratedOn: Date,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    verificationNotes: String,
    verifiedOn: Date,
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
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
    collection: 'payments',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
paymentSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
paymentSchema.index({ schoolId: 1, status: 1, paymentDate: 1 });
paymentSchema.index({ schoolId: 1, verificationStatus: 1 });
paymentSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

// Pre-save middleware to update timestamp
paymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Generate payment reference if not exists
  if (!this.paymentReference) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.paymentReference = `PAY-${timestamp}-${random}`;
  }

  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
