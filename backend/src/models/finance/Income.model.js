const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
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
    incomeSource: {
      type: String,
      enum: ['STUDENT_FEES', 'DONATIONS', 'GRANTS', 'TUITION_FEES', 'MISCELLANEOUS', 'TRANSPORT_FEES', 'HOSTEL_FEES', 'INTEREST', 'OTHER'],
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    incomeDate: {
      type: Date,
      required: true
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CREDIT_CARD', 'OTHER'],
      required: true
    },
    payerName: String,
    payerContact: String,
    referenceDocument: String,
    category: {
      type: String,
      enum: ['ACADEMIC', 'NON_ACADEMIC', 'DONATIONS', 'GRANTS', 'OTHER'],
      default: 'ACADEMIC'
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      chequeNumber: String,
      transactionId: String
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'RECONCILED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationRemarks: String,
    rejectionReason: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      maxlength: 500
    },
    attachments: [{
      url: String,
      fileName: String,
      uploadedOn: Date
    }],
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
incomeSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Income').countDocuments({ schoolId: this.schoolId });
    this.code = `INC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
incomeSchema.index({ schoolId: 1, incomeSource: 1, incomeDate: 1 });
incomeSchema.index({ schoolId: 1, status: 1 });
incomeSchema.index({ schoolId: 1, verificationStatus: 1 });

module.exports = mongoose.model('Income', incomeSchema);
