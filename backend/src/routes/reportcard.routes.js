/**
 * ReportCard Routes
 * API endpoints for report card management
 */

const express = require('express');
const router = express.Router();
const ReportCardController = require('../controllers/reportcard.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const reportCardValidation = require('../validations/reportcard.validation');

/**
 * Report Card Generation Routes
 */

// Generate report card
router.post(
  '/generate',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(reportCardValidation.generateReportCardSchema, 'body'),
  ReportCardController.generateReportCard
);

/**
 * Report Card Retrieval Routes
 */

// Get report card by ID
router.get(
  '/:reportCardId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  ReportCardController.getReportCardById
);

// Get student report cards
router.get(
  '/student/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(reportCardValidation.getReportCardsSchema, 'query'),
  ReportCardController.getStudentReportCards
);

// Get class report cards
router.get(
  '/class/:classId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(reportCardValidation.getClassReportCardsSchema, 'query'),
  ReportCardController.getClassReportCards
);

/**
 * Report Card Status Routes
 */

// Finalize report card
router.patch(
  '/:reportCardId/finalize',
  authorize(['ADMIN', 'PRINCIPAL']),
  ReportCardController.finalizeReportCard
);

// Publish report card
router.patch(
  '/:reportCardId/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  ReportCardController.publishReportCard
);

// Publish class report cards
router.patch(
  '/class/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(reportCardValidation.publishReportCardsSchema, 'body'),
  ReportCardController.publishClassReportCards
);

/**
 * Remarks Routes
 */

// Add principal remarks
router.patch(
  '/:reportCardId/principal-remarks',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(reportCardValidation.remarksSchema, 'body'),
  ReportCardController.addPrincipalRemarks
);

// Add class teacher remarks
router.patch(
  '/:reportCardId/teacher-remarks',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(reportCardValidation.remarksSchema, 'body'),
  ReportCardController.addClassTeacherRemarks
);

/**
 * Statistics Routes
 */

// Get class statistics
router.get(
  '/class-stats',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(reportCardValidation.classStatsSchema, 'query'),
  ReportCardController.getClassReportCardStats
);

module.exports = router;
