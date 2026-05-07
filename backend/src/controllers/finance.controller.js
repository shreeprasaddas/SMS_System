const financeService = require('../services/finance.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

/**
 * Create budget
 * POST /api/v1/finance/budgets
 */
exports.createBudget = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const budget = await financeService.createBudget(req.body, schoolId);
    responseHelper.created(res, budget, 'Budget created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all budgets
 * GET /api/v1/finance/budgets
 */
exports.getAllBudgets = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await financeService.getAllBudgets(schoolId, req.query);
    responseHelper.paginated(res, result.budgets, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Budgets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget by ID
 * GET /api/v1/finance/budgets/:budgetId
 */
exports.getBudgetById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const budget = await financeService.getBudgetById(req.params.budgetId, schoolId);
    responseHelper.success(res, budget, 'Budget retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update budget
 * PUT /api/v1/finance/budgets/:budgetId
 */
exports.updateBudget = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const budget = await financeService.updateBudget(req.params.budgetId, {
      ...req.body,
      performedBy: userId
    }, schoolId);
    responseHelper.success(res, budget, 'Budget updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record expense
 * POST /api/v1/finance/expenses
 */
exports.recordExpense = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const expense = await financeService.recordExpense({
      ...req.body,
      recordedBy: userId
    }, schoolId);
    responseHelper.created(res, expense, 'Expense recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get expenses
 * GET /api/v1/finance/expenses
 */
exports.getExpenses = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await financeService.getExpenses(schoolId, req.query);
    responseHelper.paginated(res, result.expenses, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Expenses retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Approve expense
 * PATCH /api/v1/finance/expenses/:expenseId/approve
 */
exports.approveExpense = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const expense = await financeService.approveExpense(req.params.expenseId, schoolId, {
      approvedBy: userId,
      remarks: req.body.remarks
    });
    responseHelper.success(res, expense, 'Expense approved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record income
 * POST /api/v1/finance/income
 */
exports.recordIncome = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const income = await financeService.recordIncome({
      ...req.body,
      recordedBy: userId
    }, schoolId);
    responseHelper.created(res, income, 'Income recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get income records
 * GET /api/v1/finance/income
 */
exports.getIncomeRecords = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await financeService.getIncomeRecords(schoolId, req.query);
    responseHelper.paginated(res, result.incomes, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Income records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create voucher journal entry
 * POST /api/v1/finance/vouchers
 */
exports.createVoucher = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const voucher = await financeService.createVoucher({
      ...req.body,
      recordedBy: userId
    }, schoolId);
    responseHelper.created(res, voucher, 'Voucher created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get voucher records
 * GET /api/v1/finance/vouchers
 */
exports.getVouchers = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await financeService.getVouchers(schoolId, req.query);
    responseHelper.paginated(res, result.vouchers, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Vouchers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Generate financial report
 * POST /api/v1/finance/reports
 */
exports.generateFinancialReport = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const report = await financeService.generateFinancialReport({
      ...req.body,
      generatedBy: userId
    }, schoolId);
    responseHelper.created(res, report, 'Financial report generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get financial reports
 * GET /api/v1/finance/reports
 */
exports.getFinancialReports = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await financeService.getFinancialReports(schoolId, req.query);
    responseHelper.paginated(res, result.reports, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Financial reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get finance statistics
 * GET /api/v1/finance/statistics
 */
exports.getFinanceStatistics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const stats = await financeService.getFinanceStatistics(schoolId);
    responseHelper.success(res, stats, 'Finance statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
