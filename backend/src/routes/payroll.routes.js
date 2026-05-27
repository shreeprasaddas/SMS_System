/**
 * Payroll Routes
 * API endpoints for payroll management
 */

const express = require('express');
const router = express.Router();
const PayrollController = require('../controllers/payroll.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const payrollValidation = require('../validations/payroll.validation');

// Create payroll
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(payrollValidation.createPayrollSchema, 'body'),
  PayrollController.createPayroll
);

// Get payrolls
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(payrollValidation.getPayrollsSchema, 'query'),
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
  validate(payrollValidation.processPayrollSchema, 'body'),
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
  validate(payrollValidation.markPayrollAsPaidSchema, 'body'),
  PayrollController.markPayrollAsPaid
);

// Payroll summary
router.get(
  '/summary',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(payrollValidation.payrollSummarySchema, 'query'),
  PayrollController.getPayrollSummary
);

module.exports = router;

