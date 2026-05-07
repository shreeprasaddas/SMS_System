/**
 * Student Performance Analytics Controller
 * Request handlers for performance analytics operations
 */

const performanceAnalyticsService = require('../services/performanceAnalytics.service');
const { validateRequest } = require('../utils/validation.helper');
const { ResponseHelper } = require('../utils/response.helper');
const {
  createPerformanceMetricSchema,
  getPerformanceMetricsSchema,
  updateLearningAnalyticsSchema,
  generateAcademicTrendSchema,
  createComparativeAnalysisSchema,
  generateAnalyticsReportSchema,
  getAcademicTrendsSchema,
  getComparativeAnalysisSchema,
  getAnalyticsReportsSchema,
  getAtRiskStudentsSchema,
  getClassAnalyticsSchema,
  getSubjectPerformanceSchema,
  getAnalyticsDashboardSchema,
} = require('../validations/performanceAnalytics.validation');

/**
 * Create performance metric
 * POST /performance-analytics/metrics
 */
exports.createPerformanceMetric = async (req, res, next) => {
  try {
    await validateRequest(req.body, createPerformanceMetricSchema);
    const metric = await performanceAnalyticsService.createPerformanceMetric(
      req.body,
      req.user.schoolId
    );
    return ResponseHelper.created(res, metric, 'Performance metric created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance metrics for student
 * GET /performance-analytics/metrics/:studentId
 */
exports.getPerformanceMetrics = async (req, res, next) => {
  try {
    await validateRequest(req.query, getPerformanceMetricsSchema);
    const result = await performanceAnalyticsService.getPerformanceMetrics(
      req.params.studentId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.metrics,
      result.total,
      result.page,
      result.limit,
      'Performance metrics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get learning analytics for student
 * GET /performance-analytics/learning/:studentId
 */
exports.getLearningAnalytics = async (req, res, next) => {
  try {
    const analytics = await performanceAnalyticsService.getLearningAnalytics(
      req.params.studentId,
      req.user.schoolId,
      req.query.academicYear
    );
    return ResponseHelper.success(res, analytics, 'Learning analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update learning analytics
 * PUT /performance-analytics/learning/:studentId
 */
exports.updateLearningAnalytics = async (req, res, next) => {
  try {
    await validateRequest(req.body, updateLearningAnalyticsSchema);
    const analytics = await performanceAnalyticsService.updateLearningAnalytics(
      req.params.studentId,
      req.user.schoolId,
      { ...req.body, performedBy: req.user._id }
    );
    return ResponseHelper.success(res, analytics, 'Learning analytics updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get academic trends for student
 * GET /performance-analytics/trends/:studentId
 */
exports.getAcademicTrends = async (req, res, next) => {
  try {
    await validateRequest(req.query, getAcademicTrendsSchema);
    const result = await performanceAnalyticsService.getAcademicTrends(
      req.params.studentId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.trends,
      result.total,
      result.page,
      result.limit,
      'Academic trends retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Generate academic trend analysis
 * POST /performance-analytics/trends
 */
exports.generateAcademicTrend = async (req, res, next) => {
  try {
    await validateRequest(req.body, generateAcademicTrendSchema);
    const trend = await performanceAnalyticsService.generateAcademicTrendAnalysis(
      req.body.studentId,
      req.user.schoolId,
      req.body
    );
    return ResponseHelper.created(res, trend, 'Academic trend analysis generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get comparative analysis report
 * GET /performance-analytics/comparison
 */
exports.getComparativeAnalysis = async (req, res, next) => {
  try {
    await validateRequest(req.query, getComparativeAnalysisSchema);
    const result = await performanceAnalyticsService.getComparativeAnalysis(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.reports,
      result.total,
      result.page,
      result.limit,
      'Comparative analysis retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create comparative analysis report
 * POST /performance-analytics/comparison
 */
exports.createComparativeAnalysis = async (req, res, next) => {
  try {
    await validateRequest(req.body, createComparativeAnalysisSchema);
    const report = await performanceAnalyticsService.createComparativeAnalysis(
      req.body,
      req.user.schoolId
    );
    return ResponseHelper.created(res, report, 'Comparative analysis created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics reports
 * GET /performance-analytics/reports
 */
exports.getAnalyticsReports = async (req, res, next) => {
  try {
    await validateRequest(req.query, getAnalyticsReportsSchema);
    const result = await performanceAnalyticsService.getAnalyticsReports(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.reports,
      result.total,
      result.page,
      result.limit,
      'Analytics reports retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Generate analytics report
 * POST /performance-analytics/reports
 */
exports.generateAnalyticsReport = async (req, res, next) => {
  try {
    await validateRequest(req.body, generateAnalyticsReportSchema);
    const report = await performanceAnalyticsService.generateAnalyticsReport(
      req.body,
      req.user.schoolId,
      req.user._id
    );
    return ResponseHelper.created(res, report, 'Analytics report generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get at-risk students
 * GET /performance-analytics/at-risk
 */
exports.getAtRiskStudents = async (req, res, next) => {
  try {
    await validateRequest(req.query, getAtRiskStudentsSchema);
    const result = await performanceAnalyticsService.getAtRiskStudents(req.user.schoolId, req.query);
    return ResponseHelper.paginated(
      res,
      result.students,
      result.total,
      result.page,
      result.limit,
      'At-risk students retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get predicted performance
 * GET /performance-analytics/predictions/:studentId
 */
exports.getPredictedPerformance = async (req, res, next) => {
  try {
    const prediction = await performanceAnalyticsService.getPredictedPerformance(
      req.params.studentId,
      req.user.schoolId
    );
    return ResponseHelper.success(res, prediction, 'Predicted performance retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get class analytics summary
 * GET /performance-analytics/class/:classId
 */
exports.getClassAnalytics = async (req, res, next) => {
  try {
    await validateRequest(req.query, getClassAnalyticsSchema);
    const summary = await performanceAnalyticsService.getClassAnalyticsSummary(
      req.params.classId,
      req.user.schoolId,
      req.query.academicYear
    );
    return ResponseHelper.success(res, summary, 'Class analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get subject performance analysis
 * GET /performance-analytics/subject/:subjectId
 */
exports.getSubjectPerformance = async (req, res, next) => {
  try {
    await validateRequest(req.query, getSubjectPerformanceSchema);
    const result = await performanceAnalyticsService.getSubjectPerformanceAnalysis(
      req.user.schoolId,
      req.params.subjectId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.metrics,
      result.total,
      result.page,
      result.limit,
      'Subject performance analysis retrieved successfully',
      { averagePerformance: result.averagePerformance }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics dashboard
 * GET /performance-analytics/dashboard
 */
exports.getAnalyticsDashboard = async (req, res, next) => {
  try {
    await validateRequest(req.query, getAnalyticsDashboardSchema);
    const dashboard = await performanceAnalyticsService.getAnalyticsDashboard(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.success(res, dashboard, 'Dashboard data retrieved successfully');
  } catch (error) {
    next(error);
  }
};
