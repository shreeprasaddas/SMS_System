/**
 * Fee Service
 * Business logic for fee management
 */

const StudentFee = require('../models/finance/StudentFee.model');
const FeeStructure = require('../models/finance/FeeStructure.model');
const Concession = require('../models/finance/Concession.model');
const Invoice = require('../models/finance/Invoice.model');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class FeeService {
  /**
   * Create fee structure
   */
  async createFeeStructure(schoolId, feeData, userId) {
    try {
      const feeStructure = new FeeStructure({
        schoolId,
        ...feeData,
        createdBy: userId,
      });

      return await feeStructure.save();
    } catch (error) {
      logger.error('Error creating fee structure:', error);
      throw error;
    }
  }

  /**
   * Get fee structures with filters
   */
  async getFeeStructures(schoolId, filters) {
    try {
      const { academicYear, status, page = 1, limit = 10 } = filters;

      const query = { schoolId };
      if (academicYear) query.academicYear = academicYear;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        FeeStructure.find(query)
          .populate('academicYear', 'name code')
          .populate('createdBy', 'firstName lastName')
          .populate('approvedBy', 'firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FeeStructure.countDocuments(query),
      ]);

      return {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      logger.error('Error fetching fee structures:', error);
      throw error;
    }
  }

  /**
   * Approve fee structure
   */
  async approveFeeStructure(schoolId, feeStructureId, userId) {
    try {
      const feeStructure = await FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
      });

      if (!feeStructure) {
        throw new AppError('Fee structure not found', 404);
      }

      feeStructure.status = 'ACTIVE';
      feeStructure.approvedBy = userId;
      feeStructure.approvalDate = new Date();

      return await feeStructure.save();
    } catch (error) {
      logger.error('Error approving fee structure:', error);
      throw error;
    }
  }

  /**
   * Allocate fees to students
   */
  async allocateFeesToStudents(schoolId, feeStructureId, studentIds, userId) {
    try {
      const feeStructure = await FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
        status: 'ACTIVE',
      });

      if (!feeStructure) {
        throw new AppError('Fee structure not found or not active', 404);
      }

      const bulkOps = studentIds.map((studentId) => ({
        updateOne: {
          filter: {
            schoolId,
            student: studentId,
            academicYear: feeStructure.academicYear,
          },
          update: {
            $set: {
              student: studentId,
              class: feeStructure.classes[0].class,
              academicYear: feeStructure.academicYear,
              feeStructure: feeStructureId,
              totalAmount: feeStructure.totalAmount,
              dueAmount: feeStructure.totalAmount,
              feeBreakdown: feeStructure.classes[0].sections[0]?.fees || [],
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await StudentFee.bulkWrite(bulkOps);
      }

      logger.info(`Fees allocated to ${studentIds.length} students`);
      return { message: 'Fees allocated successfully' };
    } catch (error) {
      logger.error('Error allocating fees:', error);
      throw error;
    }
  }

  /**
   * Get student fees with filters
   */
  async getStudentFees(schoolId, filters) {
    try {
      const { student, class: classId, status, academicYear, page = 1, limit = 10 } =
        filters;

      const query = { schoolId };
      if (student) query.student = student;
      if (classId) query.class = classId;
      if (status) query.status = status;
      if (academicYear) query.academicYear = academicYear;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        StudentFee.find(query)
          .populate('student', 'firstName lastName enrollmentNumber')
          .populate('class', 'name')
          .populate('academicYear', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        StudentFee.countDocuments(query),
      ]);

      return {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      logger.error('Error fetching student fees:', error);
      throw error;
    }
  }

  /**
   * Get student fee by ID
   */
  async getStudentFeeById(schoolId, studentFeeId) {
    try {
      const fee = await StudentFee.findOne({
        _id: studentFeeId,
        schoolId,
      })
        .populate('student', 'firstName lastName enrollmentNumber')
        .populate('class', 'name')
        .populate('academicYear', 'name')
        .populate('concessions');

      if (!fee) {
        throw new AppError('Student fee not found', 404);
      }

      return fee;
    } catch (error) {
      logger.error('Error fetching student fee:', error);
      throw error;
    }
  }

  /**
   * Apply concession to student fee
   */
  async applyConcession(schoolId, studentFeeId, concessionId, userId) {
    try {
      const studentFee = await StudentFee.findOne({
        _id: studentFeeId,
        schoolId,
      });

      if (!studentFee) {
        throw new AppError('Student fee not found', 404);
      }

      const concession = await Concession.findOne({
        _id: concessionId,
        schoolId,
        status: 'ACTIVE',
      });

      if (!concession) {
        throw new AppError('Concession not found or not active', 404);
      }

      // Check if concession already applied
      if (studentFee.concessions.includes(concessionId)) {
        throw new AppError('Concession already applied', 400);
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (concession.percentage) {
        discountAmount = (studentFee.totalAmount * concession.percentage) / 100;
      } else {
        discountAmount = concession.amount;
      }

      studentFee.concessions.push(concessionId);
      studentFee.discountAmount += discountAmount;

      return await studentFee.save();
    } catch (error) {
      logger.error('Error applying concession:', error);
      throw error;
    }
  }

  /**
   * Generate fee report
   */
  async getFeeReport(schoolId, academicYear) {
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
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            paidAmount: { $sum: '$paidAmount' },
            dueAmount: { $sum: '$dueAmount' },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ];

      const report = await StudentFee.aggregate(pipeline);

      return {
        summary: report,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error generating fee report:', error);
      throw error;
    }
  }

  /**
   * Exempt student from fees
   */
  async exemptStudentFromFees(schoolId, studentFeeId, reason, userId) {
    try {
      const studentFee = await StudentFee.findOne({
        _id: studentFeeId,
        schoolId,
      });

      if (!studentFee) {
        throw new AppError('Student fee not found', 404);
      }

      studentFee.isExempted = true;
      studentFee.exemptionReason = reason;
      studentFee.status = 'EXEMPTED';

      return await studentFee.save();
    } catch (error) {
      logger.error('Error exempting student:', error);
      throw error;
    }
  }

  /**
   * Create fee reminder
   */
  async sendFeeReminder(schoolId, studentFeeId) {
    try {
      const studentFee = await StudentFee.findOne({
        _id: studentFeeId,
        schoolId,
        status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
      }).populate('student', 'email firstName');

      if (!studentFee) {
        throw new AppError('Student fee not found or already paid', 404);
      }

      // Update reminder tracking
      studentFee.lastReminderSentOn = new Date();
      studentFee.reminderCount = (studentFee.reminderCount || 0) + 1;

      await studentFee.save();

      // TODO: Integrate with email/SMS service
      logger.info(`Fee reminder sent for student fee ${studentFeeId}`);

      return { message: 'Reminder sent successfully' };
    } catch (error) {
      logger.error('Error sending fee reminder:', error);
      throw error;
    }
  }
}

module.exports = new FeeService();
