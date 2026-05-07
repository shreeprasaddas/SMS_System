/**
 * Fee Controller
 * Fee management, payment tracking, and financial reports
 */

const StudentFee = require('../models/finance/StudentFee.model');
const FeeStructure = require('../models/finance/FeeStructure.model');
const Payment = require('../models/finance/Payment.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class FeeController {
  /**
   * Create fee structure
   */
  static async createFeeStructure(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, academicYear, class: classId, feeComponents, totalAmount } = req.body;

      if (!name || !academicYear || !classId) {
        throw new ValidationError('Missing required fields');
      }

      const feeStructure = new FeeStructure({
        schoolId,
        name,
        academicYear,
        class: classId,
        feeComponents,
        totalAmount,
        createdBy: req.user.userId
      });

      await feeStructure.save();

      return responseHelper.created(res, feeStructure, 'Fee structure created successfully');
    } catch (error) {
      logger.error('Error creating fee structure', error);
      next(error);
    }
  }

  /**
   * Get fee structures
   */
  static async getFeeStructures(req, res, next) {
    try {
      const { page = 1, limit = 12, academicYear = '', class: classId = '', search = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (academicYear) filter.academicYear = academicYear;
      if (classId) filter.class = classId;
      if (search) filter.name = { $regex: search, $options: 'i' };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await FeeStructure.countDocuments(filter);
      const structures = await FeeStructure.find(filter)
        .populate('academicYear', 'yearName')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, structures, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching fee structures', error);
      next(error);
    }
  }

  /**
   * Assign fee structure to student
   */
  static async assignFeeStructure(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { student, class: classId, academicYear, feeStructure } = req.body;

      if (!student || !classId || !academicYear || !feeStructure) {
        throw new ValidationError('Missing required fields');
      }

      const structure = await FeeStructure.findOne({ _id: feeStructure, schoolId }).lean();
      if (!structure) throw new AppError('Fee structure not found', 404);

      const studentFee = new StudentFee({
        schoolId,
        student,
        class: classId,
        academicYear,
        feeStructure,
        totalAmount: structure.totalAmount,
        dueAmount: structure.totalAmount
      });

      await studentFee.save();

      return responseHelper.created(res, studentFee, 'Fee structure assigned successfully');
    } catch (error) {
      logger.error('Error assigning fee structure', error);
      next(error);
    }
  }

  /**
   * Get student fees
   */
  static async getStudentFees(req, res, next) {
    try {
      const { page = 1, limit = 12, student = '', class: classId = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (student) filter.student = student;
      if (classId) filter.class = classId;
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await StudentFee.countDocuments(filter);
      const fees = await StudentFee.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, fees, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching student fees', error);
      next(error);
    }
  }

  /**
   * Record fee payment
   */
  static async recordPayment(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { studentFeeId, amount, paymentMethod, transactionId, remarks } = req.body;

      if (!studentFeeId || !amount || !paymentMethod) {
        throw new ValidationError('Missing required fields');
      }

      const studentFee = await StudentFee.findOne({ _id: studentFeeId, schoolId });
      if (!studentFee) throw new AppError('Student fee not found', 404);

      if (amount > studentFee.dueAmount) {
        throw new ValidationError('Payment amount exceeds due amount');
      }

      const payment = new Payment({
        schoolId,
        studentFee: studentFeeId,
        amount,
        paymentMethod,
        transactionId,
        remarks,
        recordedBy: req.user.userId,
        date: new Date()
      });

      await payment.save();

      studentFee.paidAmount += amount;
      studentFee.dueAmount -= amount;
      if (studentFee.dueAmount <= 0) {
        studentFee.status = 'PAID';
      } else {
        studentFee.status = 'PARTIAL';
      }

      studentFee.paymentHistory.push({
        amount,
        paidOn: new Date(),
        paymentMethod,
        transactionId,
        remarks
      });

      await studentFee.save();

      return responseHelper.created(res, { payment, studentFee }, 'Payment recorded successfully');
    } catch (error) {
      logger.error('Error recording payment', error);
      next(error);
    }
  }

  /**
   * Get fee payment history
   */
  static async getPaymentHistory(req, res, next) {
    try {
      const { page = 1, limit = 12, studentFeeId = '', fromDate = '', toDate = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (studentFeeId) filter.studentFee = studentFeeId;
      if (fromDate || toDate) {
        filter.date = {};
        if (fromDate) filter.date.$gte = new Date(fromDate);
        if (toDate) filter.date.$lte = new Date(toDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Payment.countDocuments(filter);
      const payments = await Payment.find(filter)
        .populate('studentFee')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: -1 });

      return responseHelper.paginated(res, payments, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching payment history', error);
      next(error);
    }
  }

  /**
   * Get fee summary
   */
  static async getFeeSummary(req, res, next) {
    try {
      const { class: classId, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('Class and academic year are required');
      }

      const fees = await StudentFee.find({ schoolId, class: classId, academicYear }).lean();

      const summary = {
        totalStudents: fees.length,
        totalFeeAmount: fees.reduce((sum, f) => sum + f.totalAmount, 0),
        totalCollected: fees.reduce((sum, f) => sum + f.paidAmount, 0),
        totalPending: fees.reduce((sum, f) => sum + f.dueAmount, 0),
        paidCount: fees.filter(f => f.status === 'PAID').length,
        partialCount: fees.filter(f => f.status === 'PARTIAL').length,
        pendingCount: fees.filter(f => f.status === 'PENDING').length
      };

      summary.collectionPercentage = summary.totalFeeAmount > 0 
        ? Math.round((summary.totalCollected / summary.totalFeeAmount) * 100) 
        : 0;

      return responseHelper.success(res, summary, 'Fee summary retrieved successfully');
    } catch (error) {
      logger.error('Error fetching fee summary', error);
      next(error);
    }
  }

  /**
   * Generate fee invoice
   */
  static async generateInvoice(req, res, next) {
    try {
      const { studentFeeId } = req.params;
      const schoolId = req.user.schoolId;

      const studentFee = await StudentFee.findOne({ _id: studentFeeId, schoolId })
        .populate('student', 'firstName lastName email')
        .populate('class', 'name code')
        .lean();

      if (!studentFee) throw new AppError('Student fee not found', 404);

      const invoice = {
        invoiceNumber: `INV-${studentFee._id}-${Date.now()}`,
        date: new Date(),
        student: studentFee.student,
        class: studentFee.class,
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        dueAmount: studentFee.dueAmount,
        paymentHistory: studentFee.paymentHistory
      };

      return responseHelper.success(res, invoice, 'Invoice generated successfully');
    } catch (error) {
      logger.error('Error generating invoice', error);
      next(error);
    }
  }

  /**
   * Apply concession to student fee
   */
  static async applyConcession(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { studentFeeId } = req.params;
      const { discountAmount, reason } = req.body;

      if (!discountAmount || discountAmount < 0) {
        throw new ValidationError('Valid discount amount is required');
      }

      const studentFee = await StudentFee.findOneAndUpdate(
        { _id: studentFeeId, schoolId },
        {
          discountAmount,
          dueAmount: Math.max(0, (this.totalAmount - discountAmount) - this.paidAmount),
          concessionReason: reason
        },
        { new: true }
      );

      if (!studentFee) throw new AppError('Student fee not found', 404);

      return responseHelper.success(res, studentFee, 'Concession applied successfully');
    } catch (error) {
      logger.error('Error applying concession', error);
      next(error);
    }
  }

  /**
   * Get overdue fees
   */
  static async getOverdueFees(req, res, next) {
    try {
      const { page = 1, limit = 12, days = 30 } = req.query;
      const schoolId = req.user.schoolId;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

      const filter = {
        schoolId,
        status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
        updatedAt: { $lt: cutoffDate }
      };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await StudentFee.countDocuments(filter);
      const overdueFees = await StudentFee.find(filter)
        .populate('student', 'firstName lastName email')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, overdueFees, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching overdue fees', error);
      next(error);
    }
  }
}

