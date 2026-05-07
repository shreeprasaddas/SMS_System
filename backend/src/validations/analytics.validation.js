/**
 * Analytics Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Create Report Schema
 */
exports.createReportSchema = Joi.object({
  reportName: Joi.string().required().trim().min(3).max(100),
  reportDescription: Joi.string().trim().max(500),
  reportType: Joi.string()
    .required()
    .valid(
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
      'OTHER'
    ),
  reportCategory: Joi.string()
    .required()
    .valid('STUDENT', 'STAFF', 'FINANCIAL', 'OPERATIONAL', 'ACADEMIC', 'ADMIN', 'CUSTOM'),
  dataSource: Joi.object({
    collectionName: Joi.string(),
    databaseName: Joi.string(),
    queryType: Joi.string().valid('DIRECT_QUERY', 'AGGREGATION', 'CUSTOM_FUNCTION', 'API_CALL'),
    filters: Joi.array().items(
      Joi.object({
        fieldName: Joi.string(),
        operator: Joi.string().valid('EQ', 'NE', 'GT', 'LT', 'GTE', 'LTE', 'IN', 'NIN', 'REGEX', 'EXISTS'),
        value: Joi.any(),
      })
    ),
  }),
  permissions: Joi.object({
    viewRoles: Joi.array().items(Joi.string()),
    sharingStatus: Joi.string().valid('PRIVATE', 'DEPARTMENT', 'SCHOOL', 'PUBLIC'),
  }),
}).unknown(false);

/**
 * Create Report Schedule Schema
 */
exports.createScheduleSchema = Joi.object({
  reportId: Joi.string().hex().length(24).required(),
  scheduleName: Joi.string().required().trim().min(3).max(100),
  scheduleDescription: Joi.string().trim().max(500),
  frequency: Joi.string()
    .required()
    .valid('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'CUSTOM', 'ONCE'),
  schedulePattern: Joi.object({
    dayOfWeek: Joi.array().items(Joi.number().min(0).max(6)),
    dayOfMonth: Joi.number().min(1).max(31),
    monthOfYear: Joi.number().min(1).max(12),
    time: Joi.string(),
    timezone: Joi.string(),
  }),
  executionSettings: Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date(),
    maxExecutions: Joi.number(),
    isActive: Joi.boolean(),
  }),
  deliverySettings: Joi.object({
    deliveryMethods: Joi.array().items(
      Joi.object({
        method: Joi.string().valid('EMAIL', 'SMS', 'PORTAL', 'DATABASE', 'CLOUD_STORAGE', 'FTP'),
        attachmentFormat: Joi.string().valid('PDF', 'EXCEL', 'CSV', 'JSON', 'HTML'),
      })
    ),
  }),
}).unknown(false);

/**
 * Generate Report Schema
 */
exports.generateReportSchema = Joi.object({
  reportId: Joi.string().hex().length(24).required(),
  filters: Joi.object().unknown(true),
}).unknown(false);

/**
 * Create Dashboard Schema
 */
exports.createDashboardSchema = Joi.object({
  dashboardName: Joi.string().required().trim().min(3).max(100),
  dashboardDescription: Joi.string().trim().max(500),
  dashboardType: Joi.string()
    .valid('EXECUTIVE', 'OPERATIONAL', 'DEPARTMENTAL', 'PERSONAL', 'CUSTOM'),
  dashboardCategory: Joi.string()
    .valid('ACADEMIC', 'FINANCIAL', 'ADMINISTRATIVE', 'STUDENT', 'STAFF', 'INVENTORY', 'CUSTOM'),
  layoutConfiguration: Joi.object({
    gridLayout: Joi.object({
      columns: Joi.number().min(1).max(24),
      rowHeight: Joi.number().min(20),
    }),
    theme: Joi.object({
      colorScheme: Joi.string().valid('LIGHT', 'DARK', 'AUTO'),
    }),
    refreshInterval: Joi.object({
      value: Joi.number(),
      unit: Joi.string().valid('SECONDS', 'MINUTES', 'HOURS'),
    }),
  }),
  widgets: Joi.array().items(
    Joi.object({
      widgetType: Joi.string()
        .valid('CARD', 'CHART', 'TABLE', 'GAUGE', 'METRIC', 'KPI', 'TIMELINE', 'MAP', 'CUSTOM'),
      widgetTitle: Joi.string(),
      chartType: Joi.string()
        .valid('LINE', 'BAR', 'PIE', 'DOUGHNUT', 'AREA', 'SCATTER', 'BUBBLE', 'RADAR'),
      dataSource: Joi.object({
        reportId: Joi.string().hex().length(24),
      }),
    })
  ),
  permissions: Joi.object({
    viewRoles: Joi.array().items(Joi.string()),
    sharingStatus: Joi.string().valid('PRIVATE', 'DEPARTMENT', 'SCHOOL', 'PUBLIC'),
  }),
}).unknown(false);

