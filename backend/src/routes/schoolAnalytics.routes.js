const express = require('express');
const schoolAnalyticsController = require('../controllers/schoolAnalytics.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Middleware
// ==================== SCHOOL DASHBOARD ====================
// Create dashboard
router.post(
  '/dashboards',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.createDashboard
);

// Get all dashboards
router.get(
  '/dashboards',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getDashboards
);

// Get dashboard by ID
router.get(
  '/dashboards/:dashboardId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getDashboardById
);

// Update dashboard
router.put(
  '/dashboards/:dashboardId',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.updateDashboard
);

// ==================== ACADEMICS REPORTS ====================
// Generate academic report
router.post(
  '/academics/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.generateAcademicsReport
);

// Get all academic reports
router.get(
  '/academics/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  schoolAnalyticsController.getAcademicsReports
);

// Get specific academic report
router.get(
  '/academics/reports/:reportId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  schoolAnalyticsController.getAcademicsReportById
);

// Get performance comparison
router.get(
  '/academics/comparison',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getPerformanceComparison
);

// Get performers list (toppers/improvers/strugglers)
router.get(
  '/academics/performers',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getPerformersList
);

// ==================== FINANCIAL REPORTS ====================
// Generate financial report
router.post(
  '/financial/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.generateFinancialReport
);

// Get all financial reports
router.get(
  '/financial/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getFinancialReports
);

// Get specific financial report
router.get(
  '/financial/reports/:reportId',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getFinancialReportById
);

// Get financial health status
router.get(
  '/financial/health',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getFinancialHealth
);

// Get fee collection status
router.get(
  '/financial/fee-collection',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getFeeCollectionStatus
);

// ==================== ENGAGEMENT METRICS ====================
// Create engagement metrics
router.post(
  '/engagement/metrics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.createEngagementMetrics
);

// Get all engagement metrics
router.get(
  '/engagement/metrics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  schoolAnalyticsController.getEngagementMetrics
);

// Get specific engagement metrics
router.get(
  '/engagement/metrics/:metricsId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  schoolAnalyticsController.getEngagementMetricsById
);

// Get student engagement summary
router.get(
  '/engagement/student-summary',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getStudentEngagementSummary
);

// Get engagement status
router.get(
  '/engagement/status',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getEngagementStatus
);

// ==================== SCHOOL BENCHMARKS ====================
// Generate benchmark
router.post(
  '/benchmarks',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.generateBenchmark
);

// Get all benchmarks
router.get(
  '/benchmarks',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getBenchmarks
);

// Get specific benchmark
router.get(
  '/benchmarks/:benchmarkId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getBenchmarkById
);

// Get benchmark comparison
router.get(
  '/benchmarks/comparison',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getBenchmarkComparison
);

// ==================== ANALYTICS SUMMARY ====================
// Get comprehensive analytics summary
router.get(
  '/summary/comprehensive',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getComprehensiveAnalytics
);

// Get executive summary (Principal/Admin dashboard)
router.get(
  '/summary/executive',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getExecutiveSummary
);

// Get alerts summary
router.get(
  '/summary/alerts',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  schoolAnalyticsController.getAlertsSummary
);

// Get recommendations summary
router.get(
  '/summary/recommendations',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getRecommendations
);

// ==================== TREND ANALYSIS ====================
// Get trend analysis
router.get(
  '/trends/analysis',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  schoolAnalyticsController.getTrendAnalysis
);

module.exports = router;