module.exports = FeeController;
  }

  /**
   * Allocate fees to students
   * POST /api/v1/fees/allocate
   */
  static async allocateFeesToStudents(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { feeStructureId, studentIds } = req.body;

      const result = await feeService.allocateFeesToStudents(
        schoolId,
        feeStructureId,
        studentIds,
        userId
      );

      responseHelper.success(res, result, 'Fees allocated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student fees
   * GET /api/v1/fees/students
   */
  static async getStudentFees(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await feeService.getStudentFees(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Student fees retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student fee details
   * GET /api/v1/fees/students/:studentFeeId
   */
  static async getStudentFeeById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { studentFeeId } = req.params;

      const fee = await feeService.getStudentFeeById(schoolId, studentFeeId);

      responseHelper.success(res, fee, 'Student fee retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Apply concession
   * POST /api/v1/fees/students/:studentFeeId/concession
   */
  static async applyConcession(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { studentFeeId } = req.params;
      const { concessionId } = req.body;

      const fee = await feeService.applyConcession(
        schoolId,
        studentFeeId,
        concessionId,
        userId
      );

      responseHelper.success(res, fee, 'Concession applied successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exempt student from fees
   * POST /api/v1/fees/students/:studentFeeId/exempt
   */
  static async exemptFromFees(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { studentFeeId } = req.params;
      const { reason } = req.body;

      const fee = await feeService.exemptStudentFromFees(
        schoolId,
        studentFeeId,
        reason,
        userId
      );

      responseHelper.success(res, fee, 'Student exempted from fees successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send fee reminder
   * POST /api/v1/fees/students/:studentFeeId/reminder
   */
  static async sendFeeReminder(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { studentFeeId } = req.params;

      const result = await feeService.sendFeeReminder(schoolId, studentFeeId);

      responseHelper.success(res, result, 'Fee reminder sent successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get fee report
   * GET /api/v1/fees/report
   */
  static async getFeeReport(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { academicYear } = req.query;

      if (!academicYear) {
        throw new AppError('Academic year is required', 400);
      }

      const report = await feeService.getFeeReport(schoolId, academicYear);

      responseHelper.success(res, report, 'Fee report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeeController;
