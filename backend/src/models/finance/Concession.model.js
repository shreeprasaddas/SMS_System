/**
 * Concession Model
 * Student fee concessions and discounts
 */

const mongoose = require('mongoose');

const concessionSchema = new mongoose.Schema(
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
    studentFee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentFee',
      required: [true, 'Student fee is required'],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'MERIT',
        'FINANCIAL_AID',
        'SPORTS',
        'SIBLING',
        'STAFF_CHILD',
        'SCHOLARSHIP',
        'SPECIAL',
        'OTHER',
      ],
      required: [true, 'Concession type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Concession amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be less than 0'],
      max: [100, 'Percentage cannot exceed 100'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    reason: String,
    validFrom: {
      type: Date,
      required: true,
    },
    validUpto: {
      type: Date,
      required: true,
    },
    applicableToFees: [String],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED'],
      default: 'ACTIVE',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Approver is required'],
    },
    approvalDate: {
      type: Date,
      default: Date.now,
    },
    rejectionReason: String,
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    collection: 'concessions',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
concessionSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
concessionSchema.index({ schoolId: 1, status: 1, validFrom: 1, validUpto: 1 });
concessionSchema.index({ schoolId: 1, type: 1, status: 1 });

// Pre-save middleware to update timestamp and validate dates
concessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  if (this.validUpto < this.validFrom) {
    next(new Error('Valid upto date must be greater than valid from date'));
  } else {
    next();
  }
});

// Virtual to check if concession is expired
concessionSchema.virtual('isExpired').get(function () {
  return new Date() > this.validUpto;
});

concessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Concession', concessionSchema);
