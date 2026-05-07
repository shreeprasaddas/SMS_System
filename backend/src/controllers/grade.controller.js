/**
 * Grade Controller
 * Grading, marking, and performance tracking
 */

const Grade = require('../models/grades/Grade.model');
const StudentAssessment = require('../models/academics/StudentAssessment.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class GradeController {
  /**
   * Create or update grade
   */
  static async createGrade(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { student, subject, academicYear, class: classId, marks, maximumMarks, gradePoint } = req.body;

      if (!student || !subject || !academicYear || !classId || marks === undefined) {
        throw new ValidationError('Missing required fields');
      }

      let grade = await Grade.findOne({
        schoolId,
        student,
        subject,
        academicYear,
        class: classId
      });

      if (grade) {
        grade.marks = marks;
        grade.maximumMarks = maximumMarks;
        grade.gradePoint = gradePoint;
        grade.updatedBy = req.user.userId;
      } else {
        grade = new Grade({
          schoolId,
          student,
          subject,
          academicYear,
          class: classId,
          marks,
          maximumMarks,
          gradePoint,
          createdBy: req.user.userId
        });
      }

      await grade.save();
      await grade.populate('student', 'firstName lastName rollNumber');
      await grade.populate('subject', 'name code');

      return responseHelper.created(res, grade, 'Grade created/updated successfully');
    } catch (error) {
      logger.error('Error creating grade', error);
      next(error);
    }
  }

  /**
   * Bulk mark grades
   */
  static async markGradesBulk(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { subject, academicYear, class: classId, term, grades } = req.body;

      if (!subject || !academicYear || !classId || !Array.isArray(grades)) {
        throw new ValidationError('Missing or invalid required fields');
      }

      const gradeData = grades.map(g => ({
        schoolId,
        student: g.student,
        subject,
        academicYear,
        class: classId,
        term,
        marks: g.marks,
        maximumMarks: g.maximumMarks,
        gradePoint: g.gradePoint,
        createdBy: req.user.userId
      }));

      const result = await Grade.insertMany(gradeData, { ordered: false });

      return responseHelper.success(res, { count: result.length }, 'Grades marked successfully');
    } catch (error) {
      logger.error('Error marking grades in bulk', error);
      next(error);
    }
  }

  /**
   * Get grades
   */
  static async getGrades(req, res, next) {
    try {
      const { page = 1, limit = 12, student = '', subject = '', class: classId = '', academicYear = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (student) filter.student = student;
      if (subject) filter.subject = subject;
      if (classId) filter.class = classId;
      if (academicYear) filter.academicYear = academicYear;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Grade.countDocuments(filter);
      const gradesList = await Grade.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .populate('subject', 'name code')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, gradesList, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching grades', error);
      next(error);
    }
  }

  /**
   * Get grades by student
   */
  static async getStudentGrades(req, res, next) {
    try {
      const { studentId } = req.params;
      const { academicYear } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId, student: studentId };
      if (academicYear) filter.academicYear = academicYear;

      const grades = await Grade.find(filter)
        .populate('subject', 'name code maxMarks')
        .lean()
        .sort({ createdAt: -1 });

      if (!grades.length) throw new AppError('No grades found for student', 404);

      const summary = {
        studentId,
        totalSubjects: grades.length,
        averageMarks: Math.round(grades.reduce((sum, g) => sum + (g.marks || 0), 0) / grades.length),
        grades
      };

      return responseHelper.success(res, summary, 'Student grades retrieved successfully');
    } catch (error) {
      logger.error('Error fetching student grades', error);
      next(error);
    }
  }

  /**
   * Get class performance report
   */
  static async getClassPerformanceReport(req, res, next) {
    try {
      const { class: classId, subject, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('Class and academic year are required');
      }

      const filter = { schoolId, class: classId, academicYear };
      if (subject) filter.subject = subject;

      const grades = await Grade.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .lean();

      const report = {
        classId,
        academicYear,
        totalStudents: new Set(grades.map(g => g.student._id)).size,
        averageClassMarks: grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.marks || 0), 0) / grades.length) : 0,
        toppers: grades.sort((a, b) => b.marks - a.marks).slice(0, 5),
        passingPercentage: grades.length > 0 ? Math.round((grades.filter(g => g.marks >= 40).length / grades.length) * 100) : 0,
        totalGrades: grades.length
      };

      return responseHelper.success(res, report, 'Class performance report generated');
    } catch (error) {
      logger.error('Error generating performance report', error);
      next(error);
    }
  }

  /**
   * Calculate subject-wise performance
   */
  static async getSubjectPerformance(req, res, next) {
    try {
      const { class: classId, academicYear } = req.query;
      const schoolId = req.user.schoolId;

      if (!classId || !academicYear) {
        throw new ValidationError('Class and academic year are required');
      }

      const grades = await Grade.find({ schoolId, class: classId, academicYear })
        .populate('subject', 'name code')
        .lean();

      const performanceBySubject = {};
      grades.forEach(g => {
        if (!performanceBySubject[g.subject._id]) {
          performanceBySubject[g.subject._id] = {
            subject: g.subject,
            totalMarks: 0,
            count: 0,
            highestMarks: 0,
            lowestMarks: 100
          };
        }
        performanceBySubject[g.subject._id].totalMarks += g.marks || 0;
        performanceBySubject[g.subject._id].count++;
        performanceBySubject[g.subject._id].highestMarks = Math.max(performanceBySubject[g.subject._id].highestMarks, g.marks || 0);
        performanceBySubject[g.subject._id].lowestMarks = Math.min(performanceBySubject[g.subject._id].lowestMarks, g.marks || 0);
      });

      const report = Object.values(performanceBySubject).map(item => ({
        ...item,
        averageMarks: item.count > 0 ? Math.round(item.totalMarks / item.count) : 0
      }));

      return responseHelper.success(res, report, 'Subject performance report generated');
    } catch (error) {
      logger.error('Error fetching subject performance', error);
      next(error);
    }
  }

  /**
   * Update grade
   */
  static async updateGrade(req, res, next) {
    try {
      const { gradeId } = req.params;
      const schoolId = req.user.schoolId;
      const { marks, gradePoint } = req.body;

      const grade = await Grade.findOneAndUpdate(
        { _id: gradeId, schoolId },
        { marks, gradePoint, updatedBy: req.user.userId },
        { new: true }
      );

      if (!grade) throw new AppError('Grade not found', 404);

      return responseHelper.success(res, grade, 'Grade updated successfully');
    } catch (error) {
      logger.error('Error updating grade', error);
      next(error);
    }
  }

  /**
   * Delete grade
   */
  static async deleteGrade(req, res, next) {
    try {
      const { gradeId } = req.params;
      const schoolId = req.user.schoolId;

      const grade = await Grade.findOneAndDelete({ _id: gradeId, schoolId });

      if (!grade) throw new AppError('Grade not found', 404);

      return responseHelper.noContent(res, 'Grade deleted successfully');
    } catch (error) {
      logger.error('Error deleting grade', error);
      next(error);
    }
  }

  /**
   * Record assessment
   */
  static async recordAssessment(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { student, subject, academicYear, assessmentType, score, remarks } = req.body;

      if (!student || !subject || !academicYear || !assessmentType || score === undefined) {
        throw new ValidationError('Missing required fields');
      }

      const assessment = new StudentAssessment({
        schoolId,
        student,
        subject,
        academicYear,
        assessmentType,
        score,
        remarks,
        recordedBy: req.user.userId
      });

      await assessment.save();

      return responseHelper.created(res, assessment, 'Assessment recorded successfully');
    } catch (error) {
      logger.error('Error recording assessment', error);
      next(error);
    }
  }

  /**
   * Get student assessment history
   */
  static async getAssessmentHistory(req, res, next) {
    try {
      const { studentId } = req.params;
      const { academicYear, subject } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId, student: studentId };
      if (academicYear) filter.academicYear = academicYear;
      if (subject) filter.subject = subject;

      const assessments = await StudentAssessment.find(filter)
        .populate('subject', 'name code')
        .lean()
        .sort({ createdAt: -1 });

      return responseHelper.success(res, assessments, 'Assessment history retrieved successfully');
    } catch (error) {
      logger.error('Error fetching assessment history', error);
      next(error);
    }
  }

  /**
   * Finalize term grades
   */
  static async finalizeTermGrades(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { class: classId, academicYear, term } = req.body;

      if (!classId || !academicYear || !term) {
        throw new ValidationError('Class, academic year, and term are required');
      }

      const grades = await Grade.updateMany(
        { schoolId, class: classId, academicYear, term },
        { isFinalized: true, finalizedBy: req.user.userId, finalizedDate: new Date() }
      );

      return responseHelper.success(res, grades, `${grades.modifiedCount} grades finalized successfully`);
    } catch (error) {
      logger.error('Error finalizing grades', error);
      next(error);
    }
  }
}

