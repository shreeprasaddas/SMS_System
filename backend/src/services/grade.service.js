/**
 * Grade Service
 * Business logic for grade management
 */

const Grade = require('../models/academics/Grade.model');
const StudentAssessment = require('../models/academics/StudentAssessment.model');
const GradeStructure = require('../models/academics/GradeStructure.model');
const { AppError } = require('../utils/errorHelper');
const responseHelper = require('../utils/responseHelper');

class GradeService {
  /**
   * Create grade record
   */
  static async createGrade(schoolId, gradeData, userId) {
    const gradeRecord = new Grade({
      ...gradeData,
      schoolId,
      finalizedBy: userId,
      finalizedDate: new Date(),
    });

    await gradeRecord.save();
    return gradeRecord;
  }

  /**
   * Get grades with filters and pagination
   */
  static async getGrades(schoolId, filters = {}) {
    const { page = 1, limit = 10, student, subject, academicYear, status, term } = filters;

    const query = { schoolId };
    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;
    if (term) query.term = term;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Grade.find(query)
        .populate('student', 'firstName lastName enrollmentNumber')
        .populate('subject', 'name code')
        .populate('gradeStructure', 'name gradeScale')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Grade.countDocuments(query),
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
   * Get grade by ID
   */
  static async getGradeById(schoolId, gradeId) {
    const grade = await Grade.findOne({ _id: gradeId, schoolId }).populate([
      { path: 'student', select: 'firstName lastName enrollmentNumber email' },
      { path: 'subject', select: 'name code' },
      { path: 'class', select: 'name section' },
      { path: 'academicYear', select: 'name startDate endDate' },
      { path: 'gradeStructure', select: 'name gradeScale' },
    ]);

    if (!grade) throw new AppError('Grade not found', 404);
    return grade;
  }

  /**
   * Calculate grade from marks and structure
   */
  static async calculateGrade(marksPercentage, gradeStructureId) {
    const structure = await GradeStructure.findById(gradeStructureId);
    if (!structure) throw new AppError('Grade structure not found', 404);

    const gradeData = structure.gradeScale.find(
      (gs) => marksPercentage >= gs.minMarks && marksPercentage <= gs.maxMarks
    );

    if (!gradeData) throw new AppError('Grade calculation failed for given marks', 400);

    return {
      grade: gradeData.grade,
      gradePoints: gradeData.gradePoints,
    };
  }

  /**
   * Calculate continuous assessment and exam marks
   */
  static async calculateCompositeMarks(
    schoolId,
    studentId,
    subjectId,
    academicYear,
    term
  ) {
    const assessments = await StudentAssessment.find({
      schoolId,
      student: studentId,
      subject: subjectId,
      academicYear,
    });

    if (assessments.length === 0) {
      throw new AppError('No assessments found for student', 404);
    }

    let continuousMarks = 0;
    let examMarks = 0;
    let continuousCount = 0;
    let examCount = 0;

    assessments.forEach((assessment) => {
      if (assessment.status === 'EVALUATED') {
        const percentage = (assessment.marksObtained / assessment.totalMarks) * 100;

        if (['QUIZ', 'ASSIGNMENT', 'TEST', 'PROJECT'].includes(assessment.assessment.type)) {
          continuousMarks += percentage;
          continuousCount++;
        } else if (['EXAM', 'FINAL', 'MIDTERM'].includes(assessment.assessment.type)) {
          examMarks += percentage;
          examCount++;
        }
      }
    });

    const avgContinuous = continuousCount > 0 ? continuousMarks / continuousCount : 0;
    const avgExam = examCount > 0 ? examMarks / examCount : 0;

    return {
      continuousAssessmentMarks: Math.round(avgContinuous),
      examMarks: Math.round(avgExam),
      totalMarks: 100,
    };
  }

  /**
   * Finalize grades
   */
  static async finalizeGrades(schoolId, classId, academicYear, term, userId) {
    const grades = await Grade.find({
      schoolId,
      class: classId,
      academicYear,
      term,
      status: 'PENDING',
    });

    if (grades.length === 0) throw new AppError('No pending grades found', 404);

    const updateResult = await Grade.updateMany(
      {
        schoolId,
        class: classId,
        academicYear,
        term,
        status: 'PENDING',
      },
      {
        status: 'FINALIZED',
        finalizedBy: userId,
        finalizedDate: new Date(),
      }
    );

    return {
      message: `${updateResult.modifiedCount} grades finalized`,
      count: updateResult.modifiedCount,
    };
  }

  /**
   * Publish grades to students
   */
  static async publishGrades(schoolId, classId, academicYear, term, userId) {
    const grades = await Grade.updateMany(
      {
        schoolId,
        class: classId,
        academicYear,
        term,
        status: 'FINALIZED',
      },
      {
        status: 'PUBLISHED',
        gradesPublishedDate: new Date(),
      }
    );

    return {
      message: `${grades.modifiedCount} grades published`,
      count: grades.modifiedCount,
    };
  }

  /**
   * Contest grade
   */
  static async contestGrade(schoolId, gradeId, reason) {
    const grade = await Grade.findOne({ _id: gradeId, schoolId });
    if (!grade) throw new AppError('Grade not found', 404);
    if (grade.status !== 'PUBLISHED') throw new AppError('Only published grades can be contested', 400);

    grade.status = 'CONTESTED';
    grade.contestDetails = {
      contestedDate: new Date(),
      reason,
    };

    await grade.save();
    return grade;
  }

  /**
   * Resolve grade contest
   */
  static async resolveGradeContest(schoolId, gradeId, remark, newGrade, userId) {
    const grade = await Grade.findOne({ _id: gradeId, schoolId });
    if (!grade) throw new AppError('Grade not found', 404);

    grade.contestDetails.resolvedDate = new Date();
    grade.contestDetails.remark = remark;
    grade.contestDetails.resolvedBy = userId;

    if (newGrade) {
      grade.grade = newGrade.grade;
      grade.gradePoint = newGrade.gradePoint;
    }

    grade.status = 'PUBLISHED';
    await grade.save();

    return grade;
  }

  /**
   * Get class-wise grade statistics
   */
  static async getClassGradeStats(schoolId, classId, academicYear, term) {
    const grades = await Grade.find({ schoolId, class: classId, academicYear, term });

    if (grades.length === 0) throw new AppError('No grades found', 404);

    const stats = {
      totalStudents: grades.length,
      passedStudents: grades.filter((g) => g.isPassed).length,
      failedStudents: grades.filter((g) => !g.isPassed).length,
      averagePercentage:
        grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length,
      highestPercentage: Math.max(...grades.map((g) => g.percentage || 0)),
      lowestPercentage: Math.min(...grades.map((g) => g.percentage || 0)),
      gradeDistribution: {
        'A+': grades.filter((g) => g.grade === 'A+').length,
        A: grades.filter((g) => g.grade === 'A').length,
        'B+': grades.filter((g) => g.grade === 'B+').length,
        B: grades.filter((g) => g.grade === 'B').length,
        'C+': grades.filter((g) => g.grade === 'C+').length,
        C: grades.filter((g) => g.grade === 'C').length,
        D: grades.filter((g) => g.grade === 'D').length,
        F: grades.filter((g) => g.grade === 'F').length,
      },
    };

    return stats;
  }

  /**
   * Get subject-wise performance
   */
  static async getSubjectPerformance(schoolId, classId, academicYear, term) {
    const grades = await Grade.aggregate([
      { $match: { schoolId: new require('mongoose').Types.ObjectId(schoolId), class: new require('mongoose').Types.ObjectId(classId), academicYear: new require('mongoose').Types.ObjectId(academicYear), term } },
      {
        $group: {
          _id: '$subject',
          averagePercentage: { $avg: '$percentage' },
          totalStudents: { $sum: 1 },
          passedStudents: { $sum: { $cond: ['$isPassed', 1, 0] } },
          failedStudents: { $sum: { $cond: ['$isPassed', 0, 1] } },
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subjectDetails',
        },
      },
      { $unwind: '$subjectDetails' },
      {
        $project: {
          subject: '$subjectDetails.name',
          averagePercentage: 1,
          totalStudents: 1,
          passedStudents: 1,
          failedStudents: 1,
        },
      },
    ]);

    return grades;
  }
}

module.exports = GradeService;
