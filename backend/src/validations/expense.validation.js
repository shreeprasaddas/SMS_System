/**
 * Expense Validation
 * Joi schemas for expense management endpoints
 */

const Joi = require('joi');

const createExpenseSchema = Joi.object({
  category: Joi.string()
    .valid(
      'SALARY',
      'UTILITIES',
      'MAINTENANCE',
      'SUPPLIES',
      'EQUIPMENT',
      'TRANSPORT',
      'CONTINGENCY',
      'PROFESSIONAL_DEVELOPMENT',
      'EVENTS',
      'OTHER'
    )
    .required(),
  description: Joi.string().max(500).required().messages({
    'string.empty': 'Description is required',
  }),
  amount: Joi.number().min(0.01).required().messages({
    'number.min': 'Amount must be greater than 0',
  }),
  expenseDate: Joi.date().required(),
  paymentMethod: Joi.string()
    .valid('CASH', 'CHEQUE', 'ONLINE', 'DD', 'BANK_TRANSFER', 'CREDIT_CARD')
    .required(),
  vendor: Joi.string().max(200).optional(),
  vendorContact: Joi.string().optional(),
  invoiceNumber: Joi.string().optional(),
  billNumber: Joi.string().optional(),
  department: Joi.string()
    .valid('ACADEMIC', 'ADMINISTRATION', 'INFRASTRUCTURE', 'SUPPORT', 'OTHER')
    .default('OTHER')
    .optional(),
  budgetHead: Joi.string().optional(),
  fiscalYear: Joi.string().required().messages({
    'string.empty': 'Fiscal year is required',
  }),
  notes: Joi.string().max(500).allow('').optional(),
});

const updateExpenseSchema = Joi.object({
  category: Joi.string()
    .valid(
      'SALARY',
      'UTILITIES',
      'MAINTENANCE',
      'SUPPLIES',
      'EQUIPMENT',
      'TRANSPORT',
      'CONTINGENCY',
      'PROFESSIONAL_DEVELOPMENT',
      'EVENTS',
      'OTHER'
    )
    .optional(),
  description: Joi.string().max(500).optional(),
  amount: Joi.number().min(0.01).optional(),
  expenseDate: Joi.date().optional(),
  paymentMethod: Joi.string()
    .valid('CASH', 'CHEQUE', 'ONLINE', 'DD', 'BANK_TRANSFER', 'CREDIT_CARD')
    .optional(),
  vendor: Joi.string().max(200).optional(),
  notes: Joi.string().max(500).optional(),
});

const approveExpenseSchema = Joi.object({
  remarks: Joi.string().max(500).optional(),
});

const rejectExpenseSchema = Joi.object({
  reason: Joi.string().max(500).required().messages({
    'string.empty': 'Rejection reason is required',
  }),
});

const getExpensesSchema = Joi.object({
  category: Joi.string()
    .valid(
      'SALARY',
      'UTILITIES',
      'MAINTENANCE',
      'SUPPLIES',
      'EQUIPMENT',
      'TRANSPORT',
      'CONTINGENCY',
      'PROFESSIONAL_DEVELOPMENT',
      'EVENTS',
      'OTHER'
    )
    .optional(),
  status: Joi.string()
    .valid('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED')
    .optional(),
  approvalStatus: Joi.string()
    .valid('PENDING', 'APPROVED', 'REJECTED')
    .optional(),
  fiscalYear: Joi.string().optional(),
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().min(1900).max(2100).optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const expenseReportSchema = Joi.object({
  fiscalYear: Joi.string().required(),
  category: Joi.string().optional(),
});

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
  approveExpenseSchema,
  rejectExpenseSchema,
  getExpensesSchema,
  expenseReportSchema,
  // Aliases used by expense.routes.js
  submitExpenseSchema: approveExpenseSchema,   // submit uses same optional-remarks body
  recordPaymentSchema: createExpenseSchema,    // payment body reuses general expense shape
};
