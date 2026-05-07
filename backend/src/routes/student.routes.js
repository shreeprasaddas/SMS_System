/**
 * Student Routes
 * CRUD operations and analytics for students
 */

const express = require('express');
const StudentController = require('../controllers/student.controller');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { createStudentSchema, updateStudentSchema } = require('../validations/student.validation');

const router = express.Router();

/**
 * Public Routes (No Authentication)
 */
// None for students

/**
 * Protected Routes (Authentication Required)
 */

// Get all students with pagination, search, filters
router.get('/', authenticate, StudentController.getStudents);

// Get student by ID
router.get('/:studentId', authenticate, StudentController.getStudentById);

// Get student statistics
router.get('/stats/dashboard', authenticate, StudentController.getStudentStats);

// Create new student
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL', 'TEACHER'),
  validate(createStudentSchema),
  StudentController.createStudent
);

// Update student
router.put(
  '/:studentId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL', 'TEACHER'),
  validate(updateStudentSchema),
  StudentController.updateStudent
);

// Partial update student
router.patch(
  '/:studentId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL', 'TEACHER'),
  StudentController.patchStudent
);

// Delete student
router.delete(
  '/:studentId',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  StudentController.deleteStudent
);

// Bulk import students
router.post(
  '/bulk/import',
  authenticate,
  authorize('ADMIN', 'PRINCIPAL'),
  StudentController.bulkImportStudents
);

// Export students
router.get('/export/excel', authenticate, StudentController.exportStudents);

module.exports = router;
