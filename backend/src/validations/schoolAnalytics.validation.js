const Joi = require('joi');

const createDashboardSchema = Joi.object({
  dashboardType: Joi.string()
    .valid('PRINCIPAL', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT', 'FINANCE', 'ACADEMIC')
    .required(),
  academicYear: Joi.string().required(),
  overallMetrics: Joi.object({
    totalStudents: Joi.number(),
    totalTeachers: Joi.number(),
    totalClasses: Joi.number(),
    averageAttendance: Joi.number().min(0).max(100),
    academicPerformanceScore: Joi.number().min(0).max(100),
    schoolHealthScore: Joi.number().min(0).max(100),
  }),
  keyPerformanceIndicators: Joi.array().items(
    Joi.object({
      metricName: Joi.string(),
      metricValue: Joi.any(),
      targetValue: Joi.any(),
      status: Joi.string().valid('ON_TRACK', 'AT_RISK', 'CRITICAL', 'EXCEEDED'),
      trend: Joi.string().valid('INCREASING', 'DECREASING', 'STABLE'),
    })
  ),
}).unknown(true);

const getDashboardSchema = Joi.object({
  dashboardType: Joi.string().valid('PRINCIPAL', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT', 'FINANCE', 'ACADEMIC'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createAcademicsReportSchema = Joi.object({
  reportType: Joi.string()
    .valid('TERM_END', 'SEMESTER_END', 'ANNUAL', 'QUARTERLY', 'DIAGNOSTIC')
    .required(),
  academicYear: Joi.string().required(),
  reportPeriod: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    term: Joi.string(),
    semester: Joi.string(),
  }).required(),
  overallPerformance: Joi.object({
    totalStudents: Joi.number(),
    totalClasses: Joi.number(),
    averagePercentage: Joi.number().min(0).max(100),
    passPercentage: Joi.number().min(0).max(100),
  }),
  classWiseAnalysis: Joi.array().items(Joi.object().unknown(true)),
  subjectAnalysis: Joi.array().items(Joi.object().unknown(true)),
}).unknown(true);

const getAcademicsReportSchema = Joi.object({
  reportType: Joi.string().valid('TERM_END', 'SEMESTER_END', 'ANNUAL', 'QUARTERLY', 'DIAGNOSTIC'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createFinancialReportSchema = Joi.object({
  reportType: Joi.string()
    .valid('MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL', 'CASH_FLOW', 'BUDGET_vs_ACTUAL')
    .required(),
  academicYear: Joi.string().required(),
  reportPeriod: Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date(),
    month: Joi.string(),
    quarter: Joi.string(),
  }).required(),
  revenue: Joi.object({
    totalExpectedRevenue: Joi.number().default(0),
    totalFeeCollected: Joi.number().default(0),
    otherIncome: Joi.number().default(0),
  }),
  expenses: Joi.object({
    totalExpenses: Joi.number().default(0),
    salaryExpenses: Joi.number().default(0),
    maintenanceExpenses: Joi.number().default(0),
  }),
}).unknown(true);

const getFinancialReportSchema = Joi.object({
  reportType: Joi.string().valid('MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL', 'CASH_FLOW', 'BUDGET_vs_ACTUAL'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createEngagementMetricsSchema = Joi.object({
  entityType: Joi.string().valid('STUDENT', 'TEACHER', 'PARENT', 'CLASS', 'SCHOOL').required(),
  entityId: Joi.string().length(24).hex().required(),
  entityName: Joi.string(),
  academicYear: Joi.string().required(),
  studentEngagement: Joi.object({
    attendanceScore: Joi.number().min(0).max(100),
    classParticipationScore: Joi.number().min(0).max(100),
    assignmentSubmissionRate: Joi.number().min(0).max(100),
    overallEngagementScore: Joi.number().min(0).max(100),
  }),
  teacherEngagement: Joi.object({
    lessonPlanPreparation: Joi.number().min(0).max(100),
    classroomEffectiveness: Joi.number().min(0).max(100),
    overallEngagementScore: Joi.number().min(0).max(100),
  }),
}).unknown(true);

const getEngagementMetricsSchema = Joi.object({
  entityType: Joi.string().valid('STUDENT', 'TEACHER', 'PARENT', 'CLASS', 'SCHOOL'),
  entityId: Joi.string().length(24).hex(),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createBenchmarkSchema = Joi.object({
  benchmarkType: Joi.string()
    .valid('DISTRICT_COMPARISON', 'NATIONAL_STANDARD', 'PEER_GROUP', 'HISTORICAL', 'CUSTOM')
    .required(),
  academicYear: Joi.string().required(),
  comparisonPeriod: Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
  academicPerformance: Joi.object({
    schoolAveragePercentage: Joi.number(),
    districtAveragePercentage: Joi.number(),
    nationalAveragePercentage: Joi.number(),
  }),
}).unknown(true);

const getBenchmarkSchema = Joi.object({
  benchmarkType: Joi.string().valid('DISTRICT_COMPARISON', 'NATIONAL_STANDARD', 'PEER_GROUP', 'HISTORICAL', 'CUSTOM'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const getTrendAnalysisSchema = Joi.object({
  metric: Joi.string().valid('academics', 'financial', 'engagement').default('academics'),
  academicYear: Joi.string(),
});

const getComprehensiveSummarySchema = Joi.object({
  academicYear: Joi.string().required(),
});

module.exports = {
  createDashboardSchema,
  getDashboardSchema,
  createAcademicsReportSchema,
  getAcademicsReportSchema,
  createFinancialReportSchema,
  getFinancialReportSchema,
  createEngagementMetricsSchema,
  getEngagementMetricsSchema,
  createBenchmarkSchema,
  getBenchmarkSchema,
  getTrendAnalysisSchema,
  getComprehensiveSummarySchema,
};
