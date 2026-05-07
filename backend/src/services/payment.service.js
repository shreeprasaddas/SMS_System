/**
 * Payment Service
 * Business logic for payment processing and verification
 */

const Payment = require('../models/finance/Payment.model');
const Invoice = require('../models/finance/Invoice.model');
const StudentFee = require('../models/finance/StudentFee.model');
const Ledger = require('../models/finance/Ledger.model');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class PaymentService {
  /**
   * Record payment
   */
  async recordPayment(schoolId, paymentData, userId) {
    try {
      const { student, studentFee, amount, paymentMethod, transactionId } = paymentData;

      // Validate student fee exists
      const fee = await StudentFee.findOne({
        _id: studentFee,
        schoolId,
        student,
      });

      if (!fee) {
        throw new AppError('Student fee not found', 404);
      }

      // Create payment record
      const payment = new Payment({
        schoolId,
        student,
        studentFee,
        amount,
        paymentMethod,
        transactionId,
        recordedBy: userId,
        status: 'COMPLETED',
        verificationStatus: 'PENDING',
        academicYear: fee.academicYear,
      });

      // Update student fee
      fee.paidAmount += amount;
      fee.paymentHistory = fee.paymentHistory || [];
      fee.paymentHistory.push({
        amount,
        paidOn: new Date(),
        paymentMethod,
        transactionId,
      });

      await Promise.all([payment.save(), fee.save()]);

      logger.info(`Payment recorded: ${payment._id}`);
      return payment;
    } catch (error) {
      logger.error('Error recording payment:', error);
      throw error;
    }
  }

  /**
   * Get payments with filters
   */
  async getPayments(schoolId, filters) {
    try {
      const { student, status, verificationStatus, month, year, page = 1, limit = 10 } =
        filters;

      const query = { schoolId };
      if (student) query.student = student;
      if (status) query.status = status;
      if (verificationStatus) query.verificationStatus = verificationStatus;

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        query.paymentDate = { $gte: startDate, $lte: endDate };
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Payment.find(query)
          .populate('student', 'firstName lastName enrollmentNumber')
          .populate('recordedBy', 'firstName lastName')
          .populate('verifiedBy', 'firstName lastName')
          .sort({ paymentDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Payment.countDocuments(query),
      ]);

      return {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      logger.error('Error fetching payments:', error);
      throw error;
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(schoolId, paymentId, verificationStatus, userId, remarks) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        schoolId,
      });

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      payment.verificationStatus = verificationStatus;
      payment.verifiedBy = userId;
      payment.verifiedOn = new Date();
      payment.verificationNotes = remarks;

      // If rejected, reverse the payment
      if (verificationStatus === 'REJECTED') {
        const studentFee = await StudentFee.findById(payment.studentFee);
        if (studentFee) {
          studentFee.paidAmount -= payment.amount;
          await studentFee.save();
        }
      }

      return await payment.save();
    } catch (error) {
      logger.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(schoolId, paymentId, refundAmount, reason, userId) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        schoolId,
        status: 'COMPLETED',
      });

      if (!payment) {
        throw new AppError('Payment not found or cannot be refunded', 404);
      }

      if (refundAmount > payment.amount) {
        throw new AppError('Refund amount cannot exceed payment amount', 400);
      }

      // Update payment
      payment.status = 'CANCELLED';
      payment.remarks = `Refund: ${reason}`;

      // Update student fee
      const studentFee = await StudentFee.findById(payment.studentFee);
      if (studentFee) {
        studentFee.paidAmount -= refundAmount;
      }

      await Promise.all([payment.save(), studentFee.save()]);

      logger.info(`Refund processed: ${paymentId}, Amount: ${refundAmount}`);

      return { message: 'Refund processed successfully' };
    } catch (error) {
      logger.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Generate payment receipt
   */
  async generateReceipt(schoolId, paymentId) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        schoolId,
      })
        .populate('student', 'firstName lastName enrollmentNumber email')
        .populate('studentFee')
        .populate('recordedBy', 'firstName lastName');

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      // Generate receipt number
      const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      payment.receiptNumber = receiptNumber;
      payment.isReceiptGenerated = true;
      payment.receiptGeneratedOn = new Date();

      await payment.save();

      logger.info(`Receipt generated: ${receiptNumber}`);

      // TODO: Generate PDF and store URL

      return {
        receiptNumber,
        paymentDetails: payment,
      };
    } catch (error) {
      logger.error('Error generating receipt:', error);
      throw error;
    }
  }

  /**
   * Get payment summary report
   */
  async getPaymentSummary(schoolId, academicYear) {
    try {
      const pipeline = [
        {
          $match: {
            schoolId: schoolId,
            academicYear: academicYear,
          },
        },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ];

      const summary = await Payment.aggregate(pipeline);

      // Total payments
      const totalPipeline = [
        {
          $match: {
            schoolId: schoolId,
            academicYear: academicYear,
          },
        },
        {
          $group: {
            _id: null,
            totalPayments: { $sum: '$amount' },
            totalRecords: { $sum: 1 },
          },
        },
      ];

      const totals = await Payment.aggregate(totalPipeline);

      return {
        summary,
        totals: totals[0] || { totalPayments: 0, totalRecords: 0 },
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error generating payment summary:', error);
      throw error;
    }
  }

  /**
   * Record ledger entry for payment
   */
  async recordPaymentLedger(schoolId, paymentId, userId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      const ledgerEntry = new Ledger({
        schoolId,
        type: 'INCOME',
        account: 'TUITION_FEE',
        referenceType: 'PAYMENT',
        referenceId: paymentId,
        referenceNumber: payment.paymentReference,
        creditAmount: payment.amount,
        description: `Payment received for student fee`,
        relatedStudent: payment.student,
        postedBy: userId,
        fiscalYear: payment.academicYear,
      });

      return await ledgerEntry.save();
    } catch (error) {
      logger.error('Error recording payment ledger:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
