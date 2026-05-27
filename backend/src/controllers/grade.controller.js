/**
 * Grade Controller
 * Grading, marking, and performance tracking
 */

const Grade = require('../models/academics/Grade.model');
const StudentAssessment = require('../models/academics/StudentAssessment.model');
const GradeService = require('../services/grade.service');
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
      const grade = await GradeService.createGrade(schoolId, req.body, req.user.userId);
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
        continuousAssessmentMarks: g.continuousAssessmentMarks,
        examMarks: g.examMarks,
        totalMarks: g.totalMarks,
        grade: g.grade,
        gradePoint: g.gradePoint,
        gradeStructure: g.gradeStructure,
        status: 'PENDING',
        finalizedBy: req.user.userId
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
      const schoolId = req.user.schoolId;
      const result = await GradeService.getGrades(schoolId, req.query);
      return responseHelper.paginated(res, result.data, result.pagination);
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

      const result = await GradeService.getGrades(schoolId, { student: studentId, academicYear });
      return responseHelper.success(res, result.data, 'Student grades retrieved successfully');
    } catch (error) {
      logger.error('Error fetching student grades', error);
      next(error);
    }
  }

  /**
   * Get grade by ID
   */
  static async getGradeById(req, res, next) {
    try {
      const { gradeId } = req.params;
      const schoolId = req.user.schoolId;
      const grade = await GradeService.getGradeById(schoolId, gradeId);
      return responseHelper.success(res, grade, 'Grade retrieved successfully');
    } catch (error) {
      logger.error('Error fetching grade by ID', error);
      next(error);
    }
  }

  /**
   * Finalize grades
   */
  static async finalizeGrades(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { class: classId, academicYear, term } = req.body;
      const result = await GradeService.finalizeGrades(schoolId, classId, academicYear, term, req.user.userId);
      return responseHelper.success(res, result, result.message);
    } catch (error) {
      logger.error('Error finalizing grades', error);
      next(error);
    }
  }

  /**
   * Publish grades
   */
  static async publishGrades(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { class: classId, academicYear, term } = req.body;
      const result = await GradeService.publishGrades(schoolId, classId, academicYear, term, req.user.userId);
      return responseHelper.success(res, result, result.message);
    } catch (error) {
      logger.error('Error publishing grades', error);
      next(error);
    }
  }

  /**
   * Contest grade
   */
  static async contestGrade(req, res, next) {
    try {
      const { gradeId } = req.params;
      const { reason } = req.body;
      const schoolId = req.user.schoolId;
      const grade = await GradeService.contestGrade(schoolId, gradeId, reason);
      return responseHelper.success(res, grade, 'Grade contested successfully');
    } catch (error) {
      logger.error('Error contesting grade', error);
      next(error);
    }
  }

  /**
   * Resolve grade contest
   */
  static async resolveGradeContest(req, res, next) {
    try {
      const { gradeId } = req.params;
      const { remark, newGrade } = req.body;
      const schoolId = req.user.schoolId;
      const grade = await GradeService.resolveGradeContest(schoolId, gradeId, remark, newGrade, req.user.userId);
      return responseHelper.success(res, grade, 'Grade contest resolved successfully');
    } catch (error) {
      logger.error('Error resolving grade contest', error);
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
        .populate('student', 'firstName lastName enrollmentNumber')
        .lean();

      const report = {
        classId,
        academicYear,
        totalStudents: new Set(grades.map(g => g.student?._id)).size,
        averageClassMarks: grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length) : 0,
        toppers: grades.sort((a, b) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 5),
        passingPercentage: grades.length > 0 ? Math.round((grades.filter(g => g.isPassed).length / grades.length) * 100) : 0,
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
      const schoolId = req.user.schoolId;
      const { class: classId, academicYear, term } = req.query;

      if (!classId || !academicYear || !term) {
        throw new ValidationError('Class, academic year, and term are required');
      }

      const report = await GradeService.getSubjectPerformance(schoolId, classId, academicYear, term);
      return responseHelper.success(res, report, 'Subject performance report generated');
    } catch (error) {
      logger.error('Error fetching subject performance', error);
      next(error);
    }
  }

  /**
   * Get class statistics
   */
  static async getClassGradeStats(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { class: classId, academicYear, term } = req.query;

      if (!classId || !academicYear || !term) {
        throw new ValidationError('Class, academic year, and term are required');
      }

      const stats = await GradeService.getClassGradeStats(schoolId, classId, academicYear, term);
      return responseHelper.success(res, stats, 'Class grade statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching class grade stats', error);
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
      const { continuousAssessmentMarks, examMarks, totalMarks, grade, gradePoint, remarks } = req.body;

      const updatedGrade = await Grade.findOneAndUpdate(
        { _id: gradeId, schoolId },
        { continuousAssessmentMarks, examMarks, totalMarks, grade, gradePoint, remarks, updatedBy: req.user.userId },
        { new: true }
      );

      if (!updatedGrade) throw new AppError('Grade not found', 404);

      return responseHelper.success(res, updatedGrade, 'Grade updated successfully');
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

      const deletedGrade = await Grade.findOneAndDelete({ _id: gradeId, schoolId });

      if (!deletedGrade) throw new AppError('Grade not found', 404);

      return responseHelper.success(res, null, 'Grade deleted successfully');
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
}

module.exports = GradeController;
