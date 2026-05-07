/**
 * Payroll Routes
 * API endpoints for payroll management
 */

const express = require('express');
const router = express.Router();
const PayrollController = require('../controllers/payroll.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const payrollValidation = require('../validations/payroll.validation');

// All routes require authentication
router.use(authenticate);

// Create payroll
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(payrollValidation.createPayrollSchema, 'body'),
  PayrollController.createPayroll
);

// Get payrolls
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(payrollValidation.getPayrollsSchema, 'query'),
  PayrollController.getPayrolls
);

// Get payroll by ID
router.get(
  '/:payrollId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PayrollController.getPayrollById
);

// Process payroll
router.patch(
  '/:payrollId/process',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(payrollValidation.processPayrollSchema, 'body'),
  PayrollController.processPayroll
);

// Approve payroll
router.patch(
  '/:payrollId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  PayrollController.approvePayroll
);

// Generate payslip
router.post(
  '/:payrollId/payslip',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PayrollController.generatePayslip
);

// Get payslip
router.get(
  '/payslip/:payslipId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'EMPLOYEE']),
  PayrollController.getPayslip
);

// Send payslips
router.post(
  '/send-payslips',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PayrollController.sendPayslips
);

// Mark payroll as paid
router.patch(
  '/:payrollId/mark-paid',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(payrollValidation.markPayrollAsPaidSchema, 'body'),
  PayrollController.markPayrollAsPaid
);

// Payroll summary
router.get(
  '/summary',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(payrollValidation.payrollSummarySchema, 'query'),
  PayrollController.getPayrollSummary
);

module.exports = router;

