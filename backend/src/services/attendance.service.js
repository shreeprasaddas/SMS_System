/**
 * Attendance Service
 * Business logic for attendance management
 */

const StudentAttendance = require('../models/attendance/StudentAttendance.model');
const StaffAttendance = require('../models/attendance/StaffAttendance.model');
const AttendanceRule = require('../models/attendance/AttendanceRule.model');
const HolidayCalendar = require('../models/attendance/HolidayCalendar.model');
const { AppError, ValidationError } = require('../utils/errorHelper');
const { ATTENDANCE_STATUS } = require('../../../shared/constants/status.js');
const logger = require('../utils/logger');

class AttendanceService {
  // ==================== STUDENT ATTENDANCE ====================

  /**
   * Mark student attendance
   */
  async markStudentAttendance(schoolId, attendanceData, userId) {
    try {
      const { student, class: classId, academicYear, date, status, remarks } = attendanceData;

      // Check if attendance already exists for this date
      const existingAttendance = await StudentAttendance.findOne({
        schoolId,
        student,
        class: classId,
        academicYear,
        date: {
          $gte: new Date(date).setHours(0, 0, 0, 0),
          $lt: new Date(date).setHours(23, 59, 59, 999),
        },
      });

      if (existingAttendance) {
        // Update existing
        existingAttendance.status = status;
        existingAttendance.remarks = remarks;
        existingAttendance.markedBy = userId;
        return await existingAttendance.save();
      }

      // Create new
      const newAttendance = new StudentAttendance({
        schoolId,
        student,
        class: classId,
        academicYear,
        date: new Date(date).setHours(0, 0, 0, 0),
        status,
        remarks,
        markedBy: userId,
      });

      return await newAttendance.save();
    } catch (error) {
      logger.error('Error marking student attendance:', error);
      throw error;
    }
  }

