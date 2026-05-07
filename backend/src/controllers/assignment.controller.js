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
      const { title, description, subject, class: classId, teacher, dueDate, assignmentType, instructions } = req.body;

      if (!title || !subject || !classId || !teacher) {
        throw new ValidationError('Missing required fields');
      }

      const assignment = new Assignment({
        schoolId,
        title,
        description,
        subject,
        class: classId,
        teacher,
        dueDate: new Date(dueDate),
        assignmentType: assignmentType || 'HOMEWORK',
        instructions,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await assignment.save();

      return responseHelper.created(res, assignment, 'Assignment created successfully');
    } catch (error) {
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
    const assignment = await assignmentService.createAssignment(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, assignment, 'Assignment created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/assignments - Get all assignments
 */
exports.getAllAssignments = async (req, res, next) => {
  try {
    const { status, subjectId, classId, page = 1, limit = 20 } = req.query;

    const { assignments, total } = await assignmentService.getAllAssignments(
      req.user.schoolId,
      {
        status,
        subjectId,
        classId,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, assignments, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/assignments/:id - Get assignment by ID
 */
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignmentById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, assignment);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/assignments/:id - Update assignment
 */
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.updateAssignment(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, assignment, 'Assignment updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/assignments/:id/publish - Publish assignment
 */
exports.publishAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.publishAssignment(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, assignment, 'Assignment published successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/assignments/:id/close - Close assignment
 */
exports.closeAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.closeAssignment(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, assignment, 'Assignment closed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/assignments/:id/statistics - Get assignment statistics
 */
exports.getAssignmentStatistics = async (req, res, next) => {
  try {
    const stats = await assignmentService.getAssignmentStatistics(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, stats);
  } catch (err) {
    next(err);
  }
};

// ============== SUBMISSION MANAGEMENT ==============

/**
 * POST /api/v1/assignments/:id/submit - Submit assignment
 */
exports.submitAssignment = async (req, res, next) => {
  try {
    const submission = await assignmentService.submitAssignment(
      req.user.schoolId,
      req.params.id,
      req.user.userId,
      req.body
    );

    return responseHelper.created(res, submission, 'Assignment submitted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/assignments/:id/submissions - Get all submissions (teacher)
 */
exports.getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const { submissions, total } = await assignmentService.getAssignmentSubmissions(
      req.user.schoolId,
      req.params.id,
      {
        status,
        page: Number(page),
        limit: Number(limit)
      }
    );

    return responseHelper.paginated(res, submissions, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/assignments/:assignmentId/students/:studentId/submissions - Get student's submissions
 */
exports.getStudentSubmissions = async (req, res, next) => {
  try {
    const submissions = await assignmentService.getStudentSubmissions(
      req.user.schoolId,
      req.params.assignmentId,
      req.params.studentId
    );

    return responseHelper.success(res, submissions);
  } catch (err) {
    next(err);
  }
};

// ============== EVALUATION MANAGEMENT ==============

/**
 * POST /api/v1/submissions/:submissionId/evaluate - Create evaluation
 */
exports.createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await assignmentService.createEvaluation(
      req.user.schoolId,
      req.params.submissionId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, evaluation, 'Evaluation created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/evaluations/:id - Get evaluation
 */
exports.getEvaluation = async (req, res, next) => {
  try {
    const evaluation = await assignmentService.getEvaluation(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, evaluation);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/evaluations/:id - Update evaluation
 */
exports.updateEvaluation = async (req, res, next) => {
  try {
    const evaluation = await assignmentService.updateEvaluation(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, evaluation, 'Evaluation updated successfully');
  } catch (err) {
    next(err);
  }
};

// ============== RUBRIC MANAGEMENT ==============

/**
 * POST /api/v1/rubrics - Create rubric
 */
exports.createRubric = async (req, res, next) => {
  try {
    const rubric = await assignmentService.createRubric(
      req.user.schoolId,
      req.body,
      req.user.userId
    );

    return responseHelper.created(res, rubric, 'Rubric created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/rubrics - Get all rubrics
 */
exports.getAllRubrics = async (req, res, next) => {
  try {
    const { isTemplate, status, page = 1, limit = 20 } = req.query;

    const { rubrics, total } = await assignmentService.getAllRubrics(req.user.schoolId, {
      isTemplate: isTemplate === 'true',
      status,
      page: Number(page),
      limit: Number(limit)
    });

    return responseHelper.paginated(res, rubrics, {
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/rubrics/:id - Get rubric by ID
 */
exports.getRubricById = async (req, res, next) => {
  try {
    const rubric = await assignmentService.getRubricById(
      req.user.schoolId,
      req.params.id
    );

    return responseHelper.success(res, rubric);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/rubrics/:id - Update rubric
 */
exports.updateRubric = async (req, res, next) => {
  try {
    const rubric = await assignmentService.updateRubric(
      req.user.schoolId,
      req.params.id,
      req.body
    );

    return responseHelper.success(res, rubric, 'Rubric updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
