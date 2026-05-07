const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['STAFF_SALARY', 'UTILITIES', 'MAINTENANCE', 'INFRASTRUCTURE', 'EQUIPMENT', 'SUPPLIES', 'EVENTS', 'SCHOLARSHIP', 'OPERATIONS', 'OTHER'],
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
    expenseDate: {
      type: Date,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CREDIT_CARD', 'OTHER'],
      required: true
    },
    vendor: {
      type: String,
      maxlength: 200
    },
    vendorContact: String,
    invoiceNumber: String,
    billNumber: String,
    attachments: [{
      url: String,
      fileName: String,
      uploadedOn: Date
    }],
    department: {
      type: String,
      enum: ['ACADEMIC', 'ADMINISTRATION', 'INFRASTRUCTURE', 'SUPPORT', 'OTHER'],
      default: 'OTHER'
    },
    budgetAllocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    approvalRemarks: String,
    rejectionReason: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      maxlength: 500
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
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
expenseSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Expense').countDocuments({ schoolId: this.schoolId });
    this.code = `EXP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
expenseSchema.index({ schoolId: 1, category: 1, expenseDate: 1 });
expenseSchema.index({ schoolId: 1, status: 1 });
expenseSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
