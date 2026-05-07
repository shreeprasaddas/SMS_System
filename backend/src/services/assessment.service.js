/**
 * Assessment Service
 * Business logic for assessment and test management
 */

const Assessment = require('../models/academics/Assessment.model');
const StudentAssessment = require('../models/academics/StudentAssessment.model');
const { AppError } = require('../utils/errorHelper');

class AssessmentService {
  /**
   * Create assessment
   */
  static async createAssessment(schoolId, assessmentData, userId) {
    const assessment = new Assessment({
      ...assessmentData,
      schoolId,
      createdBy: userId,
    });

    await assessment.save();
    return assessment.populate(['class', 'subject', 'academicYear']);
  }

  /**
   * Get assessments with filters
   */
  static async getAssessments(schoolId, filters = {}) {
    const { page = 1, limit = 10, class: classId, subject, academicYear, type, status } = filters;

    const query = { schoolId };
    if (classId) query.class = classId;
    if (subject) query.subject = subject;
    if (academicYear) query.academicYear = academicYear;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Assessment.find(query)
        .populate('class', 'name section')
        .populate('subject', 'name code')
        .populate('academicYear', 'name')
        .populate('createdBy', 'firstName lastName')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ assessmentDate: -1 }),
      Assessment.countDocuments(query),
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
   * Get assessment by ID
   */
  static async getAssessmentById(schoolId, assessmentId) {
    const assessment = await Assessment.findOne({ _id: assessmentId, schoolId }).populate([
      { path: 'class', select: 'name section' },
      { path: 'subject', select: 'name code' },
      { path: 'academicYear', select: 'name startDate endDate' },
      { path: 'createdBy', select: 'firstName lastName email' },
    ]);

    if (!assessment) throw new AppError('Assessment not found', 404);
    return assessment;
  }

  /**
   * Update assessment
   */
  static async updateAssessment(schoolId, assessmentId, updateData) {
    const assessment = await Assessment.findOneAndUpdate(
      { _id: assessmentId, schoolId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!assessment) throw new AppError('Assessment not found', 404);
    return assessment.populate(['class', 'subject', 'academicYear']);
  }

  /**
   * Delete assessment
   */
  static async deleteAssessment(schoolId, assessmentId) {
    const assessment = await Assessment.findOneAndDelete({ _id: assessmentId, schoolId });
    if (!assessment) throw new AppError('Assessment not found', 404);

    // Delete all student assessments for this assessment
    await StudentAssessment.deleteMany({ assessment: assessmentId });

    return { message: 'Assessment deleted successfully' };
  }

  /**
   * Publish assessment
   */
  static async publishAssessment(schoolId, assessmentId) {
    const assessment = await Assessment.findOneAndUpdate(
      { _id: assessmentId, schoolId, status: 'DRAFT' },
      { status: 'PUBLISHED', publishedDate: new Date() },
      { new: true }
    );

    if (!assessment) throw new AppError('Assessment not found or already published', 404);
    return assessment;
  }

  /**
   * Close assessment (no more submissions)
   */
  static async closeAssessment(schoolId, assessmentId) {
    const assessment = await Assessment.findOneAndUpdate(
      { _id: assessmentId, schoolId },
      { status: 'CLOSED', closedDate: new Date() },
      { new: true }
    );

    if (!assessment) throw new AppError('Assessment not found', 404);
    return assessment;
  }

  /**
   * Record student assessment submission
   */
  static async submitAssessment(schoolId, studentId, assessmentId, submissionData) {
    const assessment = await Assessment.findOne({ _id: assessmentId, schoolId });
    if (!assessment) throw new AppError('Assessment not found', 404);

    const studentAssessment = await StudentAssessment.findOneAndUpdate(
      {
        schoolId,
        student: studentId,
        assessment: assessmentId,
      },
      {
        ...submissionData,
        status: 'SUBMITTED',
        submissionDate: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    return studentAssessment;
  }

  /**
   * Mark student assessment
   */
  static async markAssessment(schoolId, studentAssessmentId, marks, feedback, userId) {
    const studentAssessment = await StudentAssessment.findOneAndUpdate(
      { _id: studentAssessmentId, schoolId },
      {
        marksObtained: marks,
        feedback,
        status: 'EVALUATED',
        evaluatedBy: userId,
        evaluatedDate: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!studentAssessment) throw new AppError('Student assessment not found', 404);

    // Calculate percentage and isPassed
    const percentage = (marks / studentAssessment.totalMarks) * 100;
    studentAssessment.percentage = Math.round(percentage);
    studentAssessment.isPassed = percentage >= (studentAssessment.passingMarks || 40);

    await studentAssessment.save();
    return studentAssessment;
  }

  /**
   * Get student assessment results
   */
  static async getStudentAssessmentResults(schoolId, studentId, filters = {}) {
    const { page = 1, limit = 10, subject, academicYear, status } = filters;

    const query = { schoolId, student: studentId };
    if (subject) query.subject = subject;
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      StudentAssessment.find(query)
        .populate('assessment', 'name type assessmentDate totalMarks')
        .populate('subject', 'name code')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ assessmentDate: -1 }),
      StudentAssessment.countDocuments(query),
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
   * Get assessment results for class
   */
  static async getAssessmentResults(schoolId, assessmentId, filters = {}) {
    const { page = 1, limit = 10 } = filters;

    const assessment = await Assessment.findOne({ _id: assessmentId, schoolId });
    if (!assessment) throw new AppError('Assessment not found', 404);

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      StudentAssessment.find({ assessment: assessmentId, schoolId })
        .populate('student', 'firstName lastName enrollmentNumber email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ marksObtained: -1 }),
      StudentAssessment.countDocuments({ assessment: assessmentId, schoolId }),
    ]);

    const stats = {
      totalAttempts: total,
      evaluated: data.filter((d) => d.status === 'EVALUATED').length,
      averageMarks: data.reduce((sum, d) => sum + (d.marksObtained || 0), 0) / total,
      highestMarks: Math.max(...data.map((d) => d.marksObtained || 0)),
      lowestMarks: Math.min(...data.map((d) => d.marksObtained || 0)),
      passedCount: data.filter((d) => d.isPassed).length,
      failedCount: data.filter((d) => !d.isPassed).length,
    };

    return {
      assessment: {
        name: assessment.name,
        type: assessment.type,
        totalMarks: assessment.totalMarks,
      },
      results: data,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get assessment analytics
   */
  static async getAssessmentAnalytics(schoolId, assessmentId) {
    const results = await StudentAssessment.aggregate([
      { $match: { schoolId: new require('mongoose').Types.ObjectId(schoolId), assessment: new require('mongoose').Types.ObjectId(assessmentId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          evaluatedCount: { $sum: { $cond: [{ $eq: ['$status', 'EVALUATED'] }, 1, 0] } },
          averageMarks: { $avg: '$marksObtained' },
          maxMarks: { $max: '$marksObtained' },
          minMarks: { $min: '$marksObtained' },
          passedCount: { $sum: { $cond: ['$isPassed', 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } },
        },
      },
    ]);

    return results[0] || {};
  }
}

module.exports = AssessmentService;
