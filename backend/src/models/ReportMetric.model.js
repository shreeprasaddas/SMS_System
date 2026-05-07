/**
 * ReportMetric Model
 * Custom metrics, KPIs, and calculated analytics
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const reportMetricSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    metricName: {
      type: String,
      required: true,
      trim: true,
    },
    metricDescription: String,
    metricType: {
      type: String,
      enum: ['KPI', 'INDICATOR', 'CUSTOM_METRIC', 'RATIO', 'TREND', 'BENCHMARK'],
      required: true,
    },
    metricCategory: {
      type: String,
      enum: ['ACADEMIC', 'OPERATIONAL', 'FINANCIAL', 'STUDENT', 'STAFF', 'ATTENDANCE', 'CUSTOM'],
      required: true,
    },
    calculation: {
      calculationType: {
        type: String,
        enum: ['SIMPLE', 'AGGREGATE', 'FORMULA', 'CUSTOM_FUNCTION', 'EXTERNAL_API'],
      },
      formula: String,
      parameters: [
        {
          parameterName: String,
          parameterType: {
            type: String,
            enum: ['FIELD', 'METRIC', 'CONSTANT', 'VARIABLE'],
          },
          parameterValue: mongoose.Schema.Types.Mixed,
        },
      ],
      dataSource: {
        collectionName: String,
        queryFilter: mongoose.Schema.Types.Mixed,
      },
      refreshFrequency: {
        type: String,
        enum: ['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND'],
      },
      cachedValue: mongoose.Schema.Types.Mixed,
      lastCalculatedDate: Date,
    },
    display: {
      displayFormat: {
        type: String,
        enum: ['NUMBER', 'PERCENTAGE', 'CURRENCY', 'DECIMAL', 'RATIO', 'TEXT'],
      },
      decimalPlaces: Number,
      currencySymbol: String,
      unit: String,
      notation: String,
    },
    visualization: {
      chartType: {
        type: String,
        enum: ['GAUGE', 'SPARKLINE', 'INDICATOR', 'CARD', 'TREND', 'COMPARISON'],
      },
      colorScheme: String,
      thresholds: [
        {
          level: {
            type: String,
            enum: ['CRITICAL', 'WARNING', 'NORMAL', 'GOOD', 'EXCELLENT'],
          },
          minValue: Number,
          maxValue: Number,
          color: String,
          icon: String,
        },
      ],
      trend: {
        showTrend: Boolean,
        trendDirection: {
          type: String,
          enum: ['UP', 'DOWN', 'NEUTRAL'],
        },
        trendValue: Number,
        trendPeriod: String,
      },
    },
    targets: {
      hasTarget: Boolean,
      targetValue: Number,
      targetAchievementDate: Date,
      trackingPeriod: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'],
      },
      actualValue: Number,
      achievementPercentage: Number,
    },
    benchmarking: {
      isBenchmarked: Boolean,
      benchmarkValue: Number,
      benchmarkSource: String,
      comparisonMetrics: [String],
      performanceRating: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR'],
      },
    },
    historicalData: [
      {
        recordDate: Date,
        value: Number,
        variance: Number,
        variancePercentage: Number,
        notes: String,
      },
    ],
    permissions: {
      viewRoles: [String],
      editRoles: [String],
      isPublic: Boolean,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    usedInReports: [
      {
        reportId: mongoose.Schema.Types.ObjectId,
        reportName: String,
      },
    ],
    usedInDashboards: [
      {
        dashboardId: mongoose.Schema.Types.ObjectId,
        dashboardName: String,
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
    },
    validationRules: [
      {
        ruleType: {
          type: String,
          enum: ['MIN', 'MAX', 'RANGE', 'PATTERN', 'CUSTOM'],
        },
        ruleCondition: String,
        ruleMessage: String,
      },
    ],
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
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

// Pre-save middleware for code generation
reportMetricSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('MET', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
reportMetricSchema.index({ schoolId, status: 1 });
reportMetricSchema.index({ metricType: 1, schoolId: 1 });
reportMetricSchema.index({ metricCategory: 1, schoolId: 1 });
reportMetricSchema.index({ code: 1, schoolId: 1 });

// Virtual: Target achievement percentage
reportMetricSchema.virtual('targetAchievementPercentage').get(function () {
  if (!this.targets?.targetValue || !this.targets?.actualValue) return 0;
  return Math.round((this.targets.actualValue / this.targets.targetValue) * 100);
});

// Virtual: Variance from benchmark
reportMetricSchema.virtual('benchmarkVariance').get(function () {
  if (!this.benchmarking?.benchmarkValue || !this.calculation?.cachedValue) return 0;
  return Math.round(this.calculation.cachedValue - this.benchmarking.benchmarkValue);
});

// Virtual: Status against threshold
reportMetricSchema.virtual('thresholdStatus').get(function () {
  if (!this.visualization?.thresholds || !this.calculation?.cachedValue) return null;
  const value = this.calculation.cachedValue;
  const threshold = this.visualization.thresholds.find(
    (t) => value >= t.minValue && value <= t.maxValue
  );
  return threshold?.level || null;
});

module.exports = mongoose.model('ReportMetric', reportMetricSchema);
