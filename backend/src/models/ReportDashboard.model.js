/**
 * ReportDashboard Model
 * Dashboard configurations with widgets and visualization
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const reportDashboardSchema = new mongoose.Schema(
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
    dashboardName: {
      type: String,
      required: true,
      trim: true,
    },
    dashboardDescription: String,
    dashboardType: {
      type: String,
      enum: ['EXECUTIVE', 'OPERATIONAL', 'DEPARTMENTAL', 'PERSONAL', 'CUSTOM'],
      default: 'CUSTOM',
    },
    dashboardCategory: {
      type: String,
      enum: ['ACADEMIC', 'FINANCIAL', 'ADMINISTRATIVE', 'STUDENT', 'STAFF', 'INVENTORY', 'CUSTOM'],
    },
    layoutConfiguration: {
      gridLayout: {
        columns: { type: Number, default: 12 },
        rowHeight: { type: Number, default: 80 },
        margin: Number,
        containerPadding: Number,
      },
      theme: {
        colorScheme: {
          type: String,
          enum: ['LIGHT', 'DARK', 'AUTO'],
          default: 'LIGHT',
        },
        primaryColor: String,
        accentColor: String,
        fontFamily: String,
      },
      refreshInterval: {
        value: Number,
        unit: {
          type: String,
          enum: ['SECONDS', 'MINUTES', 'HOURS'],
        },
      },
    },
    widgets: [
      {
        widgetId: mongoose.Schema.Types.ObjectId,
        widgetType: {
          type: String,
          enum: ['CARD', 'CHART', 'TABLE', 'GAUGE', 'METRIC', 'KPI', 'TIMELINE', 'MAP', 'CUSTOM'],
        },
        widgetTitle: String,
        chartType: {
          type: String,
          enum: ['LINE', 'BAR', 'PIE', 'DOUGHNUT', 'AREA', 'SCATTER', 'BUBBLE', 'RADAR'],
        },
        dataSource: {
          reportId: mongoose.Schema.Types.ObjectId,
          reportName: String,
          queryType: String,
          customQuery: mongoose.Schema.Types.Mixed,
        },
        dataMapping: {
          xAxis: String,
          yAxis: String,
          dataFields: [String],
          aggregation: String,
        },
        displaySettings: {
          showLegend: Boolean,
          showGridlines: Boolean,
          showValues: Boolean,
          decimalsPlaces: Number,
          valueFormat: String,
        },
        gridPosition: {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
        },
        drillDown: {
          isEnabled: Boolean,
          targetDashboard: mongoose.Schema.Types.ObjectId,
          drillDownFields: [String],
        },
        refreshSettings: {
          autoRefresh: Boolean,
          refreshInterval: Number,
        },
        lastUpdated: Date,
        cacheExpiry: Number,
      },
    ],
    filters: [
      {
        filterId: mongoose.Schema.Types.ObjectId,
        filterName: String,
        filterType: {
          type: String,
          enum: ['DROPDOWN', 'MULTISELECT', 'DATERANGE', 'SEARCH', 'SLIDER'],
        },
        filterField: String,
        defaultValue: mongoose.Schema.Types.Mixed,
        options: [
          {
            label: String,
            value: mongoose.Schema.Types.Mixed,
          },
        ],
        isRequired: Boolean,
        appliesToWidgets: [mongoose.Schema.Types.ObjectId],
      },
    ],
    permissions: {
      viewRoles: [String],
      editRoles: [String],
      deleteRoles: [String],
      sharingStatus: {
        type: String,
        enum: ['PRIVATE', 'DEPARTMENT', 'SCHOOL', 'PUBLIC'],
        default: 'PRIVATE',
      },
      isPublic: Boolean,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subscribers: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        subscriptionDate: Date,
        notificationFrequency: {
          type: String,
          enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER'],
        },
      },
    ],
    usageStatistics: {
      totalViews: {
        type: Number,
        default: 0,
      },
      totalSubscribers: {
        type: Number,
        default: 0,
      },
      lastAccessedDate: Date,
      lastAccessedBy: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
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
reportDashboardSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('DASH', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
reportDashboardSchema.index({ schoolId, status: 1 });
reportDashboardSchema.index({ dashboardType: 1, schoolId: 1 });
reportDashboardSchema.index({ code: 1, schoolId: 1 });

// Virtual: Widget count
reportDashboardSchema.virtual('widgetCount').get(function () {
  return (this.widgets || []).length;
});

// Virtual: Filter count
reportDashboardSchema.virtual('filterCount').get(function () {
  return (this.filters || []).length;
});

// Virtual: Subscriber count
reportDashboardSchema.virtual('subscriberCount').get(function () {
  return (this.subscribers || []).length;
});

// Virtual: Days since last accessed
reportDashboardSchema.virtual('daysSinceLastAccess').get(function () {
  if (!this.usageStatistics?.lastAccessedDate) return null;
  const now = new Date();
  const timeDiff = now - this.usageStatistics.lastAccessedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('ReportDashboard', reportDashboardSchema);
