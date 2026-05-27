/**
 * Grade Routes
 * API endpoints for grade management
 */

const express = require('express');
const router = express.Router();
const GradeController = require('../controllers/grade.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const gradeValidation = require('../validations/grade.validation');

/**
 * Grade CRUD Routes
 */

// Create grade
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(gradeValidation.createGradeSchema, 'body'),
  GradeController.createGrade
);

// Get grades with filters
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(gradeValidation.getGradesSchema, 'query'),
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
  validate(gradeValidation.finalizeGradesSchema, 'body'),
  GradeController.finalizeGrades
);

// Publish grades
router.patch(
  '/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(gradeValidation.publishGradesSchema, 'body'),
  GradeController.publishGrades
);

// Contest grade
router.post(
  '/:gradeId/contest',
  authorize(['STUDENT', 'PARENT']),
  validate(gradeValidation.contestGradeSchema, 'body'),
  GradeController.contestGrade
);

// Resolve contest
router.patch(
  '/:gradeId/resolve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(gradeValidation.resolveContestSchema, 'body'),
  GradeController.resolveGradeContest
);

/**
 * Grade Statistics & Analytics Routes
 */

// Get class statistics
router.get(
  '/class-stats',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(gradeValidation.classStatsSchema, 'query'),
  GradeController.getClassGradeStats
);

// Get subject performance
router.get(
  '/subject-performance',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(gradeValidation.classStatsSchema, 'query'),
  GradeController.getSubjectPerformance
);

module.exports = router;
