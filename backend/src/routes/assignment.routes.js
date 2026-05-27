const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');
const { authorize } = require('../middleware/authorization.middleware');

// ==================== ASSIGNMENT CRUD ====================

router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.createAssignment
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  AssignmentController.getAssignments
);

router.get(
  '/:assignmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  AssignmentController.getAssignmentById
);

router.put(
  '/:assignmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.updateAssignment
);

router.delete(
  '/:assignmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.deleteAssignment
);

// ==================== STATISTICS ====================

router.get(
  '/:assignmentId/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.getAssignmentStatistics
);

// ==================== DEADLINE ====================

router.put(
  '/:assignmentId/extend-deadline',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.extendDeadline
);

// ==================== SUBMISSIONS ====================

router.post(
  '/:assignmentId/submit',
  authorize(['STUDENT']),
  AssignmentController.submitAssignment
);

router.get(
  '/submissions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.getSubmissions
);

router.get(
  '/submissions/:submissionId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  AssignmentController.getSubmissionDetails
);

// ==================== EVALUATION ====================

router.post(
  '/submissions/:submissionId/evaluate',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  AssignmentController.evaluateSubmission
);

module.exports = router;
