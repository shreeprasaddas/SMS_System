/**
 * Fee Routes
 * API endpoints for fee management
 */

const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/fee.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const feeValidation = require('../validations/fee.validation');

/**
 * Fee Structure Routes
 */

// Create fee structure
router.post(
  '/structures',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(feeValidation.createFeeStructureSchema, 'body'),
  FeeController.createFeeStructure
);

// Get fee structures
router.get(
  '/structures',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']),
  validate(feeValidation.getFeesSchema, 'query'),
  FeeController.getFeeStructures
);

// Approve fee structure
router.patch(
  '/structures/:feeStructureId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  FeeController.approveFeeStructure
);

/**
 * Student Fee Routes
 */

// Allocate fees to students
router.post(
  '/allocate',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(feeValidation.allocateStudentFeesSchema, 'body'),
  FeeController.assignFeeStructure
);

// Get student fees
router.get(
  '/students',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(feeValidation.getFeesSchema, 'query'),
  FeeController.getStudentFees
);

// Get student fee by ID
router.get(
  '/students/:studentFeeId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'STUDENT', 'PARENT']),
  FeeController.getStudentFeeById
);

// Apply concession
router.post(
  '/students/:studentFeeId/concession',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  FeeController.applyConcession
);

// Exempt from fees
router.post(
  '/students/:studentFeeId/exempt',
  authorize(['ADMIN', 'PRINCIPAL']),
  FeeController.exemptFromFees
);

// Send fee reminder
router.post(
  '/students/:studentFeeId/reminder',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  FeeController.sendFeeReminder
);

/**
 * Fee Report Routes
 */

// Get fee report
router.get(
  '/report',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(feeValidation.feeAnalyticsSchema, 'query'),
  FeeController.getFeeSummary
);

module.exports = router;
