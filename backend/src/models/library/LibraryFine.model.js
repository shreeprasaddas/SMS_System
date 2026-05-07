const mongoose = require('mongoose');

const libraryFineSchema = new mongoose.Schema(
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
    bookIssueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookIssue',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: String,
    fineType: {
      type: String,
      enum: ['OVERDUE', 'DAMAGED', 'LOST', 'OTHER'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    daysOverdue: {
      type: Number,
      default: 0
    },
    description: String,
    fineStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'PARTIAL', 'WAIVED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: Date,
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'ONLINE', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']
    },
    receiptNumber: String,
    waivedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    waiveDate: Date,
    waiverReason: String,
    cancelledByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledDate: Date,
    cancellationReason: String,
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
libraryFineSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LibraryFine').countDocuments({ schoolId: this.schoolId });
    this.code = `FINE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
libraryFineSchema.index({ schoolId: 1, fineStatus: 1 });
libraryFineSchema.index({ schoolId: 1, userId: 1 });
libraryFineSchema.index({ schoolId: 1, dueDate: 1 });

module.exports = mongoose.model('LibraryFine', libraryFineSchema);
libraryFineSchema.index({ schoolId: 1, status: 1 });
libraryFineSchema.index({ schoolId: 1, dueDate: 1 });

module.exports = mongoose.model('LibraryFine', libraryFineSchema);