module.exports = GradeController;

  /**
   * Contest grade
   * POST /api/v1/grades/:gradeId/contest
   */
  static async contestGrade(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { gradeId } = req.params;
      const { reason } = req.body;

      const grade = await GradeService.contestGrade(schoolId, gradeId, reason);

      responseHelper.success(res, grade, 'Grade contested successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resolve grade contest
   * PATCH /api/v1/grades/:gradeId/resolve
   */
  static async resolveGradeContest(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { gradeId } = req.params;
      const { remark, newGrade } = req.body;

      const grade = await GradeService.resolveGradeContest(
        schoolId,
        gradeId,
        remark,
        newGrade,
        userId
      );

      responseHelper.success(res, grade, 'Grade contest resolved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get class grade statistics
   * GET /api/v1/grades/class-stats
   */
  static async getClassGradeStats(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { class: classId, academicYear, term } = req.query;

      if (!classId || !academicYear || !term) {
        throw new AppError('Class, academic year, and term are required', 400);
      }

      const stats = await GradeService.getClassGradeStats(
        schoolId,
        classId,
        academicYear,
        term
      );

      responseHelper.success(res, stats, 'Class grade statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subject-wise performance
   * GET /api/v1/grades/subject-performance
   */
  static async getSubjectPerformance(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { class: classId, academicYear, term } = req.query;

      if (!classId || !academicYear || !term) {
        throw new AppError('Class, academic year, and term are required', 400);
      }

      const performance = await GradeService.getSubjectPerformance(
        schoolId,
        classId,
        academicYear,
        term
      );

      responseHelper.success(res, performance, 'Subject performance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GradeController;
