/**
 * Attendance Routes
 * Student and staff attendance, holidays, and attendance rules management
 */

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const AttendanceController = require('../controllers/attendance.controller');

const router = express.Router();

// ==================== STUDENT ATTENDANCE ====================

/**
 * @route POST /api/v1/attendance/students
 * @desc Mark single student attendance
 * @access Private - Teachers, Admin, Principal
 */
router.post(
  '/students',
  authorize(['TEACHER', 'ADMIN', 'PRINCIPAL']),
  AttendanceController.markStudentAttendance
);

/**
 * @route POST /api/v1/attendance/students/bulk
 * @desc Mark bulk student attendance
 * @access Private - Teachers, Admin, Principal
 */
router.post(
  '/students/bulk',
  authorize(['TEACHER', 'ADMIN', 'PRINCIPAL']),
  AttendanceController.markBulkStudentAttendance
);

/**
 * @route GET /api/v1/attendance/students
 * @desc Get student attendance records with filters
 * @access Private - All authenticated users
 */
router.get(
  '/students',
  AttendanceController.getStudentAttendance
);

/**
 * @route GET /api/v1/attendance/students/:studentId/percentage
 * @desc Calculate student attendance percentage
 * @access Private - All authenticated users
 */
router.get(
  '/students/:studentId/percentage',
  AttendanceController.getStudentAttendancePercentage
);

/**
 * @route GET /api/v1/attendance/class-report
 * @desc Get class attendance report for a month
 * @access Private - Teachers, Admin, Principal
 */
router.get(
  '/class-report',
  authorize(['TEACHER', 'ADMIN', 'PRINCIPAL']),
  AttendanceController.getClassAttendanceReport
);

// ==================== STAFF ATTENDANCE ====================

/**
 * @route POST /api/v1/attendance/staff
 * @desc Mark staff attendance
 * @access Private - Admin, HR Manager
 */
router.post(
  '/staff',
  authorize(['ADMIN', 'HR_MANAGER']),
  AttendanceController.markStaffAttendance
);

/**
 * @route GET /api/v1/attendance/staff
 * @desc Get staff attendance records
 * @access Private - Admin, HR Manager
 */
router.get(
  '/staff',
  authorize(['ADMIN', 'HR_MANAGER']),
  AttendanceController.getStaffAttendance
);

// ==================== HOLIDAYS ====================

/**
 * @route POST /api/v1/attendance/holidays
 * @desc Add holiday to calendar
 * @access Private - Admin, Principal
 */
router.post(
  '/holidays',
  authorize(['ADMIN', 'PRINCIPAL']),
  AttendanceController.addHoliday
);

/**
 * @route GET /api/v1/attendance/holidays
 * @desc Get holidays
 * @access Private - All authenticated users
 */
router.get(
  '/holidays',
  AttendanceController.getHolidays
);

/**
 * @route DELETE /api/v1/attendance/holidays/:holidayId
 * @desc Delete holiday
 * @access Private - Admin, Principal
 */
router.delete(
  '/holidays/:holidayId',
  authorize(['ADMIN', 'PRINCIPAL']),
  AttendanceController.deleteHoliday
);

// ==================== ATTENDANCE RULES ====================

/**
 * @route GET /api/v1/attendance/rules
 * @desc Get attendance rule
 * @access Private - Admin, Principal
 */
router.get(
  '/rules',
  authorize(['ADMIN', 'PRINCIPAL']),
  AttendanceController.getAttendanceRule
);

/**
 * @route PUT /api/v1/attendance/rules
 * @desc Update attendance rule
 * @access Private - Admin, Principal
 */
router.put(
  '/rules',
  authorize(['ADMIN', 'PRINCIPAL']),
  AttendanceController.updateAttendanceRule
);

// ==================== ATTENDANCE SUMMARY ====================

/**
 * @route GET /api/v1/attendance/summary
 * @desc Get attendance summary
 * @access Private - Teachers, Admin, Principal
 */
router.get(
  '/summary',
  authorize(['TEACHER', 'ADMIN', 'PRINCIPAL']),
  AttendanceController.getAttendanceSummary
);

module.exports = router;