  /**
   * Mark attendance for multiple students
   */
  async markBulkStudentAttendance(schoolId, classId, academicYear, date, attendanceRecords, userId) {
    try {
      const bulkOps = attendanceRecords.map((record) => ({
        updateOne: {
          filter: {
            schoolId,
            student: record.student,
            class: classId,
            academicYear,
            date: {
              $gte: new Date(date).setHours(0, 0, 0, 0),
              $lt: new Date(date).setHours(23, 59, 59, 999),
            },
          },
          update: {
            $set: {
              status: record.status,
              remarks: record.remarks || '',
              markedBy: userId,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      await StudentAttendance.bulkWrite(bulkOps);
      logger.info(`Bulk attendance marked for ${attendanceRecords.length} students`);
      return { message: 'Attendance marked successfully' };
    } catch (error) {
      logger.error('Error marking bulk student attendance:', error);
      throw error;
    }
  }

  /**
   * Get student attendance records with filters
   */
  async getStudentAttendance(schoolId, filters) {
    try {
      const { student, class: classId, academicYear, month, year, status, page = 1, limit = 10 } = filters;

      const query = { schoolId };

      if (student) query.student = student;
      if (classId) query.class = classId;
      if (academicYear) query.academicYear = academicYear;
      if (status) query.status = status;

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        query.date = { $gte: startDate, $lte: endDate };
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        StudentAttendance.find(query)
          .populate('student', 'firstName lastName enrollmentNumber')
          .populate('class', 'name code')
          .populate('markedBy', 'firstName lastName')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        StudentAttendance.countDocuments(query),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching student attendance:', error);
      throw error;
    }
  }

  /**
   * Calculate attendance percentage for a student
   */
  async calculateStudentAttendancePercentage(schoolId, student, academicYear) {
    try {
      const pipeline = [
        {
          $match: {
            schoolId: schoolId,
            student: student,
            academicYear: academicYear,
          },
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: 1 },
            presentDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.PRESENT] }, 1, 0] },
            },
            absentDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.ABSENT] }, 1, 0] },
            },
            lateDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.LATE] }, 1, 0] },
            },
            halfDayDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.HALF_DAY] }, 1, 0] },
            },
            leaveDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.LEAVE] }, 1, 0] },
            },
          },
        },
      ];

      const result = await StudentAttendance.aggregate(pipeline);

      if (result.length === 0) {
        return {
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          halfDayDays: 0,
          leaveDays: 0,
          attendancePercentage: 0,
        };
      }

      const stats = result[0];
      const presentCount = stats.presentDays + stats.halfDayDays * 0.5;
      const attendancePercentage =
        stats.totalDays > 0 ? Math.round((presentCount / stats.totalDays) * 100) : 0;

      return {
        ...stats,
        attendancePercentage,
      };
    } catch (error) {
      logger.error('Error calculating student attendance percentage:', error);
      throw error;
    }
  }

  // ==================== STAFF ATTENDANCE ====================

  /**
   * Mark staff attendance
   */
  async markStaffAttendance(schoolId, attendanceData, userId) {
    try {
      const { user, date, timeIn, timeOut, status, remarks } = attendanceData;

      const existingAttendance = await StaffAttendance.findOne({
        schoolId,
        user,
        date: {
          $gte: new Date(date).setHours(0, 0, 0, 0),
          $lt: new Date(date).setHours(23, 59, 59, 999),
        },
      });

      if (existingAttendance) {
        existingAttendance.timeIn = timeIn || existingAttendance.timeIn;
        existingAttendance.timeOut = timeOut || existingAttendance.timeOut;
        existingAttendance.status = status;
        existingAttendance.remarks = remarks;
        return await existingAttendance.save();
      }

      const newAttendance = new StaffAttendance({
        schoolId,
        user,
        date: new Date(date).setHours(0, 0, 0, 0),
        timeIn,
        timeOut,
        status,
        remarks,
      });

      return await newAttendance.save();
    } catch (error) {
      logger.error('Error marking staff attendance:', error);
      throw error;
    }
  }

  /**
   * Get staff attendance records with filters
   */
  async getStaffAttendance(schoolId, filters) {
    try {
      const { user, month, year, status, approvalStatus, page = 1, limit = 10 } = filters;

      const query = { schoolId };

      if (user) query.user = user;
      if (status) query.status = status;
      if (approvalStatus) query.approvalStatus = approvalStatus;

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        query.date = { $gte: startDate, $lte: endDate };
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        StaffAttendance.find(query)
          .populate('user', 'firstName lastName email')
          .populate('approvedBy', 'firstName lastName')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        StaffAttendance.countDocuments(query),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching staff attendance:', error);
      throw error;
    }
  }

  /**
   * Approve or reject staff attendance
   */
  async approveStaffAttendance(schoolId, attendanceId, approvalStatus, userId) {
    try {
      const attendance = await StaffAttendance.findOne({
        _id: attendanceId,
        schoolId,
      });

      if (!attendance) {
        throw new AppError('Attendance record not found', 404);
      }

      attendance.approvalStatus = approvalStatus;
      attendance.approvedBy = userId;
      return await attendance.save();
    } catch (error) {
      logger.error('Error approving staff attendance:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE RULES ====================

  /**
   * Create or update attendance rule
   */
  async upsertAttendanceRule(schoolId, ruleData, userId) {
    try {
      const existingRule = await AttendanceRule.findOne({ schoolId, status: 'ACTIVE' });

      if (existingRule) {
        Object.assign(existingRule, ruleData);
        existingRule.updatedAt = new Date();
        return await existingRule.save();
      }

      const newRule = new AttendanceRule({
        schoolId,
        ...ruleData,
        createdBy: userId,
      });

      return await newRule.save();
    } catch (error) {
      logger.error('Error upserting attendance rule:', error);
      throw error;
    }
  }

  /**
   * Get attendance rule
   */
  async getAttendanceRule(schoolId) {
    try {
      const rule = await AttendanceRule.findOne({ schoolId, status: 'ACTIVE' }).populate(
        'createdBy',
        'firstName lastName'
      );

      if (!rule) {
        // Return default rule
        return {
          minimumAttendancePercentage: 75,
          lateMarkAfter: 15,
          autoMarkAbsentAfter: 4,
          halfDayMarkAfter: 180,
          allowHolidayMarking: true,
          allowLeaveMarking: true,
          sendNotifications: true,
          notificationThreshold: 20,
        };
      }

      return rule;
    } catch (error) {
      logger.error('Error fetching attendance rule:', error);
      throw error;
    }
  }

  // ==================== HOLIDAY CALENDAR ====================

  /**
   * Create holiday
   */
  async createHoliday(schoolId, holidayData, userId) {
    try {
      const newHoliday = new HolidayCalendar({
        schoolId,
        ...holidayData,
        createdBy: userId,
      });

      return await newHoliday.save();
    } catch (error) {
      logger.error('Error creating holiday:', error);
      throw error;
    }
  }

  /**
   * Get holidays
   */
  async getHolidays(schoolId, filters) {
    try {
      const { academicYear, type, page = 1, limit = 10 } = filters;

      const query = { schoolId };

      if (academicYear) query.academicYear = academicYear;
      if (type) query.type = type;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        HolidayCalendar.find(query)
          .populate('academicYear', 'name code')
          .populate('createdBy', 'firstName lastName')
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        HolidayCalendar.countDocuments(query),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching holidays:', error);
      throw error;
    }
  }

  /**
   * Check if date is holiday
   */
  async isHoliday(schoolId, date, academicYear) {
    try {
      const checkDate = new Date(date);
      const holiday = await HolidayCalendar.findOne({
        schoolId,
        academicYear,
        date: {
          $gte: checkDate.setHours(0, 0, 0, 0),
          $lt: checkDate.setHours(23, 59, 59, 999),
        },
      }).lean();

      return !!holiday;
    } catch (error) {
      logger.error('Error checking holiday:', error);
      throw error;
    }
  }

  /**
   * Update holiday
   */
  async updateHoliday(schoolId, holidayId, holidayData) {
    try {
      const holiday = await HolidayCalendar.findOneAndUpdate(
        { _id: holidayId, schoolId },
        { ...holidayData, updatedAt: new Date() },
        { new: true }
      );

      if (!holiday) {
        throw new AppError('Holiday not found', 404);
      }

      return holiday;
    } catch (error) {
      logger.error('Error updating holiday:', error);
      throw error;
    }
  }

  /**
   * Delete holiday
   */
  async deleteHoliday(schoolId, holidayId) {
    try {
      const holiday = await HolidayCalendar.findOneAndDelete({
        _id: holidayId,
        schoolId,
      });

      if (!holiday) {
        throw new AppError('Holiday not found', 404);
      }

      return { message: 'Holiday deleted successfully' };
    } catch (error) {
      logger.error('Error deleting holiday:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE REPORTS ====================

  /**
   * Generate class attendance report
   */
  async getClassAttendanceReport(schoolId, classId, academicYear, month, year) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const pipeline = [
        {
          $match: {
            schoolId: schoolId,
            class: classId,
            academicYear: academicYear,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$student',
            totalDays: { $sum: 1 },
            presentDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.PRESENT] }, 1, 0] },
            },
            absentDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.ABSENT] }, 1, 0] },
            },
            lateDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.LATE] }, 1, 0] },
            },
            halfDayDays: {
              $sum: { $cond: [{ $eq: ['$status', ATTENDANCE_STATUS.HALF_DAY] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'studentDetails',
          },
        },
        {
          $unwind: '$studentDetails',
        },
        {
          $project: {
            _id: 0,
            studentId: '$_id',
            studentName: {
              $concat: ['$studentDetails.firstName', ' ', '$studentDetails.lastName'],
            },
            enrollmentNumber: '$studentDetails.enrollmentNumber',
            totalDays: 1,
            presentDays: 1,
            absentDays: 1,
            lateDays: 1,
            halfDayDays: 1,
            attendancePercentage: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $add: [
                            '$presentDays',
                            { $multiply: ['$halfDayDays', 0.5] },
                          ],
                        },
                        '$totalDays',
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $sort: { studentName: 1 },
        },
      ];

      const report = await StudentAttendance.aggregate(pipeline);
      return report;
    } catch (error) {
      logger.error('Error generating class attendance report:', error);
      throw error;
    }
  }
}

module.exports = new AttendanceService();

