/**
 * Expense Controller
 * HTTP request handlers for expense management
 */

const expenseService = require('../services/expense.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ExpenseController {
  /**
   * Create expense
   * POST /api/v1/expenses
   */
  static async createExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const expenseData = req.body;

      const expense = await expenseService.createExpense(
        schoolId,
        expenseData,
        userId
      );

      responseHelper.created(res, expense, 'Expense created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expenses
   * GET /api/v1/expenses
   */
  static async getExpenses(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await expenseService.getExpenses(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Expenses retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense by ID
   * GET /api/v1/expenses/:expenseId
   */
  static async getExpenseById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { expenseId } = req.params;

      const expense = await expenseService.getExpenseById(schoolId, expenseId);

      responseHelper.success(res, expense, 'Expense retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update expense
   * PUT /api/v1/expenses/:expenseId
   */
  static async updateExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;
      const expenseData = req.body;

      const expense = await expenseService.updateExpense(
        schoolId,
        expenseId,
        expenseData,
        userId
      );

      responseHelper.success(res, expense, 'Expense updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete expense
   * DELETE /api/v1/expenses/:expenseId
   */
  static async deleteExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;

      const result = await expenseService.deleteExpense(schoolId, expenseId, userId);

      responseHelper.success(res, result, 'Expense deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit expense for approval
   * PATCH /api/v1/expenses/:expenseId/submit
   */
  static async submitExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;

      const expense = await expenseService.submitExpense(
        schoolId,
        expenseId,
        userId
      );

      responseHelper.success(res, expense, 'Expense submitted for approval');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve expense
   * PATCH /api/v1/expenses/:expenseId/approve
   */
  static async approveExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;

      const expense = await expenseService.approveExpense(
        schoolId,
        expenseId,
        userId
      );

      responseHelper.success(res, expense, 'Expense approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject expense
   * PATCH /api/v1/expenses/:expenseId/reject
   */
  static async rejectExpense(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;
      const { reason } = req.body;

      const expense = await expenseService.rejectExpense(
        schoolId,
        expenseId,
        reason,
        userId
      );

      responseHelper.success(res, expense, 'Expense rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record expense payment
   * POST /api/v1/expenses/:expenseId/payment
   */
  static async recordExpensePayment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;
      const paymentData = req.body;

      const expense = await expenseService.recordExpensePayment(
        schoolId,
        expenseId,
        paymentData,
        userId
      );

      responseHelper.success(res, expense, 'Expense payment recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expenses by category
   * GET /api/v1/expenses/category/:category
   */
  static async getExpensesByCategory(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { category } = req.params;
      const filters = req.query;

      const result = await expenseService.getExpensesByCategory(
        schoolId,
        category,
        filters
      );

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Expenses retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get budget vs actual report
   * GET /api/v1/expenses/budget-report
   */
  static async getBudgetVsActualReport(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { academicYear } = req.query;

      if (!academicYear) {
        throw new AppError('Academic year is required', 400);
      }

      const report = await expenseService.getBudgetVsActualReport(schoolId, academicYear);

      responseHelper.success(res, report, 'Budget report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense trends
   * GET /api/v1/expenses/trends
   */
  static async getExpenseTrends(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { months = 6 } = req.query;

      const trends = await expenseService.getExpenseTrends(schoolId, parseInt(months));

      responseHelper.success(res, trends, 'Expense trends retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending expenses
   * GET /api/v1/expenses/pending
   */
  static async getPendingExpenses(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await expenseService.getPendingExpenses(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Pending expenses retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense analytics
   * GET /api/v1/expenses/analytics
   */
  static async getExpenseAnalytics(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { academicYear } = req.query;

      if (!academicYear) {
        throw new AppError('Academic year is required', 400);
      }

      const analytics = await expenseService.getExpenseAnalytics(schoolId, academicYear);

      responseHelper.success(res, analytics, 'Expense analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attach document to expense
   * POST /api/v1/expenses/:expenseId/attachments
   */
  static async attachDocument(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { expenseId } = req.params;
      const { url, type } = req.body;

      const expense = await expenseService.attachDocument(
        schoolId,
        expenseId,
        { url, type },
        userId
      );

      responseHelper.success(res, expense, 'Document attached successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExpenseController;
