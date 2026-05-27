/**
 * Assignment Controller
 * Assignment CRUD, submission tracking, and evaluation
 */

const Assignment = require('../models/assignment/Assignment.model');
const Submission = require('../models/assignment/Submission.model');
const Evaluation = require('../models/assignment/Evaluation.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class AssignmentController {
  /**
   * Create assignment
   */
  static async createAssignment(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const mongoose = require('mongoose');
      const {
        title,
        description,
        subject,
        subjectId: subjectIdFromBody,
        class: classFromBody,
        classId: classIdFromBody,
        teacher,
        teacherId: teacherIdFromBody,
        dueDate,
        assignmentType,
        instructions,
        totalMarks,
        status,
        topic,
        learningObjectives,
      } = req.body;

      if (!title) {
        throw new ValidationError('Assignment title is required');
      }

      // --- Resolve classId ---
      const Class = require('../models/academic/Class.model');
      let finalClassId = classFromBody || classIdFromBody;
      if (!finalClassId || !mongoose.Types.ObjectId.isValid(finalClassId)) {
        const defaultClass = await Class.findOne({ schoolId });
        if (defaultClass) {
          finalClassId = defaultClass._id;
        } else {
          throw new ValidationError('No class found. Please create a class first.');
        }
      }

      // --- Resolve subjectId ---
      let finalSubjectId = subject || subjectIdFromBody;
      if (!finalSubjectId || !mongoose.Types.ObjectId.isValid(finalSubjectId)) {
        const Subject = require('../models/academic/Subject.model');
        const defaultSubject = await Subject.findOne({ schoolId });
        if (defaultSubject) {
          finalSubjectId = defaultSubject._id;
        } else {
          // Create a placeholder subject so the required field is satisfied
          const Subject = require('../models/academic/Subject.model');
          const newSubject = new Subject({
            schoolId,
            name: finalSubjectId || 'General',
            code: 'SUB-' + Math.floor(1000 + Math.random() * 9000),
            classId: finalClassId,
          });
          await newSubject.save();
          finalSubjectId = newSubject._id;
        }
      }

      // --- Resolve teacherId ---
      const finalTeacherId = teacher || teacherIdFromBody || req.user.userId;

      // --- Resolve academicYearId ---
      const AcademicYear = require('../models/academic/AcademicYear.model');
      let academicYear = await AcademicYear.findOne({ schoolId, isActive: true });
      if (!academicYear) {
        academicYear = await AcademicYear.findOne({ schoolId });
      }
      if (!academicYear) {
        throw new ValidationError('No academic year found. Please create an academic year first.');
      }

      // --- Compute dates ---
      const resolvedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const resolvedSubmissionDeadline = new Date(resolvedDueDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after due

      // --- Map status (frontend sends ACTIVE, model expects DRAFT/PUBLISHED/etc.) ---
      const validStatuses = ['DRAFT', 'PUBLISHED', 'SUBMISSION_OPEN', 'CLOSED', 'GRADING_COMPLETED', 'ARCHIVED'];
      let resolvedStatus = 'PUBLISHED';
      if (status && validStatuses.includes(status)) {
        resolvedStatus = status;
      }

      // --- Generate assignmentCode ---
      const currentYear = new Date().getFullYear();
      const count = await Assignment.countDocuments({ schoolId });
      const assignmentCode = `ASN-${currentYear}-${String(count + 1).padStart(5, '0')}`;

      const assignment = new Assignment({
        schoolId,
        assignmentCode,
        title,
        description,
        instructions,
        subjectId: finalSubjectId,
        classId: finalClassId,
        teacherId: finalTeacherId,
        academicYearId: academicYear._id,
        assignmentType: assignmentType || 'HOMEWORK',
        topic,
        learningObjectives,
        publishedDate: new Date(),
        dueDate: resolvedDueDate,
        submissionDeadline: resolvedSubmissionDeadline,
        totalMarks: parseInt(totalMarks) || 100,
        createdBy: req.user.userId,
        status: resolvedStatus,
      });

      await assignment.save();

      return responseHelper.created(res, assignment, 'Assignment created successfully');
    } catch (error) {
      // Handle duplicate assignmentCode
      if (error.code === 11000) {
        return responseHelper.error(res, 'Duplicate assignment code. Please try again.', 400);
      }
      logger.error('Error creating assignment', error);
      next(error);
    }
  }

  /**
   * Get assignments
   */
  static async getAssignments(req, res, next) {
    try {
      const { page = 1, limit = 12, subject = '', class: classId = '', teacher = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (subject) filter.subject = subject;
      if (classId) filter.class = classId;
      if (teacher) filter.teacher = teacher;
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Assignment.countDocuments(filter);
      const assignments = await Assignment.find(filter)
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dueDate: 1 });

      return responseHelper.paginated(res, assignments, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching assignments', error);
      next(error);
    }
  }

  /**
   * Get assignment by ID
   */
  static async getAssignmentById(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const schoolId = req.user.schoolId;

      const assignment = await Assignment.findOne({ _id: assignmentId, schoolId })
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName email')
        .lean();

      if (!assignment) throw new AppError('Assignment not found', 404);

      return responseHelper.success(res, assignment, 'Assignment retrieved successfully');
    } catch (error) {
      logger.error('Error fetching assignment', error);
      next(error);
    }
  }

  /**
   * Update assignment
   */
  static async updateAssignment(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const assignment = await Assignment.findOneAndUpdate(
        { _id: assignmentId, schoolId },
        updateData,
        { new: true }
      );

      if (!assignment) throw new AppError('Assignment not found', 404);

      return responseHelper.success(res, assignment, 'Assignment updated successfully');
    } catch (error) {
      logger.error('Error updating assignment', error);
      next(error);
    }
  }

  /**
   * Delete assignment
   */
  static async deleteAssignment(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const schoolId = req.user.schoolId;

      const assignment = await Assignment.findOneAndDelete({ _id: assignmentId, schoolId });

      if (!assignment) throw new AppError('Assignment not found', 404);

      return responseHelper.noContent(res, 'Assignment deleted successfully');
    } catch (error) {
      logger.error('Error deleting assignment', error);
      next(error);
    }
  }

  /**
   * Submit assignment
   */
  static async submitAssignment(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { assignmentId, student, submissionFile, remarks } = req.body;

      if (!assignmentId || !student) {
        throw new ValidationError('Missing required fields');
      }

      const assignment = await Assignment.findOne({ _id: assignmentId, schoolId });
      if (!assignment) throw new AppError('Assignment not found', 404);

      const submission = new Submission({
        schoolId,
        assignment: assignmentId,
        student,
        submissionFile,
        remarks,
        submittedDate: new Date(),
        status: new Date() > assignment.dueDate ? 'LATE' : 'ON_TIME'
      });

      await submission.save();

      return responseHelper.created(res, submission, 'Assignment submitted successfully');
    } catch (error) {
      logger.error('Error submitting assignment', error);
      next(error);
    }
  }

  /**
   * Get submissions
   */
  static async getSubmissions(req, res, next) {
    try {
      const { page = 1, limit = 12, assignmentId = '', student = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (assignmentId) filter.assignment = assignmentId;
      if (student) filter.student = student;
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Submission.countDocuments(filter);
      const submissions = await Submission.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .lean()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ submittedDate: -1 });

      return responseHelper.paginated(res, submissions, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching submissions', error);
      next(error);
    }
  }

  /**
   * Evaluate submission
   */
  static async evaluateSubmission(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { submissionId } = req.params;
      const { marks, feedback, rubricScore } = req.body;

      if (marks === undefined) throw new ValidationError('Marks are required');

      const submission = await Submission.findOne({ _id: submissionId, schoolId });
      if (!submission) throw new AppError('Submission not found', 404);

      const evaluation = new Evaluation({
        schoolId,
        submission: submissionId,
        marks,
        feedback,
        rubricScore,
        evaluatedBy: req.user.userId,
        evaluatedDate: new Date()
      });

      await evaluation.save();

      submission.marks = marks;
      submission.evaluated = true;
      submission.status = 'EVALUATED';
      await submission.save();

      return responseHelper.created(res, evaluation, 'Submission evaluated successfully');
    } catch (error) {
      logger.error('Error evaluating submission', error);
      next(error);
    }
  }

  /**
   * Get submission details
   */
  static async getSubmissionDetails(req, res, next) {
    try {
      const { submissionId } = req.params;
      const schoolId = req.user.schoolId;

      const submission = await Submission.findOne({ _id: submissionId, schoolId })
        .populate('student', 'firstName lastName rollNumber email')
        .populate('assignment', 'title dueDate')
        .lean();

      if (!submission) throw new AppError('Submission not found', 404);

      const evaluation = await Evaluation.findOne({ submission: submissionId }).lean();

      return responseHelper.success(res, { submission, evaluation }, 'Submission details retrieved successfully');
    } catch (error) {
      logger.error('Error fetching submission details', error);
      next(error);
    }
  }

  /**
   * Get assignment statistics
   */
  static async getAssignmentStatistics(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const schoolId = req.user.schoolId;

      const assignment = await Assignment.findOne({ _id: assignmentId, schoolId }).lean();
      if (!assignment) throw new AppError('Assignment not found', 404);

      const submissions = await Submission.find({ schoolId, assignment: assignmentId }).lean();
      const evaluations = await Evaluation.find({ schoolId }).lean();

      const stats = {
        assignmentId,
        title: assignment.title,
        totalSubmissions: submissions.length,
        onTimeSubmissions: submissions.filter(s => s.status === 'ON_TIME').length,
        lateSubmissions: submissions.filter(s => s.status === 'LATE').length,
        evaluated: submissions.filter(s => s.evaluated).length,
        averageMarks: submissions.filter(s => s.marks).length > 0
          ? Math.round(submissions.filter(s => s.marks).reduce((sum, s) => sum + s.marks, 0) / submissions.filter(s => s.marks).length)
          : 0
      };

      return responseHelper.success(res, stats, 'Assignment statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching assignment statistics', error);
      next(error);
    }
  }

  /**
   * Extend assignment deadline
   */
  static async extendDeadline(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const { newDueDate } = req.body;
      const schoolId = req.user.schoolId;

      if (!newDueDate) throw new ValidationError('New due date is required');

      const assignment = await Assignment.findOneAndUpdate(
        { _id: assignmentId, schoolId },
        { dueDate: new Date(newDueDate) },
        { new: true }
      );

      if (!assignment) throw new AppError('Assignment not found', 404);

      return responseHelper.success(res, assignment, 'Deadline extended successfully');
    } catch (error) {
      logger.error('Error extending deadline', error);
      next(error);
    }
  }
}

module.exports = AssignmentController;
