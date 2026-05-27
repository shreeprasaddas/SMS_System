/**
 * ReportCard Service
 * Business logic for report card generation and publishing
 */

const ReportCard = require('../models/academics/ReportCard.model');
const Grade = require('../models/academics/Grade.model');
const StudentAttendance = require('../models/attendance/StudentAttendance.model');
const Class = require('../models/academic/Class.model');
const User = require('../models/user/User.model');
const { AppError } = require('../utils/errorHelper');

class ReportCardService {
  /**
   * Generate report card for student
   */
  static async generateReportCard(schoolId, studentId, academicYearId, term, userId) {
    // Get all grades for student in this term
    const grades = await Grade.find({
      schoolId,
      student: studentId,
      academicYear: academicYearId,
      term,
      status: { $in: ['FINALIZED', 'PUBLISHED'] },
    }).populate('subject', 'name code');

    if (grades.length === 0) {
      throw new AppError('No grades found for report card generation', 404);
    }

    // Calculate overall metrics
    const subjectGrades = grades.map((g) => ({
      subject: g.subject._id,
      marksObtained: g.examMarks,
      totalMarks: g.totalMarks,
      percentage: g.percentage,
      grade: g.grade,
      gradePoint: g.gradePoint,
      status: g.status,
    }));

    const totalMarks = grades.reduce((sum, g) => sum + g.totalMarks, 0);
    const totalObtainedMarks = grades.reduce((sum, g) => sum + (g.examMarks || 0), 0);
    const overallPercentage = Math.round((totalObtainedMarks / totalMarks) * 100);

    // Get student info
    const student = await User.findById(studentId);
    const studentClass = student.class;

    // Calculate class rank
    const classRankResult = await ReportCard.findOne({
      schoolId,
      class: studentClass,
      academicYear: academicYearId,
      term,
      overallPercentage: { $gt: overallPercentage },
    }).countDocuments();

    const classRank = classRankResult + 1;

    // Get total students in class
    const totalStudentsInClass = await User.countDocuments({
      schoolId,
      class: studentClass,
    });

    // Get attendance
    const attendanceData = await StudentAttendance.aggregate([
      {
        $match: {
          schoolId: new require('mongoose').Types.ObjectId(schoolId),
          student: new require('mongoose').Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: null,
          presentDays: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
          totalDays: { $sum: 1 },
        },
      },
    ]);

    const attendance =
      attendanceData.length > 0
        ? {
            presentDays: attendanceData[0].presentDays,
            totalDays: attendanceData[0].totalDays,
            attendancePercentage: Math.round(
              (attendanceData[0].presentDays / attendanceData[0].totalDays) * 100
            ),
          }
        : { presentDays: 0, totalDays: 0, attendancePercentage: 0 };

    // Determine promotion status
    const passedSubjects = grades.filter((g) => g.isPassed).length;
    const promotionStatus =
      passedSubjects === grades.length ? 'PROMOTED' : 'DETAINED';

    // Create report card
    const reportCard = new ReportCard({
      schoolId,
      student: studentId,
      class: studentClass,
      academicYear: academicYearId,
      term,
      totalSubjects: grades.length,
      subjectGrades,
      totalMarks,
      totalObtainedMarks,
      overallPercentage,
      classRank,
      totalStudentsInClass,
      attendance,
      promotionStatus,
      generatedBy: userId,
    });

    await reportCard.save();
    return reportCard.populate([
      { path: 'student', select: 'firstName lastName enrollmentNumber' },
      { path: 'class', select: 'name section' },
      { path: 'academicYear', select: 'name' },
    ]);
  }

  /**
   * Get report card by ID
   */
  static async getReportCardById(schoolId, reportCardId) {
    const reportCard = await ReportCard.findOne({ _id: reportCardId, schoolId }).populate([
      { path: 'student', select: 'firstName lastName enrollmentNumber email' },
      { path: 'class', select: 'name section' },
      { path: 'academicYear', select: 'name startDate endDate' },
    ]);

    if (!reportCard) throw new AppError('Report card not found', 404);
    return reportCard;
  }

