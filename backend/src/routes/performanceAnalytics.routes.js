/**
 * Student Performance Analytics Routes
 * RBAC-enforced endpoints for performance analytics operations
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const performanceAnalyticsController = require('../controllers/performanceAnalytics.controller');

// Middleware to attach schoolId from auth
router.use(authenticate);

/**
 * Performance Metrics Routes
 */

// Create performance metric
router.post(
  '/metrics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.createPerformanceMetric
);

// Get performance metrics for student
router.get(
  '/metrics/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  performanceAnalyticsController.getPerformanceMetrics
);

// Get metric by ID
router.get(
  '/metrics/:metricId/detail',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const PerformanceMetric = require('../models/PerformanceMetric.model');
      const metric = await PerformanceMetric.findById(req.params.metricId).lean();

      if (!metric) {
        return res.status(404).json({ success: false, message: 'Metric not found' });
      }

      return res.json({ success: true, data: metric });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Learning Analytics Routes
 */

// Get learning analytics for student
router.get(
  '/learning/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  performanceAnalyticsController.getLearningAnalytics
);

// Update learning analytics
router.put(
  '/learning/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.updateLearningAnalytics
);

// Get study patterns
router.get(
  '/learning/:studentId/study-patterns',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  async (req, res, next) => {
    try {
      const LearningAnalytics = require('../models/LearningAnalytics.model');
      const analytics = await LearningAnalytics.findOne({
        studentId: req.params.studentId,
        schoolId: req.user.schoolId,
      })
        .select('studyPatterns')
        .lean();

      return res.json({ success: true, data: analytics?.studyPatterns || {} });
    } catch (error) {
      next(error);
    }
  }
);

// Get engagement metrics
router.get(
  '/learning/:studentId/engagement',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  async (req, res, next) => {
    try {
      const LearningAnalytics = require('../models/LearningAnalytics.model');
      const analytics = await LearningAnalytics.findOne({
        studentId: req.params.studentId,
        schoolId: req.user.schoolId,
      })
        .select('engagementMetrics')
        .lean();

      return res.json({ success: true, data: analytics?.engagementMetrics || {} });
    } catch (error) {
      next(error);
    }
  }
);

// Get risk assessment
router.get(
  '/learning/:studentId/risks',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LearningAnalytics = require('../models/LearningAnalytics.model');
      const analytics = await LearningAnalytics.findOne({
        studentId: req.params.studentId,
        schoolId: req.user.schoolId,
      })
        .select('risksAndChallenges')
        .lean();

      return res.json({ success: true, data: analytics?.risksAndChallenges || {} });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Academic Trends Routes
 */

// Get academic trends for student
router.get(
  '/trends/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  performanceAnalyticsController.getAcademicTrends
);

// Generate academic trend analysis
router.post(
  '/trends',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  performanceAnalyticsController.generateAcademicTrend
);

// Get trend details
router.get(
  '/trends/:trendId/detail',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const AcademicTrend = require('../models/AcademicTrend.model');
      const trend = await AcademicTrend.findById(req.params.trendId).lean();

      if (!trend) {
        return res.status(404).json({ success: false, message: 'Trend not found' });
      }

      return res.json({ success: true, data: trend });
    } catch (error) {
      next(error);
    }
  }
);

// Get trend predictions
router.get(
  '/trends/:trendId/predictions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  async (req, res, next) => {
    try {
      const AcademicTrend = require('../models/AcademicTrend.model');
      const trend = await AcademicTrend.findById(req.params.trendId)
        .select('predictiveAnalysis')
        .lean();

      if (!trend) {
        return res.status(404).json({ success: false, message: 'Trend not found' });
      }

      return res.json({ success: true, data: trend.predictiveAnalysis || {} });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Comparative Analysis Routes
 */

// Get comparative analysis reports
router.get(
  '/comparison',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.getComparativeAnalysis
);

// Create comparative analysis
router.post(
  '/comparison',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  performanceAnalyticsController.createComparativeAnalysis
);

// Get comparison details
router.get(
  '/comparison/:reportId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const ComparativeAnalysisReport = require('../models/ComparativeAnalysisReport.model');
      const report = await ComparativeAnalysisReport.findById(req.params.reportId).lean();

      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      return res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
);

// Get peer comparison for student
router.get(
  '/comparison/:reportId/peer/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  async (req, res, next) => {
    try {
      const ComparativeAnalysisReport = require('../models/ComparativeAnalysisReport.model');
      const report = await ComparativeAnalysisReport.findById(req.params.reportId)
        .select('individualComparisons peerGroupAnalysis')
        .lean();

      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      const studentComparison = report.individualComparisons?.find(
        (c) => c.studentId.toString() === req.params.studentId
      );

      return res.json({
        success: true,
        data: {
          studentComparison,
          peerAnalysis: report.peerGroupAnalysis,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Analytics Reports Routes
 */

// Get analytics reports
router.get(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.getAnalyticsReports
);

// Generate analytics report
router.post(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  performanceAnalyticsController.generateAnalyticsReport
);

// Get report details
router.get(
  '/reports/:reportId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const AnalyticsReport = require('../models/AnalyticsReport.model');
      const report = await AnalyticsReport.findById(req.params.reportId).lean();

      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      return res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
);

// Download analytics report
router.get(
  '/reports/:reportId/download',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      return res.json({ success: true, message: 'Report prepared for download' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Risk & Predictions Routes
 */

// Get at-risk students
router.get(
  '/at-risk',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  performanceAnalyticsController.getAtRiskStudents
);

// Get at-risk details for specific student
router.get(
  '/at-risk/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LearningAnalytics = require('../models/LearningAnalytics.model');
      const analytics = await LearningAnalytics.findOne({
        studentId: req.params.studentId,
        schoolId: req.user.schoolId,
      })
        .select('risksAndChallenges')
        .lean();

      if (!analytics) {
        return res.json({ success: true, data: { isAtRisk: false } });
      }

      return res.json({ success: true, data: analytics.risksAndChallenges || {} });
    } catch (error) {
      next(error);
    }
  }
);

// Get predicted performance
router.get(
  '/predictions/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  performanceAnalyticsController.getPredictedPerformance
);

/**
 * Class & Subject Analytics Routes
 */

// Get class analytics
router.get(
  '/class/:classId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.getClassAnalytics
);

// Get subject performance analysis
router.get(
  '/subject/:subjectId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.getSubjectPerformance
);

/**
 * Dashboard Routes
 */

// Get analytics dashboard
router.get(
  '/dashboard',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  performanceAnalyticsController.getAnalyticsDashboard
);

// Get personalized dashboard for student
router.get(
  '/dashboard/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  async (req, res, next) => {
    try {
      const [metrics, analytics, trend] = await Promise.all([
        require('../models/PerformanceMetric.model')
          .find({ studentId: req.params.studentId, schoolId: req.user.schoolId })
          .sort({ assessmentDate: -1 })
          .limit(5)
          .lean(),
        require('../models/LearningAnalytics.model').findOne({
          studentId: req.params.studentId,
          schoolId: req.user.schoolId,
        }),
        require('../models/AcademicTrend.model').findOne({
          studentId: req.params.studentId,
          schoolId: req.user.schoolId,
          status: 'ACTIVE',
        }),
      ]);

      return res.json({
        success: true,
        data: {
          recentMetrics: metrics,
          learningAnalytics: analytics,
          academicTrend: trend,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
