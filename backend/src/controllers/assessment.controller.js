/**
 * Assessment Controller
 * HTTP request handlers for assessment management
 */

const AssessmentService = require('../services/assessment.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class AssessmentController {
  /**
   * Create assessment
   * POST /api/v1/assessments
   */
  static async createAssessment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const assessmentData = req.body;

      const assessment = await AssessmentService.createAssessment(schoolId, assessmentData, userId);

      responseHelper.created(res, assessment, 'Assessment created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get assessments
   * GET /api/v1/assessments
   */
  static async getAssessments(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await AssessmentService.getAssessments(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Assessments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get assessment by ID
   * GET /api/v1/assessments/:assessmentId
   */
  static async getAssessmentById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;

      const assessment = await AssessmentService.getAssessmentById(schoolId, assessmentId);

      responseHelper.success(res, assessment, 'Assessment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update assessment
   * PUT /api/v1/assessments/:assessmentId
   */
  static async updateAssessment(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;
      const updateData = req.body;

      const assessment = await AssessmentService.updateAssessment(
        schoolId,
        assessmentId,
        updateData
      );

      responseHelper.success(res, assessment, 'Assessment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete assessment
   * DELETE /api/v1/assessments/:assessmentId
   */
  static async deleteAssessment(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;

      const result = await AssessmentService.deleteAssessment(schoolId, assessmentId);

      responseHelper.success(res, result, 'Assessment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish assessment
   * PATCH /api/v1/assessments/:assessmentId/publish
   */
  static async publishAssessment(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;

      const assessment = await AssessmentService.publishAssessment(schoolId, assessmentId);

      responseHelper.success(res, assessment, 'Assessment published successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Close assessment
   * PATCH /api/v1/assessments/:assessmentId/close
   */
  static async closeAssessment(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;

      const assessment = await AssessmentService.closeAssessment(schoolId, assessmentId);

      responseHelper.success(res, assessment, 'Assessment closed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit assessment
   * POST /api/v1/assessments/:assessmentId/submit
   */
  static async submitAssessment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { assessmentId } = req.params;
      const submissionData = req.body;

      const studentAssessment = await AssessmentService.submitAssessment(
        schoolId,
        userId,
        assessmentId,
        submissionData
      );

      responseHelper.created(res, studentAssessment, 'Assessment submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark assessment
   * PATCH /api/v1/assessments/:assessmentId/mark/:studentAssessmentId
   */
  static async markAssessment(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { studentAssessmentId } = req.params;
      const { marksObtained, feedback } = req.body;

      const studentAssessment = await AssessmentService.markAssessment(
        schoolId,
        studentAssessmentId,
        marksObtained,
        feedback,
        userId
      );

      responseHelper.success(res, studentAssessment, 'Assessment marked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get assessment results
   * GET /api/v1/assessments/:assessmentId/results
   */
  static async getAssessmentResults(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;
      const filters = req.query;

      const result = await AssessmentService.getAssessmentResults(schoolId, assessmentId, filters);

      responseHelper.paginated(
        res,
        result.results,
        result.pagination,
        'Assessment results retrieved successfully',
        {
          assessment: result.assessment,
          stats: result.stats,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student assessment results
   * GET /api/v1/assessments/student/:studentId
   */
  static async getStudentAssessments(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { studentId } = req.params;
      const filters = req.query;

      const result = await AssessmentService.getStudentAssessmentResults(
        schoolId,
        studentId,
        filters
      );

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Student assessments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get assessment analytics
   * GET /api/v1/assessments/:assessmentId/analytics
   */
  static async getAssessmentAnalytics(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { assessmentId } = req.params;

      const analytics = await AssessmentService.getAssessmentAnalytics(schoolId, assessmentId);

      responseHelper.success(res, analytics, 'Assessment analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AssessmentController;