  /**
   * Get student report cards
   */
  static async getStudentReportCards(schoolId, studentId, filters = {}) {
    const { page = 1, limit = 10, academicYear, term } = filters;

    const query = { schoolId, student: studentId };
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      ReportCard.find(query)
        .populate('academicYear', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      ReportCard.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get class report cards
   */
  static async getClassReportCards(schoolId, classId, academicYear, term, filters = {}) {
    const { page = 1, limit = 20 } = filters;

    const query = { schoolId, class: classId, academicYear, term };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ReportCard.find(query)
        .populate('student', 'firstName lastName enrollmentNumber')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ overallPercentage: -1 }),
      ReportCard.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Finalize report card
   */
  static async finalizeReportCard(schoolId, reportCardId, userId) {
    const reportCard = await ReportCard.findOneAndUpdate(
      { _id: reportCardId, schoolId, status: 'DRAFT' },
      { status: 'FINALIZED', publishedBy: userId },
      { new: true }
    );

    if (!reportCard) throw new AppError('Report card not found or already finalized', 404);
    return reportCard;
  }

  /**
   * Publish report card
   */
  static async publishReportCard(schoolId, reportCardId, userId) {
    const reportCard = await ReportCard.findOneAndUpdate(
      { _id: reportCardId, schoolId, status: 'FINALIZED' },
      {
        status: 'PUBLISHED',
        publishedDate: new Date(),
        publishedBy: userId,
      },
      { new: true }
    );

    if (!reportCard) throw new AppError('Report card not found or not finalized', 404);
    return reportCard;
  }

  /**
   * Publish report cards in bulk
   */
  static async publishClassReportCards(schoolId, classId, academicYear, term, userId) {
    const result = await ReportCard.updateMany(
      {
        schoolId,
        class: classId,
        academicYear,
        term,
        status: 'FINALIZED',
      },
      {
        status: 'PUBLISHED',
        publishedDate: new Date(),
        publishedBy: userId,
      }
    );

    return {
      message: `${result.modifiedCount} report cards published`,
      count: result.modifiedCount,
    };
  }

  /**
   * Add principal remarks
   */
  static async addPrincipalRemarks(schoolId, reportCardId, remarks) {
    const reportCard = await ReportCard.findOneAndUpdate(
      { _id: reportCardId, schoolId },
      { principalRemarks: remarks },
      { new: true }
    );

    if (!reportCard) throw new AppError('Report card not found', 404);
    return reportCard;
  }

  /**
   * Add class teacher remarks
   */
  static async addClassTeacherRemarks(schoolId, reportCardId, remarks) {
    const reportCard = await ReportCard.findOneAndUpdate(
      { _id: reportCardId, schoolId },
      { classTeacherRemarks: remarks },
      { new: true }
    );

    if (!reportCard) throw new AppError('Report card not found', 404);
    return reportCard;
  }

  /**
   * Get report card statistics for class
   */
  static async getClassReportCardStats(schoolId, classId, academicYear, term) {
    const reportCards = await ReportCard.find({
      schoolId,
      class: classId,
      academicYear,
      term,
    });

    if (reportCards.length === 0) throw new AppError('No report cards found', 404);

    const stats = {
      totalStudents: reportCards.length,
      promotedStudents: reportCards.filter((rc) => rc.promotionStatus === 'PROMOTED').length,
      detainedStudents: reportCards.filter((rc) => rc.promotionStatus === 'DETAINED').length,
      averagePercentage:
        reportCards.reduce((sum, rc) => sum + rc.overallPercentage, 0) / reportCards.length,
      highestPercentage: Math.max(...reportCards.map((rc) => rc.overallPercentage)),
      lowestPercentage: Math.min(...reportCards.map((rc) => rc.overallPercentage)),
      averageAttendance:
        reportCards.reduce((sum, rc) => sum + (rc.attendance?.attendancePercentage || 0), 0) /
        reportCards.length,
    };

    return stats;
  }
}

module.exports = ReportCardService;