/**
 * Create Metric Schema
 */
exports.createMetricSchema = Joi.object({
  metricName: Joi.string().required().trim().min(3).max(100),
  metricDescription: Joi.string().trim().max(500),
  metricType: Joi.string()
    .required()
    .valid('KPI', 'INDICATOR', 'CUSTOM_METRIC', 'RATIO', 'TREND', 'BENCHMARK'),
  metricCategory: Joi.string()
    .required()
    .valid('ACADEMIC', 'OPERATIONAL', 'FINANCIAL', 'STUDENT', 'STAFF', 'ATTENDANCE', 'CUSTOM'),
  calculation: Joi.object({
    calculationType: Joi.string()
      .valid('SIMPLE', 'AGGREGATE', 'FORMULA', 'CUSTOM_FUNCTION', 'EXTERNAL_API'),
    formula: Joi.string(),
    refreshFrequency: Joi.string()
      .valid('REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND'),
  }),
  display: Joi.object({
    displayFormat: Joi.string()
      .valid('NUMBER', 'PERCENTAGE', 'CURRENCY', 'DECIMAL', 'RATIO', 'TEXT'),
    decimalPlaces: Joi.number().min(0).max(10),
    unit: Joi.string(),
  }),
  targets: Joi.object({
    hasTarget: Joi.boolean(),
    targetValue: Joi.number(),
    trackingPeriod: Joi.string()
      .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'),
  }),
}).unknown(false);

/**
 * Update Dashboard Schema
 */
exports.updateDashboardSchema = Joi.object({
  dashboardName: Joi.string().trim().min(3).max(100),
  dashboardDescription: Joi.string().trim().max(500),
  layoutConfiguration: Joi.object().unknown(true),
  widgets: Joi.array().items(Joi.object().unknown(true)),
  filters: Joi.array().items(Joi.object().unknown(true)),
}).unknown(false);

/**
 * List Reports Query Schema
 */
exports.listReportsSchema = Joi.object({
  reportType: Joi.string().valid(
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
    'OTHER'
  ),
  reportCategory: Joi.string().valid('STUDENT', 'STAFF', 'FINANCIAL', 'OPERATIONAL', 'ACADEMIC', 'ADMIN', 'CUSTOM'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Schedules Query Schema
 */
exports.listSchedulesSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'PAUSED'),
  frequency: Joi.string()
    .valid('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'CUSTOM', 'ONCE'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Generated Reports Query Schema
 */
exports.listGeneratedSchema = Joi.object({
  reportId: Joi.string().hex().length(24),
  status: Joi.string().valid('GENERATING', 'READY', 'ARCHIVED', 'FAILED', 'EXPIRED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Dashboards Query Schema
 */
exports.listDashboardsSchema = Joi.object({
  dashboardType: Joi.string().valid('EXECUTIVE', 'OPERATIONAL', 'DEPARTMENTAL', 'PERSONAL', 'CUSTOM'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Metrics Query Schema
 */
exports.listMetricsSchema = Joi.object({
  metricType: Joi.string().valid('KPI', 'INDICATOR', 'CUSTOM_METRIC', 'RATIO', 'TREND', 'BENCHMARK'),
  metricCategory: Joi.string()
    .valid('ACADEMIC', 'OPERATIONAL', 'FINANCIAL', 'STUDENT', 'STAFF', 'ATTENDANCE', 'CUSTOM'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);
