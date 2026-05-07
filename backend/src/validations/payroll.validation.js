/**
 * Payroll Validation Schemas
 * Request validation for payroll operations
 */

const Joi = require('joi');

const payrollValidation = {
  // Create payroll
  createPayrollSchema: Joi.object({
    employee: Joi.string().required().messages({
      'string.empty': 'Employee ID is required',
    }),
    payrollMonth: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
    payrollYear: Joi.number().required().min(2020).max(2099),
    salaryStructure: Joi.string().required(),
  }).unknown(false),

  // Process payroll
  processPayrollSchema: Joi.object({
    presentDays: Joi.number().required().min(0).max(31),
    leavesTaken: Joi.number().required().min(0),
    bonus: Joi.number().min(0).optional(),
    overtime: Joi.object({
      hours: Joi.number().min(0),
      amount: Joi.number().min(0),
    }).optional(),
  }).unknown(false),

  // Mark payroll as paid
  markPayrollAsPaidSchema: Joi.object({
    paymentMode: Joi.string()
      .valid('BANK_TRANSFER', 'CHEQUE', 'CASH', 'ONLINE')
      .required(),
    bankDetails: Joi.object({
      accountNumber: Joi.string().required(),
      ifscCode: Joi.string().required(),
      bankName: Joi.string().required(),
    }).optional(),
  }).unknown(false),

  // Get payrolls (filters)
  getPayrollsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    employee: Joi.string().optional(),
    payrollMonth: Joi.string().optional(),
    status: Joi.string()
      .valid('DRAFT', 'PROCESSED', 'APPROVED', 'PAID', 'REJECTED')
      .optional(),
  }).unknown(true),

  // Payroll summary
  payrollSummarySchema: Joi.object({
    payrollMonth: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
    payrollYear: Joi.number().required().min(2020).max(2099),
  }).unknown(false),
};

module.exports = payrollValidation;
