/**
 * Subject Routes
 * Protected subject management endpoints
 */

const express = require('express');
const SubjectController = require('../controllers/subject.controller');
const { validate } = require('../middleware/validation.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const {
  createSubjectSchema,
  updateSubjectSchema,
  createCurriculumSchema,
  updateCurriculumSchema,
  assignTeacherSchema,
} = require('../validations/subject.validation');

const router = express.Router();

// ============================================================
// SUBJECT CRUD OPERATIONS
// ============================================================

// Create subject (admin/principal only)
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createSubjectSchema),
  SubjectController.createSubject
);

// Get all subjects
router.get('/', SubjectController.getSubjects);

// Get subject by ID
router.get('/:subjectId', SubjectController.getSubject);

// Update subject (admin/principal only)
router.put(
  '/:subjectId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateSubjectSchema),
  SubjectController.updateSubject
);

// Delete subject (admin/principal only)
router.delete(
  '/:subjectId',
  authorize(['ADMIN', 'PRINCIPAL']),
  SubjectController.deleteSubject
);

// ============================================================
// CURRICULUM MANAGEMENT
// ============================================================

// Create curriculum
router.post(
  '/curriculum',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(createCurriculumSchema),
  SubjectController.createCurriculum
);

// Get all curriculums
router.get('/curriculum', SubjectController.getCurriculums);

// Get curriculum by ID
router.get('/curriculum/:curriculumId', SubjectController.getCurriculum);

// Update curriculum
router.put(
  '/curriculum/:curriculumId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(updateCurriculumSchema),
  SubjectController.updateCurriculum
);

// Approve curriculum (admin/principal only)
router.patch(
  '/curriculum/:curriculumId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  SubjectController.approveCurriculum
);

// Activate curriculum (admin/principal only)
router.patch(
  '/curriculum/:curriculumId/activate',
  authorize(['ADMIN', 'PRINCIPAL']),
  SubjectController.activateCurriculum
);

// ============================================================
// TEACHER SUBJECT ASSIGNMENT
// ============================================================

// Assign teacher to subject
router.post(
  '/assign-teacher',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(assignTeacherSchema),
  SubjectController.assignTeacher
);

// Get teacher subject assignments
router.get(
  '/teacher/:teacherId/assignments',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  SubjectController.getTeacherAssignments
);

// Remove teacher from subject
router.delete(
  '/assignment/:assignmentId',
  authorize(['ADMIN', 'PRINCIPAL']),
  SubjectController.removeTeacher
);

module.exports = router;
