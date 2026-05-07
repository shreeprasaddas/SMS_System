const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
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
    budgetName: {
      type: String,
      required: true
    },
    description: String,
    fiscalYear: {
      type: Number,
      required: true
    },
    budgetYear: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    },
    budgetAllocations: [{
      category: {
        type: String,
        enum: ['STAFF_SALARY', 'UTILITIES', 'MAINTENANCE', 'INFRASTRUCTURE', 'EQUIPMENT', 'SUPPLIES', 'EVENTS', 'SCHOLARSHIP', 'OPERATIONS', 'OTHER'],
        required: true
      },
      allocatedAmount: {
        type: Number,
        required: true,
        min: 0
      },
      spentAmount: {
        type: Number,
        default: 0,
        min: 0
      },
      remainingAmount: {
        type: Number,
        default: 0,
        min: 0
      },
      description: String
    }],
    totalBudget: {
      type: Number,
      required: true,
      min: 0
    },
    totalAllocated: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    variance: {
      type: Number,
      default: 0
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
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
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
budgetSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Budget').countDocuments({ schoolId: this.schoolId });
    this.code = `BUDGET-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
budgetSchema.index({ schoolId: 1, status: 1 });
budgetSchema.index({ schoolId: 1, fiscalYear: 1 });
budgetSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
