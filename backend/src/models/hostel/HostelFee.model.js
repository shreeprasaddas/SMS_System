/**
 * HostelFee Model
 * Hostel fee structure and payment records
 */

const mongoose = require('mongoose');

const hostelFeeSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      unique: true,
      sparse: true
    },
    studentHostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentHostel',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentName: String,
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    hostelName: String,
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    feeType: {
      type: String,
      enum: ['MONTHLY_RENT', 'SECURITY_DEPOSIT', 'MAINTENANCE_FEE', 'MESS_FEE', 'UTILITY_FEE', 'OTHER'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: Date,
    paymentMethod: {
      type: String,
      enum: ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'CARD', 'UPIPI']
    },
    transactionId: {
      type: String,
      maxlength: 100
    },
    receiptNumber: {
      type: String,
      maxlength: 50
    },
    collectedBy: mongoose.Schema.Types.ObjectId,
    collectedByName: String,
    description: String,
    remarks: String,
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'],
      default: 'PENDING'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
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
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
hostelFeeSchema.index({ schoolId: 1, status: 1 });
hostelFeeSchema.index({ schoolId: 1, studentId: 1 });
hostelFeeSchema.index({ schoolId: 1, paymentStatus: 1 });
hostelFeeSchema.index({ schoolId: 1, dueDate: 1 });

// Pre-save middleware for code generation
hostelFeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('HostelFee').countDocuments({ 
      schoolId: this.schoolId 
    }) + 1;
    this.code = `HFEE-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Virtual for days overdue
hostelFeeSchema.virtual('daysOverdue').get(function() {
  if (this.paymentStatus !== 'OVERDUE') return 0;
  const today = new Date();
  const diffTime = today - this.dueDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for net amount due
hostelFeeSchema.virtual('netAmountDue').get(function() {
  return this.totalAmount - (this.amount > 0 ? this.amount : 0);
});

module.exports = mongoose.model('HostelFee', hostelFeeSchema);
