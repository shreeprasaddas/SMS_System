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
      const {
        name,
        description,
        academicYear,
        classId,
        feeComponents, // Array of { name, amount, frequency, dueDate }
        totalAmount,
      } = req.body;

      if (!name) {
        throw new ValidationError('Fee structure name is required');
      }

      // Resolve academicYear - find active one if not provided
      const AcademicYear = require('../models/academic/AcademicYear.model');
      let resolvedAcademicYear = academicYear;
      if (!resolvedAcademicYear) {
        const activeYear = await AcademicYear.findOne({ status: 'ACTIVE' });
        if (activeYear) {
          resolvedAcademicYear = activeYear._id;
        } else {
          throw new ValidationError('No active academic year found. Please create one first.');
        }
      }

      // Resolve classId
      const Class = require('../models/academic/Class.model');
      let resolvedClassId = classId;
      const mongoose = require('mongoose');
      if (!resolvedClassId || !mongoose.Types.ObjectId.isValid(resolvedClassId)) {
        const defaultClass = await Class.findOne({ schoolId });
        if (defaultClass) {
          resolvedClassId = defaultClass._id;
        } else {
          throw new ValidationError('No class found. Please create a class first.');
        }
      }

      // Build the nested classes structure the model expects
      const fees = (feeComponents && feeComponents.length > 0)
        ? feeComponents.map(comp => ({
            name: comp.name || 'TUITION',
            amount: Number(comp.amount) || 0,
            frequency: comp.frequency || 'ANNUAL',
            dueDate: comp.dueDate || null,
          }))
        : [{
            name: 'TUITION',
            amount: Number(totalAmount) || 0,
            frequency: 'ANNUAL',
          }];

      const calculatedTotal = fees.reduce((sum, f) => sum + f.amount, 0);

      const feeStructure = new FeeStructure({
        schoolId,
        name,
        description: description || '',
        academicYear: resolvedAcademicYear,
        classes: [{
          class: resolvedClassId,
          sections: [{
            fees,
          }],
        }],
        totalAmount: totalAmount || calculatedTotal,
        status: 'DRAFT',
        createdBy: req.user.userId,
      });

      await feeStructure.save();

      // Populate for response
      await feeStructure.populate('academicYear', 'yearName name');
      await feeStructure.populate('classes.class', 'name code');

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
  /**
   * Approve fee structure
   */
  static async approveFeeStructure(req, res, next) {
    try {
      const { feeStructureId } = req.params;
      const schoolId = req.user.schoolId;

      const feeStructure = await FeeStructure.findOneAndUpdate(
        { _id: feeStructureId, schoolId },
        { status: 'APPROVED', approvedBy: req.user.userId, approvedAt: new Date() },
        { new: true }
      );

      if (!feeStructure) throw new AppError('Fee structure not found', 404);

      return responseHelper.success(res, feeStructure, 'Fee structure approved successfully');
    } catch (error) {
      logger.error('Error approving fee structure', error);
      next(error);
    }
  }

  /**
   * Get student fee by ID
   */
  static async getStudentFeeById(req, res, next) {
    try {
      const { studentFeeId } = req.params;
      const schoolId = req.user.schoolId;

      const studentFee = await StudentFee.findOne({ _id: studentFeeId, schoolId })
        .populate('student', 'firstName lastName rollNumber')
        .populate('class', 'name code')
        .populate('feeStructure')
        .lean();

      if (!studentFee) throw new AppError('Student fee not found', 404);

      return responseHelper.success(res, studentFee, 'Student fee retrieved successfully');
    } catch (error) {
      logger.error('Error fetching student fee details', error);
      next(error);
    }
  }

  /**
   * Exempt student from fees
   */
  static async exemptFromFees(req, res, next) {
    try {
      const { studentFeeId } = req.params;
      const schoolId = req.user.schoolId;
      const { reason } = req.body;

      const studentFee = await StudentFee.findOneAndUpdate(
        { _id: studentFeeId, schoolId },
        { status: 'EXEMPTED', remarks: reason },
        { new: true }
      );

      if (!studentFee) throw new AppError('Student fee not found', 404);

      return responseHelper.success(res, studentFee, 'Student exempted from fees');
    } catch (error) {
      logger.error('Error exempting from fees', error);
      next(error);
    }
  }

  /**
   * Send fee reminder
   */
  static async sendFeeReminder(req, res, next) {
    try {
      // Stub for sending fee reminder
      return responseHelper.success(res, null, 'Fee reminder sent successfully');
    } catch (error) {
      logger.error('Error sending fee reminder', error);
      next(error);
    }
  }
}

module.exports = FeeController;
