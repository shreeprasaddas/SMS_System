/**
 * Report Model
 * Master report definitions and configurations
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const reportSchema = new mongoose.Schema(
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
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    reportDescription: String,
    reportType: {
      type: String,
      enum: [
        'ACADEMIC_PERFORMANCE',
        'ATTENDANCE',
        'FINANCIAL',
        'ENROLLMENT',
        'STAFF',
        'INVENTORY',
        'FEES',
        'EXAMINATION',
        'CUSTOM',
        'COMPLIANCE',
        'OPERATIONAL',
        'OTHER',
      ],
      required: true,
    },
    reportCategory: {
      type: String,
      enum: ['STUDENT', 'STAFF', 'FINANCIAL', 'OPERATIONAL', 'ACADEMIC', 'ADMIN', 'CUSTOM'],
      required: true,
    },
    dataSource: {
      collectionName: String,
      databaseName: String,
      queryType: {
        type: String,
        enum: ['DIRECT_QUERY', 'AGGREGATION', 'CUSTOM_FUNCTION', 'API_CALL'],
      },
      customQuery: mongoose.Schema.Types.Mixed,
      filters: [
        {
          fieldName: String,
          operator: {
            type: String,
            enum: ['EQ', 'NE', 'GT', 'LT', 'GTE', 'LTE', 'IN', 'NIN', 'REGEX', 'EXISTS'],
          },
          value: mongoose.Schema.Types.Mixed,
          isUserSelectable: Boolean,
        },
      ],
    },
    reportColumns: [
      {
        columnId: mongoose.Schema.Types.ObjectId,
        columnName: String,
        columnLabel: String,
        dataType: {
          type: String,
          enum: ['STRING', 'NUMBER', 'DATE', 'PERCENTAGE', 'CURRENCY', 'BOOLEAN', 'CALCULATED'],
        },
        isVisible: Boolean,
        isGroupBy: Boolean,
        sortOrder: Number,
        aggregationFunction: {
          type: String,
          enum: ['SUM', 'AVG', 'MIN', 'MAX', 'COUNT', 'DISTINCT', 'NONE'],
        },
        formattingRules: {
          decimalPlaces: Number,
          dateFormat: String,
          currencySymbol: String,
        },
      },
    ],
    grouping: {
      groupByFields: [String],
      nestedGrouping: Boolean,
    },
    sorting: [
      {
        fieldName: String,
        direction: {
          type: String,
          enum: ['ASC', 'DESC'],
        },
        priority: Number,
      },
    ],
    permissions: {
      viewRoles: [String],
      createRoles: [String],
      editRoles: [String],
      deleteRoles: [String],
      isPublic: Boolean,
      sharingStatus: {
        type: String,
        enum: ['PRIVATE', 'DEPARTMENT', 'SCHOOL', 'PUBLIC'],
        default: 'PRIVATE',
      },
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastRunDate: Date,
    totalGenerations: {
      type: Number,
      default: 0,
    },
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
reportSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('REP', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
reportSchema.index({ schoolId: 1, status: 1 });
reportSchema.index({ schoolId: 1, reportType: 1 });
reportSchema.index({ schoolId: 1, reportCategory: 1 });
reportSchema.index({ code: 1, schoolId: 1 });

// Virtual: Days since last run
reportSchema.virtual('daysSinceLastRun').get(function () {
  if (!this.lastRunDate) return null;
  const now = new Date();
  const timeDiff = now - this.lastRunDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is recently used
reportSchema.virtual('isRecentlyUsed').get(function () {
  if (!this.lastRunDate) return false;
  const now = new Date();
  const timeDiff = now - this.lastRunDate;
  return timeDiff < 7 * 24 * 60 * 60 * 1000; // 7 days
});

module.exports = mongoose.model('Report', reportSchema);
