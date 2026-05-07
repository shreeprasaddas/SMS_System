/**
 * Exam Controller
 * Exam scheduling, management, and operations
 */

const ExamSchedule = require('../models/exam/ExamSchedule.model');
const ExamType = require('../models/exam/ExamType.model');
const SeatAllocation = require('../models/exam/SeatAllocation.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ExamController {
  /**
   * Create exam type
   */
  static async createExamType(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, description, totalMarks, passingMarks, duration } = req.body;

      if (!name || totalMarks === undefined) {
        throw new ValidationError('Name and total marks are required');
      }

      const examType = new ExamType({
        schoolId,
        name,
        description,
        totalMarks,
        passingMarks,
        duration,
        createdBy: req.user.userId
      });

      await examType.save();

      return responseHelper.created(res, examType, 'Exam type created successfully');
    } catch (error) {
      logger.error('Error creating exam type', error);
      next(error);
    }
  }

  /**
   * Get exam types
   */
  static async getExamTypes(req, res, next) {
    try {
      const { page = 1, limit = 12 } = req.query;
      const schoolId = req.user.schoolId;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await ExamType.countDocuments({ schoolId });
      const types = await ExamType.find({ schoolId })
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, types, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching exam types', error);
      next(error);
    }
  }

  /**
   * Create exam schedule
   */
  static async createExamSchedule(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, examType, class: classId, academicYear, startDate, endDate, scheduleDetails } = req.body;

      if (!name || !examType || !classId || !academicYear || !startDate || !endDate) {
        throw new ValidationError('Missing required fields');
      }

      const schedule = new ExamSchedule({
        schoolId,
        name,
        examType,
        class: classId,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        scheduleDetails,
        createdBy: req.user.userId,
        status: 'SCHEDULED'
      });

      await schedule.save();

      return responseHelper.created(res, schedule, 'Exam schedule created successfully');
    } catch (error) {
      logger.error('Error creating exam schedule', error);
      next(error);
    }
  }

  /**
   * Get exam schedules
   */
  static async getExamSchedules(req, res, next) {
    try {
      const { page = 1, limit = 12, class: classId = '', academicYear = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (classId) filter.class = classId;
      if (academicYear) filter.academicYear = academicYear;
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await ExamSchedule.countDocuments(filter);
      const schedules = await ExamSchedule.find(filter)
        .populate('examType', 'name totalMarks')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ startDate: 1 });

      return responseHelper.paginated(res, schedules, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching exam schedules', error);
      next(error);
    }
  }

  /**
   * Get exam schedule by ID
   */
  static async getExamScheduleById(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOne({ _id: scheduleId, schoolId })
        .populate('examType', 'name totalMarks duration')
        .populate('class', 'name code')
        .populate('scheduleDetails.subject', 'name code')
        .lean();

      if (!schedule) throw new AppError('Exam schedule not found', 404);

      return responseHelper.success(res, schedule, 'Exam schedule retrieved successfully');
    } catch (error) {
      logger.error('Error fetching exam schedule', error);
      next(error);
    }
  }

  /**
   * Update exam schedule
   */
  static async updateExamSchedule(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const schedule = await ExamSchedule.findOneAndUpdate(
        { _id: scheduleId, schoolId },
        updateData,
        { new: true }
      );

      if (!schedule) throw new AppError('Exam schedule not found', 404);

      return responseHelper.success(res, schedule, 'Exam schedule updated successfully');
    } catch (error) {
      logger.error('Error updating exam schedule', error);
      next(error);
    }
  }

  /**
   * Delete exam schedule
   */
  static async deleteExamSchedule(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOneAndDelete({ _id: scheduleId, schoolId });

      if (!schedule) throw new AppError('Exam schedule not found', 404);

      return responseHelper.noContent(res, 'Exam schedule deleted successfully');
    } catch (error) {
      logger.error('Error deleting exam schedule', error);
      next(error);
    }
  }

  /**
   * Allocate seats for exam
   */
  static async allocateSeats(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { examScheduleId, students, roomAssignments } = req.body;

      if (!examScheduleId || !Array.isArray(students)) {
        throw new ValidationError('Invalid data');
      }

      const allocationData = students.map(student => ({
        schoolId,
        examSchedule: examScheduleId,
        student: student.id,
        room: student.room,
        seat: student.seat,
        rollNumber: student.rollNumber,
        status: 'ALLOCATED'
      }));

      const result = await SeatAllocation.insertMany(allocationData);

      return responseHelper.created(res, { count: result.length }, 'Seats allocated successfully');
    } catch (error) {
      logger.error('Error allocating seats', error);
      next(error);
    }
  }

  /**
   * Get seat allocations
   */
  static async getSeatAllocations(req, res, next) {
    try {
      const { page = 1, limit = 20, examScheduleId = '', student = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (examScheduleId) filter.examSchedule = examScheduleId;
      if (student) filter.student = student;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await SeatAllocation.countDocuments(filter);
      const allocations = await SeatAllocation.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, allocations, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching seat allocations', error);
      next(error);
    }
  }

  /**
   * Publish exam results
   */
  static async publishResults(req, res, next) {
    try {
      const { examScheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOneAndUpdate(
        { _id: examScheduleId, schoolId },
        { status: 'RESULTS_PUBLISHED', resultPublishedDate: new Date() },
        { new: true }
      );

      if (!schedule) throw new AppError('Exam schedule not found', 404);

      return responseHelper.success(res, schedule, 'Results published successfully');
    } catch (error) {
      logger.error('Error publishing results', error);
      next(error);
    }
  }

  /**
   * Generate exam hall ticket
   */
  static async generateHallTicket(req, res, next) {
    try {
      const { examScheduleId, studentId } = req.params;
      const schoolId = req.user.schoolId;

      const allocation = await SeatAllocation.findOne({
        schoolId,
        examSchedule: examScheduleId,
        student: studentId
      })
        .populate('examSchedule', 'name startDate endDate')
        .populate('student', 'firstName lastName rollNumber email')
        .lean();

      if (!allocation) throw new AppError('Hall ticket not found', 404);

      const hallTicket = {
        ticketNumber: `HT-${allocation._id}`,
        student: allocation.student,
        exam: allocation.examSchedule,
        room: allocation.room,
        seat: allocation.seat,
        generatedDate: new Date()
      };

      return responseHelper.success(res, hallTicket, 'Hall ticket generated successfully');
    } catch (error) {
      logger.error('Error generating hall ticket', error);
      next(error);
    }
  }

  /**
   * Start exam
   */
  static async startExam(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOneAndUpdate(
        { _id: scheduleId, schoolId },
        { status: 'IN_PROGRESS', actualStartTime: new Date() },
        { new: true }
      );

      if (!schedule) throw new AppError('Exam not found', 404);

      return responseHelper.success(res, schedule, 'Exam started successfully');
    } catch (error) {
      logger.error('Error starting exam', error);
      next(error);
    }
  }

  /**
   * End exam
   */
  static async endExam(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOneAndUpdate(
        { _id: scheduleId, schoolId },
        { status: 'COMPLETED', actualEndTime: new Date() },
        { new: true }
      );

      if (!schedule) throw new AppError('Exam not found', 404);

      return responseHelper.success(res, schedule, 'Exam ended successfully');
    } catch (error) {
      logger.error('Error ending exam', error);
      next(error);
    }
  }

  /**
   * Get exam statistics
   */
  static async getExamStatistics(req, res, next) {
    try {
      const { examScheduleId } = req.params;
      const schoolId = req.user.schoolId;

      const schedule = await ExamSchedule.findOne({ _id: examScheduleId, schoolId }).lean();
      if (!schedule) throw new AppError('Exam not found', 404);

      const allocations = await SeatAllocation.find({
        schoolId,
        examSchedule: examScheduleId
      }).lean();

      const statistics = {
        examScheduleId,
        totalStudents: allocations.length,
        presentStudents: allocations.filter(a => a.status === 'PRESENT').length,
        absentStudents: allocations.filter(a => a.status === 'ABSENT').length,
        presentPercentage: allocations.length > 0 ? Math.round((allocations.filter(a => a.status === 'PRESENT').length / allocations.length) * 100) : 0
      };

      return responseHelper.success(res, statistics, 'Exam statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching exam statistics', error);
      next(error);
    }
  }
}

module.exports = ExamController;
