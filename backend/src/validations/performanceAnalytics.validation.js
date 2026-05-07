/**
 * Student Performance Analytics Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Schema: Create performance metric
 */
exports.createPerformanceMetricSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  subjectId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  assessmentType: Joi.string()
    .valid('CLASS_TEST', 'UNIT_TEST', 'PERIODICAL', 'TERMINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT', 'QUIZ')
    .required(),
  assessmentDate: Joi.date().required(),
  academicYear: Joi.string().required(),
  assessmentDetails: Joi.object({
    assessmentId: Joi.string().hex().length(24),
    assessmentName: Joi.string(),
    totalMarks: Joi.number().required(),
    passingMarks: Joi.number(),
    marksObtained: Joi.number().required(),
    feedback: Joi.string(),
  }).required(),
}).unknown(false);

/**
 * Schema: Get performance metrics (query validation)
 */
exports.getPerformanceMetricsSchema = Joi.object({
  subjectId: Joi.string().hex().length(24),
  assessmentType: Joi.string()
    .valid('CLASS_TEST', 'UNIT_TEST', 'PERIODICAL', 'TERMINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT', 'QUIZ'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Update learning analytics
 */
exports.updateLearningAnalyticsSchema = Joi.object({
  academicYear: Joi.string().required(),
  studyPatterns: Joi.object({
    averageStudyHoursPerDay: Joi.number(),
    preferredStudyTime: Joi.string().valid('EARLY_MORNING', 'MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'),
    studySessionFrequency: Joi.string().valid('DAILY', 'ALTERNATE_DAYS', 'WEEKLY', 'IRREGULAR'),
    averageSessionDuration: Joi.number(),
    consistencyScore: Joi.number().min(0).max(100),
  }),
  engagementMetrics: Joi.object({
    classAttendancePercentage: Joi.number().min(0).max(100),
    participationScore: Joi.number().min(0).max(100),
    assignmentSubmissionRate: Joi.number().min(0).max(100),
    onTimeSubmissionPercentage: Joi.number().min(0).max(100),
  }),
}).unknown(false);

/**
 * Schema: Generate academic trend
 */
exports.generateAcademicTrendSchema = Joi.object({
  analysisPeriod: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    academicYear: Joi.string().required(),
  }).required(),
  periodType: Joi.string().valid('MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL').required(),
  trendMetrics: Joi.object({
    overallTrend: Joi.string().valid('IMPROVING', 'DECLINING', 'STABLE').required(),
    trendStrength: Joi.number().min(0).max(100),
    averageGrowthRate: Joi.number(),
  }).required(),
}).unknown(false);

/**
 * Schema: Create comparative analysis report
 */
exports.createComparativeAnalysisSchema = Joi.object({
  analysisPeriod: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    academicYear: Joi.string().required(),
    semester: Joi.string().valid('SEMESTER_1', 'SEMESTER_2', 'ANNUAL'),
  }).required(),
  groupComparisons: Joi.array().items(
    Joi.object({
      groupName: Joi.string().valid('CLASS', 'GRADE', 'SECTION', 'SCHOOL', 'BOARD').required(),
      groupId: Joi.string().hex().length(24),
      totalStudentsInGroup: Joi.number(),
    })
  ),
}).unknown(false);

/**
 * Schema: Generate analytics report
 */
exports.generateAnalyticsReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(
      'STUDENT_PERFORMANCE_SUMMARY',
      'LEARNING_ANALYTICS_REPORT',
      'ACADEMIC_TREND_ANALYSIS',
      'COMPARATIVE_ANALYSIS',
      'PREDICTION_REPORT'
    )
    .required(),
  reportScope: Joi.object({
    scopeType: Joi.string().valid('INDIVIDUAL_STUDENT', 'CLASS', 'GRADE', 'SUBJECT', 'SCHOOL').required(),
    scopeId: Joi.string().hex().length(24),
  }).required(),
  reportPeriod: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    academicYear: Joi.string().required(),
  }).required(),
}).unknown(false);

/**
 * Schema: Get academic trends (query validation)
 */
exports.getAcademicTrendsSchema = Joi.object({
  periodType: Joi.string().valid('MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get comparative analysis (query validation)
 */
exports.getComparativeAnalysisSchema = Joi.object({
  academicYear: Joi.string().required(),
  groupType: Joi.string().valid('CLASS', 'GRADE', 'SECTION', 'SCHOOL', 'BOARD'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get analytics reports (query validation)
 */
exports.getAnalyticsReportsSchema = Joi.object({
  reportType: Joi.string()
    .valid(
      'STUDENT_PERFORMANCE_SUMMARY',
      'LEARNING_ANALYTICS_REPORT',
      'ACADEMIC_TREND_ANALYSIS',
      'COMPARATIVE_ANALYSIS',
      'PREDICTION_REPORT'
    ),
  academicYear: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get at-risk students (query validation)
 */
exports.getAtRiskStudentsSchema = Joi.object({
  riskLevel: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').default('HIGH'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get class analytics summary (query validation)
 */
exports.getClassAnalyticsSchema = Joi.object({
  classId: Joi.string().hex().length(24).required(),
  academicYear: Joi.string().required(),
}).unknown(true);

/**
 * Schema: Get subject performance (query validation)
 */
exports.getSubjectPerformanceSchema = Joi.object({
  subjectId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24),
  academicYear: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get analytics dashboard (query validation)
 */
exports.getAnalyticsDashboardSchema = Joi.object({
  academicYear: Joi.string(),
}).unknown(true);
