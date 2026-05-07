/**
 * Ledger Model
 * Financial ledger for accounting entries
 */

const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    entryNumber: {
      type: String,
      required: [true, 'Entry number is required'],
      unique: true,
      index: true,
    },
    entryDate: {
      type: Date,
      required: [true, 'Entry date is required'],
      default: Date.now,
    },
    fiscalYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    type: {
      type: String,
      enum: ['INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT'],
      required: [true, 'Entry type is required'],
    },
    account: {
      type: String,
      enum: [
        'TUITION_FEE',
        'OTHER_INCOME',
        'SALARY',
        'UTILITIES',
        'MAINTENANCE',
        'SUPPLIES',
        'EQUIPMENT',
        'TRANSPORT',
        'OTHER_EXPENSE',
      ],
      required: [true, 'Account is required'],
    },
    referenceType: {
      type: String,
      enum: ['PAYMENT', 'EXPENSE', 'INVOICE', 'OTHER'],
      required: true,
    },
    referenceId: mongoose.Schema.Types.ObjectId,
    referenceNumber: String,
    debitAmount: {
      type: Number,
      default: 0,
      min: [0, 'Debit amount cannot be negative'],
    },
    creditAmount: {
      type: Number,
      default: 0,
      min: [0, 'Credit amount cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    relatedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedVendor: String,
    status: {
      type: String,
      enum: ['PENDING', 'POSTED', 'RECONCILED', 'CANCELLED'],
      default: 'POSTED',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedOn: {
      type: Date,
      default: Date.now,
    },
    reconciledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reconciledOn: Date,
    reconciledNotes: String,
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedOn: Date,
      },
    ],
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
    collection: 'ledgers',
    timestamps: false,
  }
);

// Compound indexes for efficient queries
ledgerSchema.index({ schoolId: 1, fiscalYear: 1, entryDate: 1 });
ledgerSchema.index({ schoolId: 1, account: 1, type: 1, entryDate: 1 });
ledgerSchema.index({ schoolId: 1, status: 1, postedOn: 1 });
ledgerSchema.index({ schoolId: 1, type: 1, entryDate: 1 });

// Pre-save middleware to update timestamp and generate entry number
ledgerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Validate that either debit or credit is provided
  if (this.debitAmount === 0 && this.creditAmount === 0) {
    next(new Error('Either debit or credit amount must be provided'));
  }

  // Validate that both debit and credit are not provided
  if (this.debitAmount > 0 && this.creditAmount > 0) {
    next(new Error('Cannot have both debit and credit in same entry'));
  }

  // Generate entry number if not exists
  if (!this.entryNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.entryNumber = `LED-${timestamp}-${random}`;
  }

  next();
});

module.exports = mongoose.model('Ledger', ledgerSchema);
