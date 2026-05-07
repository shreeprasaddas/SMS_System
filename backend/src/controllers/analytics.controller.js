/**
 * Analytics Controller
 * HTTP request handlers for analytics and reporting
 */

const analyticsService = require('../services/analytics.service');
const { ResponseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

/**
 * Create Report
 * POST /api/v1/reports
 */
exports.createReport = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const report = await analyticsService.createReport(req.body, schoolId, userId);
    ResponseHelper.created(res, report, 'Report created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Reports
 * GET /api/v1/reports
 */
exports.getAllReports = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await analyticsService.getAllReports(schoolId, req.query);
    ResponseHelper.paginated(res, result.reports, result, 'Reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Report by ID
 * GET /api/v1/reports/:id
 */
exports.getReportById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const report = await analyticsService.getReportById(req.params.id, schoolId);
    ResponseHelper.success(res, report, 'Report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Report
 * PUT /api/v1/reports/:id
 */
exports.updateReport = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const report = await analyticsService.updateReport(req.params.id, req.body, schoolId, userId);
    ResponseHelper.success(res, report, 'Report updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Report Schedule
 * POST /api/v1/schedules
 */
exports.createSchedule = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const schedule = await analyticsService.createReportSchedule(req.body, schoolId, userId);
    ResponseHelper.created(res, schedule, 'Schedule created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Schedules
 * GET /api/v1/schedules
 */
exports.getAllSchedules = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await analyticsService.getAllReportSchedules(schoolId, req.query);
    ResponseHelper.paginated(res, result.schedules, result, 'Schedules retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Generate Report On-Demand
 * POST /api/v1/reports/:id/generate
 */
exports.generateReport = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const generatedReport = await analyticsService.generateReport(
      req.params.id,
      schoolId,
      userId,
      req.body.filters || {}
    );
    ResponseHelper.created(res, generatedReport, 'Report generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Generated Reports
 * GET /api/v1/reports/generated
 */
exports.getGeneratedReports = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await analyticsService.getGeneratedReports(schoolId, req.query);
    ResponseHelper.paginated(res, result.reports, result, 'Generated reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Dashboard
 * POST /api/v1/dashboards
 */
exports.createDashboard = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const dashboard = await analyticsService.createDashboard(req.body, schoolId, userId);
    ResponseHelper.created(res, dashboard, 'Dashboard created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Dashboards
 * GET /api/v1/dashboards
 */
exports.getAllDashboards = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await analyticsService.getAllDashboards(schoolId, req.query);
    ResponseHelper.paginated(res, result.dashboards, result, 'Dashboards retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Dashboard by ID
 * GET /api/v1/dashboards/:id
 */
exports.getDashboardById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const dashboard = await analyticsService.getDashboardById(req.params.id, schoolId);
    ResponseHelper.success(res, dashboard, 'Dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Metric
 * POST /api/v1/metrics
 */
exports.createMetric = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const metric = await analyticsService.createMetric(req.body, schoolId, userId);
    ResponseHelper.created(res, metric, 'Metric created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Metrics
 * GET /api/v1/metrics
 */
exports.getMetrics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await analyticsService.getMetrics(schoolId, req.query);
    ResponseHelper.paginated(res, result.metrics, result, 'Metrics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Analytics Summary
 * GET /api/v1/analytics/summary
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const analytics = await analyticsService.getAnalytics(schoolId);
    ResponseHelper.success(res, analytics, 'Analytics summary retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Export Report
 * GET /api/v1/reports/:id/export
 */
exports.exportReport = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const report = await analyticsService.getReportById(req.params.id, schoolId);
    // In real scenario, generate actual export file and send response
    ResponseHelper.success(res, { reportId: req.params.id, format: req.query.format || 'PDF' }, 'Report exported successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe to Dashboard
 * POST /api/v1/dashboards/:id/subscribe
 */
exports.subscribeToDashboard = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    // Add user to subscribers list
    ResponseHelper.success(res, { dashboardId: req.params.id, userId, subscriptionFrequency: req.body.frequency }, 'Subscribed to dashboard successfully');
  } catch (error) {
    next(error);
  }
};
