/**
 * Report Controller
 * Generate reports for attendance, performance, and finance
 */

const StudentAttendance = require('../models/attendance/StudentAttendance.model');
const Grade = require('../models/grades/Grade.model');
const StudentFee = require('../models/finance/StudentFee.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ReportController {
  /**
   * Generate attendance report
   */
  static async generateAttendanceReport(req, res, next) {
    try {
      const { class: classId, academicYear, month, year } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear || !month || !year) {
        throw new ValidationError('Class, academic year, month, and year are required');
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
            total: 0,
            attendancePercentage: 0
          };
        }
        reportData[record.student._id][record.status.toLowerCase()]++;
        reportData[record.student._id].total++;
      });

      const report = {
        reportType: 'ATTENDANCE',
        class: classId,
        academicYear,
        month,
        year,
        generatedDate: new Date(),
        totalStudents: Object.keys(reportData).length,
        data: Object.values(reportData).map(item => ({
          ...item,
          attendancePercentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0
        }))
      };

      return responseHelper.success(res, report, 'Attendance report generated successfully');
    } catch (error) {
      logger.error('Error generating attendance report', error);
      next(error);
    }
  }

  /**
   * Generate performance report
   */
  static async generatePerformanceReport(req, res, next) {
    try {
      const { class: classId, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('Class and academic year are required');
      }

      const grades = await Grade.find({ schoolId, class: classId, academicYear })
        .populate('student', 'firstName lastName rollNumber')
        .populate('subject', 'name code')
        .lean();

      const performanceByStudent = {};
      grades.forEach(grade => {
        if (!performanceByStudent[grade.student._id]) {
          performanceByStudent[grade.student._id] = {
            student: grade.student,
            subjects: [],
            totalMarks: 0,
            averageMarks: 0,
            passCount: 0,
            failCount: 0
          };
        }
        performanceByStudent[grade.student._id].subjects.push({
          subject: grade.subject,
          marks: grade.marks,
          maximumMarks: grade.maximumMarks,
          percentage: (grade.marks / grade.maximumMarks) * 100
        });
        performanceByStudent[grade.student._id].totalMarks += grade.marks;
        if (grade.marks >= 40) {
          performanceByStudent[grade.student._id].passCount++;
        } else {
          performanceByStudent[grade.student._id].failCount++;
        }
      });

      const report = {
        reportType: 'PERFORMANCE',
        class: classId,
        academicYear,
        generatedDate: new Date(),
        totalStudents: Object.keys(performanceByStudent).length,
        data: Object.values(performanceByStudent).map(item => ({
          ...item,
          averageMarks: item.subjects.length > 0 ? Math.round(item.totalMarks / item.subjects.length) : 0
        }))
      };

      return responseHelper.success(res, report, 'Performance report generated successfully');
    } catch (error) {
      logger.error('Error generating performance report', error);
      next(error);
    }
  }

  /**
   * Generate fee collection report
   */
  static async generateFeeReport(req, res, next) {
    try {
      const { class: classId, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('Class and academic year are required');
      }

      const fees = await StudentFee.find({
        schoolId,
        class: classId,
        academicYear
      })
        .populate('student', 'firstName lastName rollNumber')
        .lean();

      const report = {
        reportType: 'FEE_COLLECTION',
        class: classId,
        academicYear,
        generatedDate: new Date(),
        totalStudents: fees.length,
        totalFeeAmount: fees.reduce((sum, f) => sum + f.totalAmount, 0),
        totalCollected: fees.reduce((sum, f) => sum + f.paidAmount, 0),
        totalPending: fees.reduce((sum, f) => sum + f.dueAmount, 0),
        paidStudents: fees.filter(f => f.status === 'PAID').length,
        partialPayment: fees.filter(f => f.status === 'PARTIAL').length,
        pendingStudents: fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').length,
        collectionPercentage: 0,
        data: fees.map(f => ({
          student: f.student,
          totalAmount: f.totalAmount,
          paidAmount: f.paidAmount,
          dueAmount: f.dueAmount,
          status: f.status,
          paymentPercentage: (f.paidAmount / f.totalAmount) * 100
        }))
      };

      report.collectionPercentage = report.totalFeeAmount > 0 ? Math.round((report.totalCollected / report.totalFeeAmount) * 100) : 0;

      return responseHelper.success(res, report, 'Fee collection report generated successfully');
    } catch (error) {
      logger.error('Error generating fee report', error);
      next(error);
    }
  }

  /**
   * Generate comprehensive school report
   */
  static async generateSchoolReport(req, res, next) {
    try {
      const { academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!academicYear) {
        throw new ValidationError('Academic year is required');
      }

      const attendanceRecords = await StudentAttendance.find({ schoolId, academicYear }).lean();
      const grades = await Grade.find({ schoolId, academicYear }).lean();
      const fees = await StudentFee.find({ schoolId, academicYear }).lean();

      const report = {
        reportType: 'SCHOOL_SUMMARY',
        academicYear,
        generatedDate: new Date(),
        summary: {
          totalAttendanceRecords: attendanceRecords.length,
          averageAttendance: attendanceRecords.length > 0
            ? Math.round((attendanceRecords.filter(a => a.status === 'PRESENT').length / attendanceRecords.length) * 100)
            : 0,
          totalGrades: grades.length,
          averageMarks: grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.marks, 0) / grades.length) : 0,
          totalFeeAmount: fees.reduce((sum, f) => sum + f.totalAmount, 0),
          feesCollected: fees.reduce((sum, f) => sum + f.paidAmount, 0),
          feeCollectionPercentage: fees.length > 0 ? Math.round((fees.reduce((sum, f) => sum + f.paidAmount, 0) / fees.reduce((sum, f) => sum + f.totalAmount, 0)) * 100) : 0
        }
      };

      return responseHelper.success(res, report, 'School report generated successfully');
    } catch (error) {
      logger.error('Error generating school report', error);
      next(error);
    }
  }

  /**
   * Export report to PDF/CSV
   */
  static async exportReport(req, res, next) {
    try {
      const { reportType, format } = req.query;

      if (!reportType || !['PDF', 'CSV'].includes(format)) {
        throw new ValidationError('Invalid report type or format');
      }

      // Placeholder for export functionality
      const exportData = {
        reportType,
        format,
        exportedDate: new Date(),
        status: 'READY'
      };

      return responseHelper.success(res, exportData, 'Report exported successfully');
    } catch (error) {
      logger.error('Error exporting report', error);
      next(error);
    }
  }

  /**
   * Get report template list
   */
  static async getReportTemplates(req, res, next) {
    try {
      const templates = [
        { id: 'attendance', name: 'Attendance Report', description: 'Student attendance records' },
        { id: 'performance', name: 'Performance Report', description: 'Student grades and performance' },
        { id: 'fee', name: 'Fee Collection Report', description: 'Fee payment and collection' },
        { id: 'school', name: 'School Summary Report', description: 'Overall school statistics' }
      ];

      return responseHelper.success(res, templates, 'Report templates retrieved successfully');
    } catch (error) {
      logger.error('Error fetching report templates', error);
      next(error);
    }
  }

  /**
   * Schedule report generation
   */
  static async scheduleReportGeneration(req, res, next) {
    try {
      const { reportType, frequency, recipients } = req.body;

      if (!reportType || !frequency) {
        throw new ValidationError('Report type and frequency are required');
      }

      const schedule = {
        reportType,
        frequency,
        recipients,
        scheduledDate: new Date(),
        status: 'SCHEDULED'
      };

      return responseHelper.created(res, schedule, 'Report generation scheduled successfully');
    } catch (error) {
      logger.error('Error scheduling report', error);
      next(error);
    }
  }

  /**
   * Get custom report
   */
  static async getCustomReport(req, res, next) {
    try {
      const { filters } = req.body;
      const schoolId = req.user.schoolId;

      // Build query based on filters
      const query = { schoolId };
      if (filters.class) query.class = filters.class;
      if (filters.academicYear) query.academicYear = filters.academicYear;
      if (filters.status) query.status = filters.status;

      // Placeholder for custom report logic
      const report = {
        reportType: 'CUSTOM',
        generatedDate: new Date(),
        filters,
        data: []
      };

      return responseHelper.success(res, report, 'Custom report generated successfully');
    } catch (error) {
      logger.error('Error generating custom report', error);
      next(error);
    }
  }
}

module.exports = ReportController;
