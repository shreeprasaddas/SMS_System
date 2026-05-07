const mongoose = require('mongoose');

const voucherJournalSchema = new mongoose.Schema(
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
    voucherType: {
      type: String,
      enum: ['PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA'],
      required: true
    },
    voucherDate: {
      type: Date,
      required: true
    },
    referenceNumber: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    journalEntries: [{
      ledgerAccount: {
        type: String,
        required: true
      },
      accountType: {
        type: String,
        enum: ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'],
        required: true
      },
      debit: {
        type: Number,
        default: 0,
        min: 0
      },
      credit: {
        type: Number,
        default: 0,
        min: 0
      },
      narration: String
    }],
    totalDebit: {
      type: Number,
      required: true,
      min: 0
    },
    totalCredit: {
      type: Number,
      required: true,
      min: 0
    },
    balancedStatus: {
      type: String,
      enum: ['BALANCED', 'UNBALANCED'],
      default: 'BALANCED'
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'OTHER']
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      chequeNumber: String,
      transactionId: String
    },
    approvalStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'DRAFT',
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    approvalRemarks: String,
    rejectionReason: String,
    postedStatus: {
      type: String,
      enum: ['UNPOSTED', 'POSTED', 'REVERSED'],
      default: 'UNPOSTED'
    },
    postedDate: Date,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    attachments: [{
      url: String,
      fileName: String,
      uploadedOn: Date
    }],
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
voucherJournalSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('VoucherJournal').countDocuments({ schoolId: this.schoolId });
    this.code = `VOUC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
voucherJournalSchema.index({ schoolId: 1, status: 1 });
voucherJournalSchema.index({ schoolId: 1, voucherType: 1, voucherDate: 1 });
voucherJournalSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('VoucherJournal', voucherJournalSchema);
