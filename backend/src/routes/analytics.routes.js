/**
 * Analytics Routes
 * API endpoints for analytics and reporting
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const analyticsValidation = require('../validations/analytics.validation');

// Middleware: All routes require authentication
router.use(authenticate);

/**
 * REPORTS - Report Management
 */

// POST: Create report
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.createReportSchema, 'body'),
  analyticsController.createReport
);

// GET: List all reports
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(analyticsValidation.listReportsSchema, 'query'),
  analyticsController.getAllReports
);

// GET: Report by ID
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  analyticsController.getReportById
);

// PUT: Update report
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.createReportSchema, 'body'),
  analyticsController.updateReport
);

// POST: Generate report on-demand
router.post(
  '/:id/generate',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(analyticsValidation.generateReportSchema, 'body'),
  analyticsController.generateReport
);

// GET: Export report
router.get(
  '/:id/export',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  analyticsController.exportReport
);

/**
 * SCHEDULES - Automated Report Scheduling
 */

// POST: Create schedule
router.post(
  '/schedules/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.createScheduleSchema, 'body'),
  analyticsController.createSchedule
);

// GET: List schedules
router.get(
  '/schedules/list',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.listSchedulesSchema, 'query'),
  analyticsController.getAllSchedules
);

/**
 * GENERATED REPORTS - Report Instances
 */

// GET: List generated reports
router.get(
  '/generated/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(analyticsValidation.listGeneratedSchema, 'query'),
  analyticsController.getGeneratedReports
);

/**
 * DASHBOARDS - Dashboard Management
 */

// POST: Create dashboard
router.post(
  '/dashboards/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.createDashboardSchema, 'body'),
  analyticsController.createDashboard
);

// GET: List dashboards
router.get(
  '/dashboards/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(analyticsValidation.listDashboardsSchema, 'query'),
  analyticsController.getAllDashboards
);

// GET: Dashboard by ID
router.get(
  '/dashboards/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  analyticsController.getDashboardById
);

// POST: Subscribe to dashboard
router.post(
  '/dashboards/:id/subscribe',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  analyticsController.subscribeToDashboard
);

/**
 * METRICS - KPI and Metric Management
 */

// POST: Create metric
router.post(
  '/metrics/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(analyticsValidation.createMetricSchema, 'body'),
  analyticsController.createMetric
);

// GET: List metrics
router.get(
  '/metrics/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(analyticsValidation.listMetricsSchema, 'query'),
  analyticsController.getMetrics
);

/**
 * ANALYTICS SUMMARY - Overview & Insights
 */

// GET: Analytics summary
router.get(
  '/summary',
  authorize(['ADMIN', 'PRINCIPAL']),
  analyticsController.getAnalytics
);

module.exports = router;
