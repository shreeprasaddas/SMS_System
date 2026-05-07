const Budget = require('../models/finance/Budget.model');
const Expense = require('../models/finance/Expense.model');
const Income = require('../models/finance/Income.model');
const VoucherJournal = require('../models/finance/VoucherJournal.model');
const FinancialReport = require('../models/finance/FinancialReport.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create budget
 * @param {object} data - Budget details
 * @param {string} schoolId
 * @returns {Promise<object>} Created budget
 */
exports.createBudget = async (data, schoolId) => {
  const budget = await Budget.create({
    ...data,
    schoolId
  });
  return budget;
};

/**
 * Get all budgets
 * @param {string} schoolId
 * @param {object} filters - { status, fiscalYear, page, limit }
 * @returns {Promise<object>} { budgets, total, pagination }
 */
exports.getAllBudgets = async (schoolId, filters = {}) => {
  const { status, fiscalYear, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;
  if (fiscalYear) query.fiscalYear = fiscalYear;

  const skip = (page - 1) * limit;
  const [budgets, total] = await Promise.all([
    Budget.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Budget.countDocuments(query)
  ]);

  return { budgets, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get budget by ID
 * @param {string} budgetId
 * @param {string} schoolId
 * @returns {Promise<object>} Budget details
 */
exports.getBudgetById = async (budgetId, schoolId) => {
  const budget = await Budget.findOne({ _id: budgetId, schoolId }).lean();
  if (!budget) throw new AppError('Budget not found', 404);
  return budget;
};

/**
 * Update budget
 * @param {string} budgetId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated budget
 */
exports.updateBudget = async (budgetId, data, schoolId) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, schoolId },
    {
      ...data,
      $push: {
        auditLog: {
          action: 'UPDATE',
          performedBy: data.performedBy,
          changes: data
        }
      }
    },
    { new: true, runValidators: true }
  );
  if (!budget) throw new AppError('Budget not found', 404);
  return budget;
};

/**
 * Record expense
 * @param {object} data - Expense details
 * @param {string} schoolId
 * @returns {Promise<object>} Created expense
 */
exports.recordExpense = async (data, schoolId) => {
  const expense = await Expense.create({
    ...data,
    schoolId
  });
  return expense;
};

/**
 * Get expenses
 * @param {string} schoolId
 * @param {object} filters - { category, status, startDate, endDate, page, limit }
 * @returns {Promise<object>} { expenses, total, pagination }
 */
exports.getExpenses = async (schoolId, filters = {}) => {
  const { category, status, startDate, endDate, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (category) query.category = category;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.expenseDate = {};
    if (startDate) query.expenseDate.$gte = new Date(startDate);
    if (endDate) query.expenseDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .sort({ expenseDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Expense.countDocuments(query)
  ]);

  return { expenses, total, page: Number(page), limit: Number(limit) };
};

/**
 * Approve expense
 * @param {string} expenseId
 * @param {string} schoolId
 * @param {object} approvalData
 * @returns {Promise<object>} Updated expense
 */
exports.approveExpense = async (expenseId, schoolId, approvalData) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, schoolId },
    {
      approvalStatus: 'APPROVED',
      status: 'APPROVED',
      approvedBy: approvalData.approvedBy,
      approvalDate: new Date(),
      approvalRemarks: approvalData.remarks,
      $push: {
        auditLog: {
          action: 'APPROVED',
          performedBy: approvalData.approvedBy,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  if (!expense) throw new AppError('Expense not found', 404);
  return expense;
};

/**
 * Record income
 * @param {object} data - Income details
 * @param {string} schoolId
 * @returns {Promise<object>} Created income
 */
exports.recordIncome = async (data, schoolId) => {
  const income = await Income.create({
    ...data,
    schoolId
  });
  return income;
};

/**
 * Get income records
 * @param {string} schoolId
 * @param {object} filters - { incomeSource, status, startDate, endDate, page, limit }
 * @returns {Promise<object>} { incomes, total, pagination }
 */
exports.getIncomeRecords = async (schoolId, filters = {}) => {
  const { incomeSource, status, startDate, endDate, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (incomeSource) query.incomeSource = incomeSource;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.incomeDate = {};
    if (startDate) query.incomeDate.$gte = new Date(startDate);
    if (endDate) query.incomeDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [incomes, total] = await Promise.all([
    Income.find(query)
      .sort({ incomeDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Income.countDocuments(query)
  ]);

  return { incomes, total, page: Number(page), limit: Number(limit) };
};

/**
 * Create voucher journal entry
 * @param {object} data - Voucher details
 * @param {string} schoolId
 * @returns {Promise<object>} Created voucher
 */
exports.createVoucher = async (data, schoolId) => {
  // Validate debit/credit balance
  const totalDebit = data.journalEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = data.journalEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new AppError('Journal entry is not balanced. Debit and Credit must be equal', 400);
  }

  const voucher = await VoucherJournal.create({
    ...data,
    totalDebit,
    totalCredit,
    schoolId
  });
  return voucher;
};

/**
 * Get voucher records
 * @param {string} schoolId
 * @param {object} filters - { voucherType, status, page, limit }
 * @returns {Promise<object>} { vouchers, total, pagination }
 */
exports.getVouchers = async (schoolId, filters = {}) => {
  const { voucherType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (voucherType) query.voucherType = voucherType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [vouchers, total] = await Promise.all([
    VoucherJournal.find(query)
      .sort({ voucherDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    VoucherJournal.countDocuments(query)
  ]);

  return { vouchers, total, page: Number(page), limit: Number(limit) };
};

/**
 * Generate financial report
 * @param {object} reportData - Report parameters
 * @param {string} schoolId
 * @returns {Promise<object>} Created report
 */
exports.generateFinancialReport = async (reportData, schoolId) => {
  // Fetch data based on report type and period
  const { reportType, startDate, endDate } = reportData;

  // Calculate totals
  const expenseQuery = { schoolId, expenseDate: { $gte: startDate, $lte: endDate }, status: 'APPROVED' };
  const incomeQuery = { schoolId, incomeDate: { $gte: startDate, $lte: endDate }, status: 'RECONCILED' };

  const [totalExpense, totalIncome] = await Promise.all([
    Expense.aggregate([
      { $match: expenseQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Income.aggregate([
      { $match: incomeQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const report = await FinancialReport.create({
    ...reportData,
    reportData: {
      totalExpense: totalExpense[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
      netProfit: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0)
    },
    schoolId
  });

  return report;
};

/**
 * Get financial reports
 * @param {string} schoolId
 * @param {object} filters - { reportType, status, page, limit }
 * @returns {Promise<object>} { reports, total, pagination }
 */
exports.getFinancialReports = async (schoolId, filters = {}) => {
  const { reportType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (reportType) query.reportType = reportType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [reports, total] = await Promise.all([
    FinancialReport.find(query)
      .sort({ generatedDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    FinancialReport.countDocuments(query)
  ]);

  return { reports, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get finance statistics
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getFinanceStatistics = async (schoolId) => {
  const [totalBudget, activeBudgets, totalExpenses, totalIncome, pendingApprovals] = await Promise.all([
    Budget.countDocuments({ schoolId }),
    Budget.countDocuments({ schoolId, status: 'ACTIVE' }),
    Expense.aggregate([
      { $match: { schoolId, status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Income.aggregate([
      { $match: { schoolId, status: 'RECONCILED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Expense.countDocuments({ schoolId, approvalStatus: 'PENDING' })
  ]);

  return {
    totalBudgets: totalBudget,
    activeBudgets,
    totalExpenses: totalExpenses[0]?.total || 0,
    totalIncome: totalIncome[0]?.total || 0,
    pendingExpenseApprovals: pendingApprovals,
    timestamp: new Date()
  };
};

module.exports = exports;
