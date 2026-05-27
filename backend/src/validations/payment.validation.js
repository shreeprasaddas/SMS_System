/**
 * Payment Validation
 * Joi schemas for payment management endpoints
 */

const Joi = require('joi');

const recordPaymentSchema = Joi.object({
  student: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  studentFee: Joi.string().required().messages({
    'string.empty': 'Student fee ID is required',
  }),
  amount: Joi.number().min(0.01).required().messages({
    'number.min': 'Amount must be greater than 0',
  }),
  paymentMethod: Joi.string()
    .valid('CASH', 'CHEQUE', 'ONLINE', 'DD', 'BANK_TRANSFER')
    .required(),
  transactionId: Joi.string().optional(),
  referenceNumber: Joi.string().optional(),
  remarks: Joi.string().max(500).allow('').optional(),
});

const verifyPaymentSchema = Joi.object({
  verificationStatus: Joi.string()
    .valid('VERIFIED', 'REJECTED')
    .required()
    .messages({
      'any.only': 'Status must be VERIFIED or REJECTED',
    }),
  remarks: Joi.string().max(500).optional(),
});

const processRefundSchema = Joi.object({
  refundAmount: Joi.number().min(0.01).required().messages({
    'number.min': 'Refund amount must be greater than 0',
  }),
  reason: Joi.string().max(500).required().messages({
    'string.empty': 'Reason is required',
  }),
});

const getPaymentsSchema = Joi.object({
  student: Joi.string().optional(),
  status: Joi.string()
    .valid('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')
    .optional(),
  verificationStatus: Joi.string()
    .valid('PENDING', 'VERIFIED', 'REJECTED')
    .optional(),
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().min(1900).max(2100).optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const generateReceiptSchema = Joi.object({
  paymentId: Joi.string().required(),
});

module.exports = {
  recordPaymentSchema,
  verifyPaymentSchema,
  processRefundSchema,
  getPaymentsSchema,
  generateReceiptSchema,
  // Aliases used by payment.routes.js
  paymentFilterSchema: getPaymentsSchema,
  approvePaymentSchema: verifyPaymentSchema,
  createRazorpayOrderSchema: recordPaymentSchema,
};
