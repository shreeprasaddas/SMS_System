const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const financeValidation = require('../validations/finance.validation');

// All routes require authentication
router.use(authenticate);

/**
 * Budget Management Routes
 */

// Create budget
router.post(
  '/budgets',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.createBudgetSchema),
  financeController.createBudget
);

// Get all budgets
router.get(
  '/budgets',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.listBudgetsSchema, 'query'),
  financeController.getAllBudgets
);

// Get budget by ID
router.get(
  '/budgets/:budgetId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  financeController.getBudgetById
);

// Update budget
router.put(
  '/budgets/:budgetId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.updateBudgetSchema),
  financeController.updateBudget
);

/**
 * Expense Management Routes
 */

// Record expense
router.post(
  '/expenses',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'HR_MANAGER']),
  validate(financeValidation.recordExpenseSchema),
  financeController.recordExpense
);

// Get expenses
router.get(
  '/expenses',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.listExpensesSchema, 'query'),
  financeController.getExpenses
);

// Approve expense
router.patch(
  '/expenses/:expenseId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(financeValidation.approveExpenseSchema),
  financeController.approveExpense
);

/**
 * Income Management Routes
 */

// Record income
router.post(
  '/income',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.recordIncomeSchema),
  financeController.recordIncome
);

// Get income records
router.get(
  '/income',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.listIncomeSchema, 'query'),
  financeController.getIncomeRecords
);

/**
 * Voucher/Journal Entry Routes
 */

// Create voucher journal entry
router.post(
  '/vouchers',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.createVoucherSchema),
  financeController.createVoucher
);

// Get voucher records
router.get(
  '/vouchers',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.listVouchersSchema, 'query'),
  financeController.getVouchers
);

/**
 * Financial Reports Routes
 */

// Generate financial report
router.post(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.generateReportSchema),
  financeController.generateFinancialReport
);

// Get financial reports
router.get(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(financeValidation.listReportsSchema, 'query'),
  financeController.getFinancialReports
);

/**
 * Statistics Route
 */

// Get finance statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  financeController.getFinanceStatistics
);

module.exports = router;
