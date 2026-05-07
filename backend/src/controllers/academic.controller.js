/**
 * Academic Controller
 * HTTP request handlers for academic foundation (years, streams, sections)
 */

const academicService = require('../services/academic.service');
const responseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');

class AcademicController {
  // ============================================================
  // ACADEMIC YEAR HANDLERS
  // ============================================================

  /**
   * Create academic year
   * POST /api/v1/academic/years
   */
  static async createAcademicYear(req, res, next) {
    try {
      const year = await academicService.createAcademicYear(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { year }, 'Academic year created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all academic years
   * GET /api/v1/academic/years
   */
  static async getAcademicYears(req, res, next) {
    try {
      const { isActive, status } = req.query;

      const years = await academicService.getAcademicYears(req.user.schoolId, {
        isActive: isActive === 'true',
        status,
      });

      responseHelper.success(res, { years }, 'Academic years retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get academic year by ID
   * GET /api/v1/academic/years/:yearId
   */
  static async getAcademicYear(req, res, next) {
    try {
      const { yearId } = req.params;

      const year = await academicService.getAcademicYearById(req.user.schoolId, yearId);

      responseHelper.success(res, { year }, 'Academic year retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update academic year
   * PUT /api/v1/academic/years/:yearId
   */
  static async updateAcademicYear(req, res, next) {
    try {
      const { yearId } = req.params;

      const year = await academicService.updateAcademicYear(
        req.user.schoolId,
        yearId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { year }, 'Academic year updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate academic year
   * PATCH /api/v1/academic/years/:yearId/activate
   */
  static async activateAcademicYear(req, res, next) {
    try {
      const { yearId } = req.params;

      const year = await academicService.activateAcademicYear(
        req.user.schoolId,
        yearId,
        req.user.userId
      );

      responseHelper.success(res, { year }, 'Academic year activated successfully');
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // STREAM HANDLERS
  // ============================================================

  /**
   * Create stream
   * POST /api/v1/academic/streams
   */
  static async createStream(req, res, next) {
    try {
      const stream = await academicService.createStream(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { stream }, 'Stream created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all streams
   * GET /api/v1/academic/streams
   */
  static async getStreams(req, res, next) {
    try {
      const streams = await academicService.getStreams(req.user.schoolId);

      responseHelper.success(res, { streams }, 'Streams retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get stream by ID
   * GET /api/v1/academic/streams/:streamId
   */
  static async getStream(req, res, next) {
    try {
      const { streamId } = req.params;

      const stream = await academicService.getStreamById(req.user.schoolId, streamId);

      responseHelper.success(res, { stream }, 'Stream retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update stream
   * PUT /api/v1/academic/streams/:streamId
   */
  static async updateStream(req, res, next) {
    try {
      const { streamId } = req.params;

      const stream = await academicService.updateStream(
        req.user.schoolId,
        streamId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { stream }, 'Stream updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // SECTION HANDLERS
  // ============================================================

  /**
   * Create section
   * POST /api/v1/academic/sections
   */
  static async createSection(req, res, next) {
    try {
      const section = await academicService.createSection(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { section }, 'Section created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all sections
   * GET /api/v1/academic/sections
   */
  static async getSections(req, res, next) {
    try {
      const sections = await academicService.getSections(req.user.schoolId);

      responseHelper.success(res, { sections }, 'Sections retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get section by ID
   * GET /api/v1/academic/sections/:sectionId
   */
  static async getSection(req, res, next) {
    try {
      const { sectionId } = req.params;

      const section = await academicService.getSectionById(req.user.schoolId, sectionId);

      responseHelper.success(res, { section }, 'Section retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update section
   * PUT /api/v1/academic/sections/:sectionId
   */
  static async updateSection(req, res, next) {
    try {
      const { sectionId } = req.params;

      const section = await academicService.updateSection(
        req.user.schoolId,
        sectionId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { section }, 'Section updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // SUBJECT HANDLERS
  // ============================================================

  /**
   * Create subject
   * POST /api/v1/academic/subjects
   */
  static async createSubject(req, res, next) {
    try {
      const subject = await academicService.createSubject(
        req.user.schoolId,
        req.body,
        req.user.userId
      );

      responseHelper.created(res, { subject }, 'Subject created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all subjects
   * GET /api/v1/academic/subjects
   */
  static async getSubjects(req, res, next) {
    try {
      const { category, streamId } = req.query;

      const subjects = await academicService.getSubjects(req.user.schoolId, {
        category,
        streamId,
      });

      responseHelper.success(res, { subjects }, 'Subjects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subject by ID
   * GET /api/v1/academic/subjects/:subjectId
   */
  static async getSubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      const subject = await academicService.getSubjectById(req.user.schoolId, subjectId);

      responseHelper.success(res, { subject }, 'Subject retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update subject
   * PUT /api/v1/academic/subjects/:subjectId
   */
  static async updateSubject(req, res, next) {
    try {
      const { subjectId } = req.params;

      const subject = await academicService.updateSubject(
        req.user.schoolId,
        subjectId,
        req.body,
        req.user.userId
      );

      responseHelper.success(res, { subject }, 'Subject updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign subject to stream
   * POST /api/v1/academic/subjects/:subjectId/streams/:streamId
   */
  static async assignSubjectToStream(req, res, next) {
    try {
      const { subjectId, streamId } = req.params;

      const subject = await academicService.assignSubjectToStream(
        req.user.schoolId,
        subjectId,
        streamId
      );

      responseHelper.success(res, { subject }, 'Subject assigned to stream successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AcademicController;
