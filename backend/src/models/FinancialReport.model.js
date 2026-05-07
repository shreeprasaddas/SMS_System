const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      indexed: true,
    },
    reportType: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL', 'CASH_FLOW', 'BUDGET_vs_ACTUAL'],
      required: true,
      indexed: true,
    },
    academicYear: {
      type: String,
      required: true,
      indexed: true,
    },
    reportPeriod: {
      startDate: Date,
      endDate: Date,
      month: String,
      quarter: String,
    },
    revenue: {
      totalExpectedRevenue: {
        type: Number,
        default: 0,
      },
      totalFeeCollected: {
        type: Number,
        default: 0,
      },
      otherIncome: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      collectionPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      feeBreakdown: [
        {
          feeType: String,
          expectedAmount: Number,
          collectedAmount: Number,
          percentage: Number,
        },
      ],
      classWiseCollection: [
        {
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          expectedAmount: Number,
          collectedAmount: Number,
          percentage: Number,
          pendingAmount: Number,
        },
      ],
    },
    expenses: {
      totalExpenses: {
        type: Number,
        default: 0,
      },
      salaryExpenses: {
        type: Number,
        default: 0,
      },
      maintenanceExpenses: {
        type: Number,
        default: 0,
      },
      utilitiesExpenses: {
        type: Number,
        default: 0,
      },
      supplies: {
        type: Number,
        default: 0,
      },
      otherExpenses: {
        type: Number,
        default: 0,
      },
      expenseBreakdown: [
        {
          expenseCategory: String,
          budgetedAmount: Number,
          actualAmount: Number,
          variance: Number,
          variancePercentage: Number,
        },
      ],
    },
    profitLoss: {
      grossProfit: {
        type: Number,
        default: 0,
      },
      netProfit: {
        type: Number,
        default: 0,
      },
      profitMargin: Number,
    },
    budgetComparison: {
      totalBudget: Number,
      budgetUtilized: Number,
      budgetRemaining: Number,
      utilizationPercentage: Number,
      departmentWiseComparison: [
        {
          department: String,
          budgetedAmount: Number,
          utilizedAmount: Number,
          percentage: Number,
          status: {
            type: String,
            enum: ['WITHIN_BUDGET', 'OVER_BUDGET', 'UNDER_BUDGET'],
          },
        },
      ],
    },
    outstandingFees: {
      totalPending: {
        type: Number,
        default: 0,
      },
      dueLessThan30Days: {
        type: Number,
        default: 0,
      },
      due30to60Days: {
        type: Number,
        default: 0,
      },
      dueMoreThan60Days: {
        type: Number,
        default: 0,
      },
      defaulters: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          parentName: String,
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          amountDue: Number,
          daysOverdue: Number,
          lastPaymentDate: Date,
          contactAttempts: Number,
        },
      ],
    },
    scholarships: {
      totalScholarshipsAwarded: {
        type: Number,
        default: 0,
      },
      totalScholarshipAmount: {
        type: Number,
        default: 0,
      },
      scholarshipBreakdown: [
        {
          scholarshipType: String,
          numberOfRecipients: Number,
          totalAmount: Number,
          averageAmount: Number,
        },
      ],
    },
    cashFlowAnalysis: [
      {
        month: String,
        openingBalance: Number,
        inflow: Number,
        outflow: Number,
        closingBalance: Number,
      },
    ],
    trends: {
      monthlyRevenueTrend: [
        {
          month: String,
          collectedAmount: Number,
          comparisonWithPreviousMonth: Number,
          trend: {
            type: String,
            enum: ['IMPROVING', 'DECLINING', 'STABLE'],
          },
        },
      ],
      revenueVsExpensesTrend: [
        {
          period: String,
          revenue: Number,
          expenses: Number,
          profit: Number,
          marginPercentage: Number,
        },
      ],
    },
    alerts: [
      {
        alertType: String,
        severity: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
        message: String,
        affectedArea: String,
        recommendedAction: String,
      },
    ],
    recommendations: [
      {
        area: String,
        currentStatus: String,
        recommendation: String,
        potentialSavings: Number,
        implementationCost: Number,
        priority: {
          type: String,
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        },
      },
    ],
    generationDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      generatedByUserId: mongoose.Schema.Types.ObjectId,
      approvedByUserId: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
      dataSourcesUsed: [String],
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

financialReportSchema.index({ schoolId: 1, reportType: 1 });
financialReportSchema.index({ schoolId: 1, academicYear: 1 });
financialReportSchema.index({ code: 1, schoolId: 1 });

financialReportSchema.virtual('healthStatus').get(function () {
  if (this.profitLoss.netProfit > 0 && this.revenue.collectionPercentage >= 90) return 'EXCELLENT';
  if (this.profitLoss.netProfit >= 0 && this.revenue.collectionPercentage >= 80) return 'GOOD';
  if (this.profitLoss.netProfit >= 0 && this.revenue.collectionPercentage >= 60) return 'AVERAGE';
  return 'CRITICAL';
});

financialReportSchema.virtual('reportAgeDays').get(function () {
  return Math.floor((Date.now() - this.generationDetails.generatedDate) / (1000 * 60 * 60 * 24));
});

financialReportSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('FinancialReport').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `FREP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('FinancialReport', financialReportSchema);
