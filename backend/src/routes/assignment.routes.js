const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { authenticate } = require('../middleware/authenticate.middleware');
const { authorize } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  createEvaluationSchema,
  updateEvaluationSchema,
  createRubricSchema,
  updateRubricSchema,
  assignmentFiltersSchema,
  submissionFiltersSchema,
  rubricFiltersSchema
} = require('../validations/assignment.validation');

// Apply authentication to all routes
router.use(authenticate);

// ============== ASSIGNMENT ROUTES ==============

/**
 * POST /api/v1/assignments
 * Create a new assignment
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(createAssignmentSchema, 'body'),
  assignmentController.createAssignment
);

/**
 * GET /api/v1/assignments
 * Get all assignments with filters and pagination
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(assignmentFiltersSchema, 'query'),
  assignmentController.getAllAssignments
);

/**
 * GET /api/v1/assignments/:id
 * Get assignment by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  assignmentController.getAssignmentById
);

/**
 * PUT /api/v1/assignments/:id
 * Update assignment
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(updateAssignmentSchema, 'body'),
  assignmentController.updateAssignment
);

/**
 * PUT /api/v1/assignments/:id/publish
 * Publish assignment
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.put(
  '/:id/publish',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  assignmentController.publishAssignment
);

/**
 * PUT /api/v1/assignments/:id/close
 * Close assignment for submissions
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.put(
  '/:id/close',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  assignmentController.closeAssignment
);

/**
 * GET /api/v1/assignments/:id/statistics
 * Get assignment submission statistics
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/:id/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  assignmentController.getAssignmentStatistics
);

// ============== SUBMISSION ROUTES ==============

/**
 * POST /api/v1/assignments/:id/submit
 * Submit assignment
 * Roles: STUDENT
 */
router.post(
  '/:id/submit',
  authorize(['STUDENT']),
  validate(submitAssignmentSchema, 'body'),
  assignmentController.submitAssignment
);

/**
 * GET /api/v1/assignments/:id/submissions
 * Get all submissions for assignment (teacher)
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/:id/submissions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(submissionFiltersSchema, 'query'),
  assignmentController.getAssignmentSubmissions
);

/**
 * GET /api/v1/assignments/:assignmentId/students/:studentId/submissions
 * Get student's submissions
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/:assignmentId/students/:studentId/submissions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  assignmentController.getStudentSubmissions
);

// ============== EVALUATION ROUTES ==============

/**
 * POST /api/v1/submissions/:submissionId/evaluate
 * Create evaluation for submission
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.post(
  '/submissions/:submissionId/evaluate',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(createEvaluationSchema, 'body'),
  assignmentController.createEvaluation
);

/**
 * GET /api/v1/evaluations/:id
 * Get evaluation
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/evaluations/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  assignmentController.getEvaluation
);

/**
 * PUT /api/v1/evaluations/:id
 * Update evaluation
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.put(
  '/evaluations/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(updateEvaluationSchema, 'body'),
  assignmentController.updateEvaluation
);

// ============== RUBRIC ROUTES ==============

/**
 * POST /api/v1/rubrics
 * Create rubric
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.post(
  '/rubrics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(createRubricSchema, 'body'),
  assignmentController.createRubric
);

/**
 * GET /api/v1/rubrics
 * Get all rubrics
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/rubrics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(rubricFiltersSchema, 'query'),
  assignmentController.getAllRubrics
);

/**
 * GET /api/v1/rubrics/:id
 * Get rubric by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/rubrics/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  assignmentController.getRubricById
);

/**
 * PUT /api/v1/rubrics/:id
 * Update rubric
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.put(
  '/rubrics/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(updateRubricSchema, 'body'),
  assignmentController.updateRubric
);

module.exports = router;
