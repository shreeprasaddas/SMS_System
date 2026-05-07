/**
 * Expense Service
 * Business logic for expense management and tracking
 */

const Expense = require('../models/finance/Expense.model');
const Budget = require('../models/finance/Budget.model');
const Ledger = require('../models/finance/Ledger.model');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ExpenseService {
  /**
   * Create expense
   */
  async createExpense(schoolId, expenseData, userId) {
    try {
      const expense = new Expense({
        schoolId,
        ...expenseData,
        recordedBy: userId,
      });

      const savedExpense = await expense.save();

      logger.info(`Expense created: ${savedExpense._id}`);
      return savedExpense;
    } catch (error) {
      logger.error('Error creating expense:', error);
      throw error;
    }
  }

  /**
   * Get expenses with filters
   */
  async getExpenses(schoolId, filters) {
    try {
      const {
        category,
        status,
        approvalStatus,
        fiscalYear,
        month,
        year,
        page = 1,
        limit = 10,
      } = filters;

      const query = { schoolId };
      if (category) query.category = category;
      if (status) query.status = status;
      if (approvalStatus) query.approvalStatus = approvalStatus;
      if (fiscalYear) query.fiscalYear = fiscalYear;

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        query.expenseDate = { $gte: startDate, $lte: endDate };
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Expense.find(query)
          .populate('recordedBy', 'firstName lastName')
          .populate('approvedBy', 'firstName lastName')
          .populate('fiscalYear', 'name code')
          .sort({ expenseDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Expense.countDocuments(query),
      ]);

      return {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      logger.error('Error fetching expenses:', error);
      throw error;
    }
  }

  /**
   * Approve expense
   */
  async approveExpense(schoolId, expenseId, userId, remarks) {
    try {
      const expense = await Expense.findOne({
        _id: expenseId,
        schoolId,
      });

      if (!expense) {
        throw new AppError('Expense not found', 404);
      }

      expense.approvalStatus = 'APPROVED';
      expense.status = 'APPROVED';
      expense.approvedBy = userId;
      expense.approvalDate = new Date();
      expense.approvalRemarks = remarks;

      const savedExpense = await expense.save();

      // Update budget spent amount
      if (expense.budgetHead) {
        const budget = await Budget.findById(expense.budgetHead);
        if (budget) {
          const head = budget.heads.find((h) => h.name === expense.category);
          if (head) {
            head.spentAmount += expense.amount;
            await budget.save();
          }
        }
      }

      return savedExpense;
    } catch (error) {
      logger.error('Error approving expense:', error);
      throw error;
    }
  }

  /**
   * Reject expense
   */
  async rejectExpense(schoolId, expenseId, userId, reason) {
    try {
      const expense = await Expense.findOne({
        _id: expenseId,
        schoolId,
      });

      if (!expense) {
        throw new AppError('Expense not found', 404);
      }

      expense.approvalStatus = 'REJECTED';
      expense.status = 'REJECTED';
      expense.rejectionReason = reason;

      return await expense.save();
    } catch (error) {
      logger.error('Error rejecting expense:', error);
      throw error;
    }
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(schoolId, expenseId) {
    try {
      const expense = await Expense.findOne({
        _id: expenseId,
        schoolId,
      })
        .populate('recordedBy', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName')
        .populate('fiscalYear', 'name')
        .populate('budgetHead');

      if (!expense) {
        throw new AppError('Expense not found', 404);
      }

      return expense;
    } catch (error) {
      logger.error('Error fetching expense:', error);
      throw error;
    }
  }

  /**
   * Get expense report
   */
  async getExpenseReport(schoolId, fiscalYear, category) {
    try {
      const matchStage = {
        schoolId: schoolId,
        fiscalYear: fiscalYear,
        status: 'APPROVED',
      };

      if (category) {
        matchStage.category = category;
      }

      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ];

      const report = await Expense.aggregate(pipeline);

      // Total expenses
      const totalPipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$amount' },
            totalRecords: { $sum: 1 },
          },
        },
      ];

      const totals = await Expense.aggregate(totalPipeline);

      return {
        report,
        totals: totals[0] || { totalExpenses: 0, totalRecords: 0 },
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error generating expense report:', error);
      throw error;
    }
  }

  /**
   * Get expenses by department
   */
  async getExpensesByDepartment(schoolId, fiscalYear) {
    try {
      const pipeline = [
        {
          $match: {
            schoolId: schoolId,
            fiscalYear: fiscalYear,
            status: 'APPROVED',
          },
        },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ];

      return await Expense.aggregate(pipeline);
    } catch (error) {
      logger.error('Error getting expenses by department:', error);
      throw error;
    }
  }

  /**
   * Record expense ledger entry
   */
  async recordExpenseLedger(schoolId, expenseId, userId) {
    try {
      const expense = await Expense.findById(expenseId);

      if (!expense || expense.status !== 'APPROVED') {
        throw new AppError('Expense not found or not approved', 404);
      }

      // Map category to account
      const accountMap = {
        SALARY: 'SALARY',
        UTILITIES: 'UTILITIES',
        MAINTENANCE: 'MAINTENANCE',
        SUPPLIES: 'SUPPLIES',
        EQUIPMENT: 'EQUIPMENT',
        TRANSPORT: 'TRANSPORT',
        CONTINGENCY: 'OTHER_EXPENSE',
        PROFESSIONAL_DEVELOPMENT: 'OTHER_EXPENSE',
        EVENTS: 'OTHER_EXPENSE',
        OTHER: 'OTHER_EXPENSE',
      };

      const ledgerEntry = new Ledger({
        schoolId,
        type: 'EXPENSE',
        account: accountMap[expense.category] || 'OTHER_EXPENSE',
        referenceType: 'EXPENSE',
        referenceId: expenseId,
        referenceNumber: expense.expenseNumber,
        debitAmount: expense.amount,
        description: expense.description,
        relatedVendor: expense.vendor,
        postedBy: userId,
        fiscalYear: expense.fiscalYear,
      });

      return await ledgerEntry.save();
    } catch (error) {
      logger.error('Error recording expense ledger:', error);
      throw error;
    }
  }

  /**
   * Get pending expenses for approval
   */
  async getPendingExpenses(schoolId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Expense.find({
          schoolId,
          approvalStatus: 'PENDING',
        })
          .populate('recordedBy', 'firstName lastName')
          .populate('fiscalYear', 'name')
          .sort({ expenseDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Expense.countDocuments({
          schoolId,
          approvalStatus: 'PENDING',
        }),
      ]);

      return {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      logger.error('Error fetching pending expenses:', error);
      throw error;
    }
  }
}

module.exports = new ExpenseService();
