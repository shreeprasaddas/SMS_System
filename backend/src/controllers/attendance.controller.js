const StudentAttendance = require('../models/attendance/StudentAttendance.model');
const StaffAttendance = require('../models/attendance/StaffAttendance.model');
const HolidayCalendar = require('../models/attendance/HolidayCalendar.model');
const AttendanceRule = require('../models/attendance/AttendanceRule.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class AttendanceController {
  /**
   * Mark student attendance
   */
  static async markStudentAttendance(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { student, class: classId, academicYear, date, status, remarks } = req.body;

      if (!student || !classId || !academicYear || !date || !status) {
        throw new ValidationError('Missing required fields');
      }

      const attendance = new StudentAttendance({
        schoolId,
        student,
        class: classId,
        academicYear,
        date: new Date(date),
        status,
        remarks,
        markedBy: req.user.userId
      });

      await attendance.save();
      await attendance.populate('student', 'firstName lastName');

      return responseHelper.created(res, attendance, 'Attendance marked successfully');
    } catch (error) {
      logger.error('Error marking attendance', error);
      next(error);
    }
  }

  /**
   * Mark bulk student attendance
   */
  static async markBulkStudentAttendance(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { classId, academicYear, date, attendanceRecords } = req.body;

      if (!classId || !academicYear || !date || !Array.isArray(attendanceRecords)) {
        throw new ValidationError('Missing or invalid required fields');
      }

      const attendanceData = attendanceRecords.map(record => ({
        schoolId,
        student: record.student,
        class: classId,
        academicYear,
        date: new Date(date),
        status: record.status,
        remarks: record.remarks,
        markedBy: req.user.userId
      }));

      const result = await StudentAttendance.insertMany(attendanceData);

      return responseHelper.success(res, { count: result.length, records: result }, 'Bulk attendance marked successfully');
    } catch (error) {
      logger.error('Error marking bulk attendance', error);
      next(error);
    }
  }

  /**
   * Get student attendance records
   */
  static async getStudentAttendance(req, res, next) {
    try {
      const { page = 1, limit = 20, student = '', class: classId = '', academicYear = '', fromDate = '', toDate = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (student) filter.student = student;
      if (classId) filter.class = classId;
      if (academicYear) filter.academicYear = academicYear;
      if (fromDate || toDate) {
        filter.date = {};
        if (fromDate) filter.date.$gte = new Date(fromDate);
        if (toDate) filter.date.$lte = new Date(toDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await StudentAttendance.countDocuments(filter);
      const records = await StudentAttendance.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .populate('class', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: -1 });

      return responseHelper.paginated(res, records, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching attendance records', error);
      next(error);
    }
  }

  /**
   * Get student attendance percentage
   */
  static async getStudentAttendancePercentage(req, res, next) {
    try {
      const { studentId } = req.params;
      const { academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!academicYear) throw new ValidationError('Academic year is required');

      const totalRecords = await StudentAttendance.countDocuments({
        schoolId,
        student: studentId,
        academicYear
      });

      const presentRecords = await StudentAttendance.countDocuments({
        schoolId,
        student: studentId,
        academicYear,
        status: 'PRESENT'
      });

      const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

      return responseHelper.success(res, {
        student: studentId,
        academicYear,
        totalDays: totalRecords,
        presentDays: presentRecords,
        percentage: Math.round(percentage)
      }, 'Attendance percentage calculated');
    } catch (error) {
      logger.error('Error calculating attendance percentage', error);
      next(error);
    }
  }

  /**
   * Get class attendance report
   */
  static async getClassAttendanceReport(req, res, next) {
    try {
      const { classId, academicYear, month, year } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear || !month || !year) {
        throw new ValidationError('classId, academicYear, month, and year are required');
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const records = await StudentAttendance.find({
        schoolId,
        class: classId,
        academicYear,
        date: { $gte: startDate, $lte: endDate }
      })
        .populate('student', 'firstName lastName rollNumber')
        .lean();

      const reportData = {};
      records.forEach(record => {
        if (!reportData[record.student._id]) {
          reportData[record.student._id] = {
            student: record.student,
            present: 0,
            absent: 0,
            halfDay: 0,
            leave: 0,
            total: 0
          };
        }
        reportData[record.student._id][record.status.toLowerCase()]++;
        reportData[record.student._id].total++;
      });

      const report = Object.values(reportData).map(item => ({
        ...item,
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0
      }));

      return responseHelper.success(res, report, 'Class attendance report generated');
    } catch (error) {
      logger.error('Error generating class report', error);
      next(error);
    }
  }

  /**
   * Mark staff attendance
   */
  static async markStaffAttendance(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { staff, date, status, inTime, outTime, remarks } = req.body;

      if (!staff || !date || !status) {
        throw new ValidationError('Missing required fields');
      }

      const attendance = new StaffAttendance({
        schoolId,
        staff,
        date: new Date(date),
        status,
        inTime,
        outTime,
        remarks,
        markedBy: req.user.userId
      });

      await attendance.save();

      return responseHelper.created(res, attendance, 'Staff attendance marked successfully');
    } catch (error) {
      logger.error('Error marking staff attendance', error);
      next(error);
    }
  }

  /**
   * Get staff attendance
   */
  static async getStaffAttendance(req, res, next) {
    try {
      const { page = 1, limit = 20, staff = '', status = '', fromDate = '', toDate = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (staff) filter.staff = staff;
      if (status) filter.status = status;
      if (fromDate || toDate) {
        filter.date = {};
        if (fromDate) filter.date.$gte = new Date(fromDate);
        if (toDate) filter.date.$lte = new Date(toDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await StaffAttendance.countDocuments(filter);
      const records = await StaffAttendance.find(filter)
        .populate('staff', 'firstName lastName employeeId')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: -1 });

      return responseHelper.paginated(res, records, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching staff attendance', error);
      next(error);
    }
  }

  /**
   * Add holiday to calendar
   */
  static async addHoliday(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { name, date, type, description } = req.body;

      if (!name || !date) throw new ValidationError('Name and date are required');

      const holiday = new HolidayCalendar({
        schoolId,
        name,
        date: new Date(date),
        type,
        description,
        addedBy: req.user.userId
      });

      await holiday.save();

      return responseHelper.created(res, holiday, 'Holiday added successfully');
    } catch (error) {
      logger.error('Error adding holiday', error);
      next(error);
    }
  }

  /**
   * Get holidays
   */
  static async getHolidays(req, res, next) {
    try {
      const { page = 1, limit = 20, year = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        filter.date = { $gte: startDate, $lte: endDate };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await HolidayCalendar.countDocuments(filter);
      const holidays = await HolidayCalendar.find(filter)
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: 1 });

      return responseHelper.paginated(res, holidays, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching holidays', error);
      next(error);
    }
  }

  /**
   * Delete holiday
   */
  static async deleteHoliday(req, res, next) {
    try {
      const { holidayId } = req.params;
      const schoolId = req.user.schoolId;

      const holiday = await HolidayCalendar.findOneAndDelete({ _id: holidayId, schoolId });

      if (!holiday) throw new AppError('Holiday not found', 404);

      return responseHelper.noContent(res, 'Holiday deleted successfully');
    } catch (error) {
      logger.error('Error deleting holiday', error);
      next(error);
    }
  }

  /**
   * Get or create attendance rule
   */
  static async getAttendanceRule(req, res, next) {
    try {
      const schoolId = req.user.schoolId;

      let rule = await AttendanceRule.findOne({ schoolId }).lean();

      if (!rule) {
        rule = {
          schoolId,
          minAttendancePercentage: 75,
          absentThreshold: 3,
          holidayConsideredAsPresent: false,
          halfDayAsHalf: true
        };
      }

      return responseHelper.success(res, rule, 'Attendance rule retrieved');
    } catch (error) {
      logger.error('Error fetching attendance rule', error);
      next(error);
    }
  }

  /**
   * Update attendance rule
   */
  static async updateAttendanceRule(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { minAttendancePercentage, absentThreshold, holidayConsideredAsPresent, halfDayAsHalf } = req.body;

      let rule = await AttendanceRule.findOneAndUpdate(
        { schoolId },
        { minAttendancePercentage, absentThreshold, holidayConsideredAsPresent, halfDayAsHalf },
        { upsert: true, new: true }
      );

      return responseHelper.success(res, rule, 'Attendance rule updated successfully');
    } catch (error) {
      logger.error('Error updating attendance rule', error);
      next(error);
    }
  }

  /**
   * Get attendance summary
   */
  static async getAttendanceSummary(req, res, next) {
    try {
      const { classId, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('classId and academicYear are required');
      }

      const records = await StudentAttendance.countDocuments({
        schoolId,
        class: classId,
        academicYear,
        status: 'PRESENT'
      });

      const total = await StudentAttendance.countDocuments({
        schoolId,
        class: classId,
        academicYear
      });

      return responseHelper.success(res, {
        classId,
        academicYear,
        presentCount: records,
        totalCount: total,
        percentage: total > 0 ? Math.round((records / total) * 100) : 0
      }, 'Attendance summary retrieved');
    } catch (error) {
      logger.error('Error fetching attendance summary', error);
      next(error);
    }
  }
}

module.exports = AttendanceController;
