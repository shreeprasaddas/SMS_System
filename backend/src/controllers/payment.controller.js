/**
 * Payment Controller
 * HTTP request handlers for payment management
 */

const paymentService = require('../services/payment.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class PaymentController {
  /**
   * Record payment
   * POST /api/v1/payments
   */
  static async recordPayment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const paymentData = req.body;

      const payment = await paymentService.recordPayment(
        schoolId,
        paymentData,
        userId
      );

      responseHelper.created(res, payment, 'Payment recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payments
   * GET /api/v1/payments
   */
  static async getPayments(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await paymentService.getPayments(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Payments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by ID
   * GET /api/v1/payments/:paymentId
   */
  static async getPaymentById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { paymentId } = req.params;

      const payment = await paymentService.getPaymentById(schoolId, paymentId);

      responseHelper.success(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payment status
   * PATCH /api/v1/payments/:paymentId/status
   */
  static async updatePaymentStatus(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { paymentId } = req.params;
      const { status } = req.body;

      const payment = await paymentService.updatePaymentStatus(
        schoolId,
        paymentId,
        status,
        userId
      );

      responseHelper.success(res, payment, 'Payment status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Razorpay order
   * POST /api/v1/payments/razorpay/order
   */
  static async createRazorpayOrder(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { studentFeeId, amount } = req.body;

      const order = await paymentService.createRazorpayOrder(
        schoolId,
        studentFeeId,
        amount,
        userId
      );

      responseHelper.success(res, order, 'Razorpay order created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify Razorpay payment
   * POST /api/v1/payments/razorpay/verify
   */
  static async verifyRazorpayPayment(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { orderId, paymentId, signature } = req.body;

      const payment = await paymentService.verifyRazorpayPayment(
        schoolId,
        orderId,
        paymentId,
        signature
      );

      responseHelper.success(res, payment, 'Razorpay payment verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Razorpay webhook handler
   * POST /api/v1/payments/razorpay/webhook
   */
  static async handleRazorpayWebhook(req, res, next) {
    try {
      const { schoolId } = req.user;
      const webhookData = req.body;

      const result = await paymentService.handlePaymentCallback(schoolId, webhookData);

      responseHelper.success(res, result, 'Webhook processed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve payment
   * PATCH /api/v1/payments/:paymentId/approve
   */
  static async approvePayment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { paymentId } = req.params;

      const payment = await paymentService.approvePayment(
        schoolId,
        paymentId,
        userId
      );

      responseHelper.success(res, payment, 'Payment approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject payment
   * PATCH /api/v1/payments/:paymentId/reject
   */
  static async rejectPayment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { paymentId } = req.params;
      const { reason } = req.body;

      const payment = await paymentService.rejectPayment(
        schoolId,
        paymentId,
        reason,
        userId
      );

      responseHelper.success(res, payment, 'Payment rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Initiate refund
   * POST /api/v1/payments/:paymentId/refund
   */
  static async initiateRefund(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { paymentId } = req.params;
      const { reason } = req.body;

      const refund = await paymentService.initiateRefund(
        schoolId,
        paymentId,
        reason,
        userId
      );

      responseHelper.success(res, refund, 'Refund initiated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reconcile payments
   * POST /api/v1/payments/reconcile
   */
  static async reconcilePayments(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { startDate, endDate } = req.body;

      const reconciliation = await paymentService.reconcilePayments(
        schoolId,
        startDate,
        endDate
      );

      responseHelper.success(res, reconciliation, 'Payments reconciled successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate payment report
   * GET /api/v1/payments/report
   */
  static async generatePaymentReport(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const report = await paymentService.generatePaymentReport(schoolId, filters);

      responseHelper.success(res, report, 'Payment report generated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending approvals
   * GET /api/v1/payments/pending-approvals
   */
  static async getPendingApprovals(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await paymentService.getPendingApprovals(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Pending approvals retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment analytics
   * GET /api/v1/payments/analytics
   */
  static async getPaymentAnalytics(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { academicYear } = req.query;

      if (!academicYear) {
        throw new AppError('Academic year is required', 400);
      }

      const analytics = await paymentService.getPaymentAnalytics(schoolId, academicYear);

      responseHelper.success(res, analytics, 'Payment analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
