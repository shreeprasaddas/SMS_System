/**
 * Teacher Routes
 * CRUD operations and management for teachers
 */

const express = require('express');
const TeacherController = require('../controllers/teacher.controller');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');

const router = express.Router();

// Get all teachers
router.get('/', authenticate, TeacherController.getTeachers);

// Get teacher by ID
router.get('/:teacherId', authenticate, TeacherController.getTeacherById);

// Get teacher statistics
router.get('/stats/dashboard', authenticate, TeacherController.getTeacherStats);

// Create teacher
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  TeacherController.createTeacher
);

// Update teacher
router.put(
  '/:teacherId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  TeacherController.updateTeacher
);

// Partial update teacher
router.patch(
  '/:teacherId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  TeacherController.patchTeacher
);

// Delete teacher
router.delete(
  '/:teacherId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  TeacherController.deleteTeacher
);

module.exports = router;
