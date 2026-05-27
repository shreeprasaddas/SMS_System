const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const hrValidation = require('../validations/hr.validation');

/**
 * Staff Management Routes
 */

// Register new staff
router.post(
  '/staff',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.registerStaffSchema),
  hrController.registerStaff
);

// Get all staff
router.get(
  '/staff',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'TEACHER']),
  validate(hrValidation.listStaffSchema, 'query'),
  hrController.getAllStaff
);

// Get staff by ID
router.get(
  '/staff/:staffId',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'TEACHER']),
  hrController.getStaffById
);

// Update staff
router.put(
  '/staff/:staffId',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.updateStaffSchema),
  hrController.updateStaff
);

// Deactivate staff
router.patch(
  '/staff/:staffId/deactivate',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  hrController.deactivateStaff
);

/**
 * Salary Structure Routes
 */

// Create salary structure
router.post(
  '/salary-structures',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.createSalaryStructureSchema),
  hrController.createSalaryStructure
);

// Get all salary structures
router.get(
  '/salary-structures',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.listStaffSchema, 'query'),
  hrController.getAllSalaryStructures
);

/**
 * Payroll Routes
 */

// Process payroll
router.post(
  '/payroll',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.createPayrollSchema),
  hrController.processPayroll
);

// Get payroll records
router.get(
  '/payroll',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'ACCOUNTANT']),
  validate(hrValidation.listPayrollSchema, 'query'),
  hrController.getPayrollRecords
);

// Approve payroll
router.patch(
  '/payroll/:payrollId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(hrValidation.approvePayrollSchema),
  hrController.approvePayroll
);

/**
 * Attendance Routes
 */

// Mark attendance
router.post(
  '/attendance',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'TEACHER']),
  validate(hrValidation.markAttendanceSchema),
  hrController.markAttendance
);

// Get attendance records
router.get(
  '/attendance',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'ACCOUNTANT']),
  validate(hrValidation.listAttendanceSchema, 'query'),
  hrController.getAttendanceRecords
);

/**
 * Performance Appraisal Routes
 */

// Create appraisal
router.post(
  '/appraisals',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validate(hrValidation.createAppraisalSchema),
  hrController.createAppraisal
);

// Get appraisals
router.get(
  '/appraisals',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'TEACHER']),
  validate(hrValidation.listAppraisalsSchema, 'query'),
  hrController.getAppraisals
);

/**
 * Statistics Route
 */

// Get HR statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  hrController.getHRStatistics
);

module.exports = router;