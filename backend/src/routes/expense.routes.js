/**
 * Expense Routes
 * API endpoints for expense management
 */

const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const expenseValidation = require('../validations/expense.validation');

// All routes require authentication
router.use(authenticate);

/**
 * Expense CRUD Routes
 */

// Create expense
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER']),
  validateRequest(expenseValidation.createExpenseSchema, 'body'),
  ExpenseController.createExpense
);

// Get expenses
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER']),
  ExpenseController.getExpenses
);

// Get expense by ID
router.get(
  '/:expenseId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER']),
  ExpenseController.getExpenseById
);

// Update expense
router.put(
  '/:expenseId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(expenseValidation.updateExpenseSchema, 'body'),
  ExpenseController.updateExpense
);

// Delete expense
router.delete(
  '/:expenseId',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExpenseController.deleteExpense
);

/**
 * Expense Approval Workflow Routes
 */

// Submit expense for approval
router.patch(
  '/:expenseId/submit',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TRANSPORT_MANAGER', 'HOSTEL_MANAGER']),
  validateRequest(expenseValidation.submitExpenseSchema, 'body'),
  ExpenseController.submitExpense
);

// Approve expense
router.patch(
  '/:expenseId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(expenseValidation.approveExpenseSchema, 'body'),
  ExpenseController.approveExpense
);

// Reject expense
router.patch(
  '/:expenseId/reject',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExpenseController.rejectExpense
);

// Record expense payment
router.post(
  '/:expenseId/payment',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(expenseValidation.recordPaymentSchema, 'body'),
  ExpenseController.recordExpensePayment
);

/**
 * Expense Category & Filter Routes
 */

// Get expenses by category
router.get(
  '/category/:category',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.getExpensesByCategory
);

// Get pending expenses (awaiting approval)
router.get(
  '/pending',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.getPendingExpenses
);

/**
 * Expense Reporting & Analytics Routes
 */

// Get budget vs actual report
router.get(
  '/budget-report',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.getBudgetVsActualReport
);

// Get expense trends
router.get(
  '/trends',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.getExpenseTrends
);

// Get expense analytics
router.get(
  '/analytics',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.getExpenseAnalytics
);

/**
 * Document Management Routes
 */

// Attach document to expense
router.post(
  '/:expenseId/attachments',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  ExpenseController.attachDocument
);

module.exports = router;
