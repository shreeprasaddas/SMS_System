/**
 * Class Routes
 * Protected class management endpoints
 */

const express = require('express');
const ClassController = require('../controllers/class.controller');
const { validate } = require('../middleware/validation.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const {
  createClassSchema,
  updateClassSchema,
  assignClassTeacherSchema,
  addSectionSchema,
  assignSubjectSchema,
  updateStrengthSchema,
} = require('../validations/class.validation');

const router = express.Router();

// ============================================================
// CLASS CRUD OPERATIONS
// ============================================================

// Create class (admin/principal only)
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createClassSchema),
  ClassController.createClass
);

// Get all classes
router.get('/', ClassController.getClasses);

// Get class by ID
router.get('/:classId', ClassController.getClass);

// Update class (admin/principal only)
router.put(
  '/:classId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateClassSchema),
  ClassController.updateClass
);

// ============================================================
// CLASS ASSIGNMENTS
// ============================================================

// Assign subject to class
router.post(
  '/:classId/subjects',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(assignSubjectSchema),
  ClassController.assignSubject
);

// Assign class teacher
router.post(
  '/:classId/class-teacher',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(assignClassTeacherSchema),
  ClassController.assignClassTeacher
);

// Add section to class
router.post(
  '/:classId/sections',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(addSectionSchema),
  ClassController.addSection
);

// Update total strength
router.patch(
  '/:classId/strength',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateStrengthSchema),
  ClassController.updateStrength
);

// Delete class (soft delete)
router.delete(
  '/:classId',
  authorize(['ADMIN', 'PRINCIPAL']),
  ClassController.deleteClass
);

module.exports = router;
