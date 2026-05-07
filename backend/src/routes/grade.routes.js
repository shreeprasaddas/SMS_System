/**
 * Grade Routes
 * API endpoints for grade management
 */

const express = require('express');
const router = express.Router();
const GradeController = require('../controllers/grade.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const gradeValidation = require('../validations/grade.validation');

// All routes require authentication
router.use(authenticate);

/**
 * Grade CRUD Routes
 */

// Create grade
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(gradeValidation.createGradeSchema, 'body'),
  GradeController.createGrade
);

// Get grades with filters
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  validateRequest(gradeValidation.getGradesSchema, 'query'),
  GradeController.getGrades
);

// Get grade by ID
router.get(
  '/:gradeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  GradeController.getGradeById
);

/**
 * Grade Workflow Routes
 */

// Finalize grades
router.patch(
  '/finalize',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(gradeValidation.finalizeGradesSchema, 'body'),
  GradeController.finalizeGrades
);

// Publish grades
router.patch(
  '/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(gradeValidation.publishGradesSchema, 'body'),
  GradeController.publishGrades
);

// Contest grade
router.post(
  '/:gradeId/contest',
  authorize(['STUDENT', 'PARENT']),
  validateRequest(gradeValidation.contestGradeSchema, 'body'),
  GradeController.contestGrade
);

// Resolve contest
router.patch(
  '/:gradeId/resolve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(gradeValidation.resolveContestSchema, 'body'),
  GradeController.resolveGradeContest
);

/**
 * Grade Statistics & Analytics Routes
 */

// Get class statistics
router.get(
  '/class-stats',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(gradeValidation.classStatsSchema, 'query'),
  GradeController.getClassGradeStats
);

// Get subject performance
router.get(
  '/subject-performance',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(gradeValidation.classStatsSchema, 'query'),
  GradeController.getSubjectPerformance
);

module.exports = router;
