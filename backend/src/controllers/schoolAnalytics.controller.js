const schoolAnalyticsService = require('../services/schoolAnalytics.service');
const {
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
} = require('../validations/schoolAnalytics.validation');
const ResponseHelper = require('../utils/responseHelper');

const schoolAnalyticsController = {
  // Dashboard Handlers
  createDashboard: async (req, res, next) => {
    try {
      await createDashboardSchema.validateAsync(req.body);
      const dashboard = await schoolAnalyticsService.generateSchoolDashboard(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Dashboard created successfully', dashboard);
    } catch (error) {
      next(error);
    }
  },

  getDashboards: async (req, res, next) => {
    try {
      await getDashboardSchema.validateAsync(req.query);
      const result = await schoolAnalyticsService.getSchoolDashboard(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Dashboards retrieved', result.dashboards, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getDashboardById: async (req, res, next) => {
    try {
      const dashboard = await schoolAnalyticsService.getDashboardById(req.params.dashboardId, req.user.schoolId);
      ResponseHelper.success(res, 'Dashboard retrieved', dashboard);
    } catch (error) {
      next(error);
    }
  },

  updateDashboard: async (req, res, next) => {
    try {
      const dashboard = await schoolAnalyticsService.updateDashboard(
        req.params.dashboardId,
        req.user.schoolId,
        req.body
      );
      ResponseHelper.success(res, 'Dashboard updated', dashboard);
    } catch (error) {
      next(error);
    }
  },

  // Academic Reports Handlers
  generateAcademicsReport: async (req, res, next) => {
    try {
      await createAcademicsReportSchema.validateAsync(req.body);
      const report = await schoolAnalyticsService.generateAcademicsReport(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Academic report generated', report);
    } catch (error) {
      next(error);
    }
  },

  getAcademicsReports: async (req, res, next) => {
    try {
      await getAcademicsReportSchema.validateAsync(req.query);
      const result = await schoolAnalyticsService.getAcademicsReports(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Academic reports retrieved', result.reports, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getAcademicsReportById: async (req, res, next) => {
    try {
      const report = await schoolAnalyticsService.getAcademicsReportById(req.params.reportId, req.user.schoolId);
      ResponseHelper.success(res, 'Academic report retrieved', report);
    } catch (error) {
      next(error);
    }
  },

  // Financial Reports Handlers
  generateFinancialReport: async (req, res, next) => {
    try {
      await createFinancialReportSchema.validateAsync(req.body);
      const report = await schoolAnalyticsService.generateFinancialReport(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Financial report generated', report);
    } catch (error) {
      next(error);
    }
  },

  getFinancialReports: async (req, res, next) => {
    try {
      await getFinancialReportSchema.validateAsync(req.query);
      const result = await schoolAnalyticsService.getFinancialReports(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Financial reports retrieved', result.reports, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getFinancialReportById: async (req, res, next) => {
    try {
      const report = await schoolAnalyticsService.getFinancialReportById(req.params.reportId, req.user.schoolId);
      ResponseHelper.success(res, 'Financial report retrieved', report);
    } catch (error) {
      next(error);
    }
  },

  getFinancialHealth: async (req, res, next) => {
    try {
      const health = await schoolAnalyticsService.getFinancialHealthStatus(req.user.schoolId, req.query.academicYear);
      ResponseHelper.success(res, 'Financial health status', health);
    } catch (error) {
      next(error);
    }
  },

  // Engagement Metrics Handlers
  createEngagementMetrics: async (req, res, next) => {
    try {
      await createEngagementMetricsSchema.validateAsync(req.body);
      const metrics = await schoolAnalyticsService.createEngagementMetrics(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Engagement metrics created', metrics);
    } catch (error) {
      next(error);
    }
  },

  getEngagementMetrics: async (req, res, next) => {
    try {
      await getEngagementMetricsSchema.validateAsync(req.query);
      const result = await schoolAnalyticsService.getEngagementMetrics(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Engagement metrics retrieved', result.metrics, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getEngagementMetricsById: async (req, res, next) => {
    try {
      const metrics = await schoolAnalyticsService.getEngagementMetricsById(req.params.metricsId, req.user.schoolId);
      ResponseHelper.success(res, 'Engagement metrics retrieved', metrics);
    } catch (error) {
      next(error);
    }
  },

  getStudentEngagementSummary: async (req, res, next) => {
    try {
      const summary = await schoolAnalyticsService.getStudentEngagementSummary(
        req.user.schoolId,
        req.query.academicYear,
        req.query.limit || 10
      );
      ResponseHelper.success(res, 'Student engagement summary', summary);
    } catch (error) {
      next(error);
    }
  },

  // Benchmark Handlers
  generateBenchmark: async (req, res, next) => {
    try {
      await createBenchmarkSchema.validateAsync(req.body);
      const benchmark = await schoolAnalyticsService.generateSchoolBenchmark(req.body, req.user.schoolId);
      ResponseHelper.created(res, 'Benchmark generated', benchmark);
    } catch (error) {
      next(error);
    }
  },

  getBenchmarks: async (req, res, next) => {
    try {
      await getBenchmarkSchema.validateAsync(req.query);
      const result = await schoolAnalyticsService.getSchoolBenchmarks(req.user.schoolId, req.query);
      ResponseHelper.paginated(res, 'Benchmarks retrieved', result.benchmarks, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  },

  getBenchmarkById: async (req, res, next) => {
    try {
      const benchmark = await schoolAnalyticsService.getSchoolBenchmarkById(req.params.benchmarkId, req.user.schoolId);
      ResponseHelper.success(res, 'Benchmark retrieved', benchmark);
    } catch (error) {
      next(error);
    }
  },

  getBenchmarkComparison: async (req, res, next) => {
    try {
      const comparison = await schoolAnalyticsService.getBenchmarkComparison(req.user.schoolId, req.query.academicYear);
      ResponseHelper.success(res, 'Benchmark comparison retrieved', comparison);
    } catch (error) {
      next(error);
    }
  },

  // Summary & Analytics Handlers
  getComprehensiveAnalytics: async (req, res, next) => {
    try {
      await getComprehensiveSummarySchema.validateAsync(req.query);
      const analytics = await schoolAnalyticsService.getComprehensiveAnalyticsSummary(
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Comprehensive analytics retrieved', analytics);
    } catch (error) {
      next(error);
    }
  },

  getAlertsSummary: async (req, res, next) => {
    try {
      const alerts = await schoolAnalyticsService.getAlertsSummary(req.user.schoolId);
      ResponseHelper.success(res, 'Alerts summary retrieved', alerts);
    } catch (error) {
      next(error);
    }
  },

  getRecommendations: async (req, res, next) => {
    try {
      const recommendations = await schoolAnalyticsService.getRecommendationsSummary(
        req.user.schoolId,
        req.query.academicYear
      );
      ResponseHelper.success(res, 'Recommendations retrieved', recommendations);
    } catch (error) {
      next(error);
    }
  },

  getTrendAnalysis: async (req, res, next) => {
    try {
      await getTrendAnalysisSchema.validateAsync(req.query);
      const trends = await schoolAnalyticsService.getTrendAnalysis(
        req.user.schoolId,
        req.query.metric,
        req.query
      );
      ResponseHelper.success(res, 'Trend analysis retrieved', trends);
    } catch (error) {
      next(error);
    }
  },

  getPerformanceComparison: async (req, res, next) => {
    try {
      const comparison = await schoolAnalyticsService.getPerformanceComparison(
        req.user.schoolId,
        req.query.academicYear,
        req.query.comparisonType
      );
      ResponseHelper.success(res, 'Performance comparison retrieved', comparison);
    } catch (error) {
      next(error);
    }
  },

  getPerformersList: async (req, res, next) => {
    try {
      const performers = await schoolAnalyticsService.getPerformersList(
        req.user.schoolId,
        req.query.academicYear,
        req.query.category
      );
      ResponseHelper.success(res, 'Performers list retrieved', performers);
    } catch (error) {
      next(error);
    }
  },

  getFeeCollectionStatus: async (req, res, next) => {
    try {
      const status = await schoolAnalyticsService.getFeeCollectionStatus(req.user.schoolId, req.query.academicYear);
      ResponseHelper.success(res, 'Fee collection status retrieved', status);
    } catch (error) {
      next(error);
    }
  },

  getEngagementStatus: async (req, res, next) => {
    try {
      const status = await schoolAnalyticsService.getEngagementStatus(
        req.user.schoolId,
        req.query.academicYear,
        req.query.entityType
      );
      ResponseHelper.success(res, 'Engagement status retrieved', status);
    } catch (error) {
      next(error);
    }
  },

  getExecutiveSummary: async (req, res, next) => {
    try {
      const summary = await schoolAnalyticsService.getExecutiveSummary(req.user.schoolId, req.query.academicYear);
      ResponseHelper.success(res, 'Executive summary retrieved', summary);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = schoolAnalyticsController;
