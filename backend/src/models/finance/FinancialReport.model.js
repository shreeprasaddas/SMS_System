const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema(
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
    reportType: {
      type: String,
      enum: ['INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW', 'EXPENSE_REPORT', 'REVENUE_REPORT', 'BUDGET_vs_ACTUAL'],
      required: true
    },
    reportName: {
      type: String,
      required: true
    },
    description: String,
    fiscalYear: {
      type: Number,
      required: true
    },
    reportPeriod: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    },
    generatedDate: {
      type: Date,
      default: Date.now
    },
    reportData: {
      totalIncome: {
        type: Number,
        default: 0,
        min: 0
      },
      totalExpense: {
        type: Number,
        default: 0,
        min: 0
      },
      netProfit: {
        type: Number,
        default: 0
      },
      totalAssets: {
        type: Number,
        default: 0,
        min: 0
      },
      totalLiabilities: {
        type: Number,
        default: 0,
        min: 0
      },
      totalEquity: {
        type: Number,
        default: 0
      },
      incomeBreakdown: [{
        source: String,
        amount: {
          type: Number,
          min: 0
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100
        }
      }],
      expenseBreakdown: [{
        category: String,
        amount: {
          type: Number,
          min: 0
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100
        }
      }],
      budgetComparison: [{
        category: String,
        budgeted: {
          type: Number,
          min: 0
        },
        actual: {
          type: Number,
          min: 0
        },
        variance: Number,
        variancePercentage: Number
      }]
    },
    summary: {
      highlights: String,
      analysis: String,
      recommendations: String
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
    status: {
      type: String,
      enum: ['DRAFT', 'FINALIZED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    attachments: [{
      url: String,
      fileName: String,
      fileType: String,
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
financialReportSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('FinancialReport').countDocuments({ schoolId: this.schoolId });
    this.code = `REPORT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
financialReportSchema.index({ schoolId: 1, status: 1 });
financialReportSchema.index({ schoolId: 1, reportType: 1, fiscalYear: 1 });
financialReportSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('FinancialReport', financialReportSchema);
