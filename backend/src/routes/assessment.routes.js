/**
 * Assessment Routes
 * API endpoints for assessment management
 */

const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const assessmentValidation = require('../validations/assessment.validation');

// All routes require authentication
router.use(authenticate);

/**
 * Assessment CRUD Routes
 */

// Create assessment
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(assessmentValidation.createAssessmentSchema, 'body'),
  AssessmentController.createAssessment
);

// Get assessments with filters
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  validateRequest(assessmentValidation.getAssessmentsSchema, 'query'),
  AssessmentController.getAssessments
);

// Get assessment by ID
router.get(
  '/:assessmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  AssessmentController.getAssessmentById
);

// Update assessment
router.put(
  '/:assessmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(assessmentValidation.updateAssessmentSchema, 'body'),
  AssessmentController.updateAssessment
);

// Delete assessment
router.delete(
  '/:assessmentId',
  authorize(['ADMIN', 'PRINCIPAL']),
  AssessmentController.deleteAssessment
);

/**
 * Assessment Status Routes
 */

// Publish assessment
router.patch(
  '/:assessmentId/publish',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssessmentController.publishAssessment
);

// Close assessment
router.patch(
  '/:assessmentId/close',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssessmentController.closeAssessment
);

/**
 * Student Submission & Marking Routes
 */

// Submit assessment
router.post(
  '/:assessmentId/submit',
  authorize(['STUDENT']),
  validateRequest(assessmentValidation.submitAssessmentSchema, 'body'),
  AssessmentController.submitAssessment
);

// Mark assessment
router.patch(
  '/:assessmentId/mark/:studentAssessmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(assessmentValidation.markAssessmentSchema, 'body'),
  AssessmentController.markAssessment
);

/**
 * Results & Analytics Routes
 */

// Get assessment results
router.get(
  '/:assessmentId/results',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssessmentController.getAssessmentResults
);

// Get student assessment results
router.get(
  '/student/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  validateRequest(assessmentValidation.getStudentAssessmentsSchema, 'query'),
  AssessmentController.getStudentAssessments
);

// Get assessment analytics
router.get(
  '/:assessmentId/analytics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssessmentController.getAssessmentAnalytics
);

module.exports = router;
