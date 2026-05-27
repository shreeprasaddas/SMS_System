/**
 * Payment Routes
 * API endpoints for payment management
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const paymentValidation = require('../validations/payment.validation');

/**
 * Payment Recording Routes
 */

// Record payment
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT']),
  validate(paymentValidation.recordPaymentSchema, 'body'),
  PaymentController.recordPayment
);

// Get payments
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(paymentValidation.paymentFilterSchema, 'query'),
  PaymentController.getPayments
);

// Get payment by ID
router.get(
  '/:paymentId',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'STUDENT', 'PARENT']),
  PaymentController.getPaymentById
);

// Update payment status
router.patch(
  '/:paymentId/status',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(paymentValidation.approvePaymentSchema, 'body'),
  PaymentController.updatePaymentStatus
);

/**
 * Razorpay Gateway Routes
 */

// Create Razorpay order
router.post(
  '/razorpay/order',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT']),
  validate(paymentValidation.createRazorpayOrderSchema, 'body'),
  PaymentController.createRazorpayOrder
);

// Verify Razorpay payment
router.post(
  '/razorpay/verify',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT']),
  PaymentController.verifyRazorpayPayment
);

// Razorpay webhook (no auth required for webhooks)
router.post('/razorpay/webhook', PaymentController.handleRazorpayWebhook);

/**
 * Payment Approval Workflow Routes
 */

// Approve payment (offline payments)
router.patch(
  '/:paymentId/approve',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.approvePayment
);

// Reject payment
router.patch(
  '/:paymentId/reject',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validate(paymentValidation.approvePaymentSchema, 'body'),
  PaymentController.rejectPayment
);

// Initiate refund
router.post(
  '/:paymentId/refund',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.initiateRefund
);

/**
 * Payment Reconciliation & Reporting Routes
 */

// Reconcile payments
router.post(
  '/reconcile',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.reconcilePayments
);

// Generate payment report
router.get(
  '/report',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.generatePaymentReport
);

// Get pending approvals
router.get(
  '/pending-approvals',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.getPendingApprovals
);

// Get payment analytics
router.get(
  '/analytics',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  PaymentController.getPaymentAnalytics
);

module.exports = router;
