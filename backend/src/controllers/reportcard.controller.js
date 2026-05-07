/**
 * ReportCard Controller
 * HTTP request handlers for report card management
 */

const ReportCardService = require('../services/reportcard.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class ReportCardController {
  /**
   * Generate report card
   * POST /api/v1/reportcards/generate
   */
  static async generateReportCard(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { student, academicYear, term } = req.body;

      const reportCard = await ReportCardService.generateReportCard(
        schoolId,
        student,
        academicYear,
        term,
        userId
      );

      responseHelper.created(res, reportCard, 'Report card generated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get report card by ID
   * GET /api/v1/reportcards/:reportCardId
   */
  static async getReportCardById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { reportCardId } = req.params;

      const reportCard = await ReportCardService.getReportCardById(schoolId, reportCardId);

      responseHelper.success(res, reportCard, 'Report card retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student report cards
   * GET /api/v1/reportcards/student/:studentId
   */
  static async getStudentReportCards(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { studentId } = req.params;
      const filters = req.query;

      const result = await ReportCardService.getStudentReportCards(schoolId, studentId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Student report cards retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get class report cards
   * GET /api/v1/reportcards/class/:classId
   */
  static async getClassReportCards(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { classId } = req.params;
      const { academicYear, term, page = 1, limit = 20 } = req.query;

      if (!academicYear || !term) {
        throw new AppError('Academic year and term are required', 400);
      }

      const result = await ReportCardService.getClassReportCards(
        schoolId,
        classId,
        academicYear,
        term,
        { page, limit }
      );

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Class report cards retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Finalize report card
   * PATCH /api/v1/reportcards/:reportCardId/finalize
   */
  static async finalizeReportCard(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { reportCardId } = req.params;

      const reportCard = await ReportCardService.finalizeReportCard(schoolId, reportCardId, userId);

      responseHelper.success(res, reportCard, 'Report card finalized successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish report card
   * PATCH /api/v1/reportcards/:reportCardId/publish
   */
  static async publishReportCard(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { reportCardId } = req.params;

      const reportCard = await ReportCardService.publishReportCard(schoolId, reportCardId, userId);

      responseHelper.success(res, reportCard, 'Report card published successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish class report cards
   * PATCH /api/v1/reportcards/class/publish
   */
  static async publishClassReportCards(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { class: classId, academicYear, term } = req.body;

      const result = await ReportCardService.publishClassReportCards(
        schoolId,
        classId,
        academicYear,
        term,
        userId
      );

      responseHelper.success(res, result, 'Class report cards published successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add principal remarks
   * PATCH /api/v1/reportcards/:reportCardId/principal-remarks
   */
  static async addPrincipalRemarks(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { reportCardId } = req.params;
      const { remarks } = req.body;

      const reportCard = await ReportCardService.addPrincipalRemarks(
        schoolId,
        reportCardId,
        remarks
      );

      responseHelper.success(res, reportCard, 'Principal remarks added successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add class teacher remarks
   * PATCH /api/v1/reportcards/:reportCardId/teacher-remarks
   */
  static async addClassTeacherRemarks(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { reportCardId } = req.params;
      const { remarks } = req.body;

      const reportCard = await ReportCardService.addClassTeacherRemarks(
        schoolId,
        reportCardId,
        remarks
      );

      responseHelper.success(res, reportCard, 'Class teacher remarks added successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get class report card statistics
   * GET /api/v1/reportcards/class-stats
   */
  static async getClassReportCardStats(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { class: classId, academicYear, term } = req.query;

      if (!classId || !academicYear || !term) {
        throw new AppError('Class, academic year, and term are required', 400);
      }

      const stats = await ReportCardService.getClassReportCardStats(
        schoolId,
        classId,
        academicYear,
        term
      );

      responseHelper.success(res, stats, 'Class statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportCardController;
