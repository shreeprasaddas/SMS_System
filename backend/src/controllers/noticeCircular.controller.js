/**
 * Notice & Circular Management Controller
 * Request handlers for notice and circular operations
 */

const noticeCircularService = require('../services/noticeCircular.service');
const { validateRequest } = require('../utils/validation.helper');
const { ResponseHelper } = require('../utils/response.helper');
const {
  createNoticeSchema,
  updateNoticeSchema,
  publishNoticeSchema,
  getNoticesSchema,
  createTemplateSchema,
  getTemplatesSchema,
  createAcknowledgmentSchema,
  getAcknowledgmentsSchema,
  uploadAttachmentSchema,
  createDistributionSchema,
  getPendingAcknowledgmentsSchema,
  getNoticeStatisticsSchema,
} = require('../validations/noticeCircular.validation');

/**
 * Create notice
 * POST /notices-circulars/notices
 */
exports.createNotice = async (req, res, next) => {
  try {
    await validateRequest(req.body, createNoticeSchema);
    const notice = await noticeCircularService.createNotice(req.body, req.user.schoolId);
    return ResponseHelper.created(res, notice, 'Notice created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get notices
 * GET /notices-circulars/notices
 */
exports.getNotices = async (req, res, next) => {
  try {
    await validateRequest(req.query, getNoticesSchema);
    const result = await noticeCircularService.getNotices(req.user.schoolId, req.query);
    return ResponseHelper.paginated(
      res,
      result.notices,
      result.total,
      result.page,
      result.limit,
      'Notices retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get notice by ID
 * GET /notices-circulars/notices/:noticeId
 */
exports.getNoticeById = async (req, res, next) => {
  try {
    const notice = await noticeCircularService.getNoticeById(req.params.noticeId, req.user.schoolId);
    return ResponseHelper.success(res, notice, 'Notice retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update notice
 * PUT /notices-circulars/notices/:noticeId
 */
exports.updateNotice = async (req, res, next) => {
  try {
    await validateRequest(req.body, updateNoticeSchema);
    const notice = await noticeCircularService.updateNotice(req.params.noticeId, req.user.schoolId, {
      ...req.body,
      performedBy: req.user._id,
    });
    return ResponseHelper.success(res, notice, 'Notice updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Publish notice
 * POST /notices-circulars/notices/:noticeId/publish
 */
exports.publishNotice = async (req, res, next) => {
  try {
    const notice = await noticeCircularService.publishNotice(
      req.params.noticeId,
      req.user.schoolId,
      req.user._id
    );
    return ResponseHelper.success(res, notice, 'Notice published successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create template
 * POST /notices-circulars/templates
 */
exports.createTemplate = async (req, res, next) => {
  try {
    await validateRequest(req.body, createTemplateSchema);
    const template = await noticeCircularService.createTemplate(req.body, req.user.schoolId);
    return ResponseHelper.created(res, template, 'Template created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get templates
 * GET /notices-circulars/templates
 */
exports.getTemplates = async (req, res, next) => {
  try {
    await validateRequest(req.query, getTemplatesSchema);
    const result = await noticeCircularService.getTemplates(req.user.schoolId, req.query);
    return ResponseHelper.paginated(
      res,
      result.templates,
      result.total,
      result.page,
      result.limit,
      'Templates retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create acknowledgment
 * POST /notices-circulars/acknowledgments
 */
exports.createAcknowledgment = async (req, res, next) => {
  try {
    await validateRequest(req.body, createAcknowledgmentSchema);
    const acknowledgment = await noticeCircularService.createAcknowledgment(
      req.body,
      req.user.schoolId
    );
    return ResponseHelper.created(res, acknowledgment, 'Notice acknowledged successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get acknowledgments for notice
 * GET /notices-circulars/notices/:noticeId/acknowledgments
 */
exports.getAcknowledgments = async (req, res, next) => {
  try {
    await validateRequest(req.query, getAcknowledgmentsSchema);
    const result = await noticeCircularService.getAcknowledgments(
      req.params.noticeId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.acknowledgments,
      result.total,
      result.page,
      result.limit,
      'Acknowledgments retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Upload attachment
 * POST /notices-circulars/notices/:noticeId/attachments
 */
exports.uploadAttachment = async (req, res, next) => {
  try {
    await validateRequest(req.body, uploadAttachmentSchema);
    const attachment = await noticeCircularService.uploadAttachment(
      { ...req.body, uploadedBy: req.user._id },
      req.user.schoolId
    );
    return ResponseHelper.created(res, attachment, 'Attachment uploaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get attachments for notice
 * GET /notices-circulars/notices/:noticeId/attachments
 */
exports.getAttachments = async (req, res, next) => {
  try {
    const result = await noticeCircularService.getAttachments(
      req.params.noticeId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.attachments,
      result.total,
      result.page,
      result.limit,
      'Attachments retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create distribution
 * POST /notices-circulars/distribution
 */
exports.createDistribution = async (req, res, next) => {
  try {
    await validateRequest(req.body, createDistributionSchema);
    const distribution = await noticeCircularService.createDistribution(
      req.body,
      req.user.schoolId
    );
    return ResponseHelper.created(res, distribution, 'Distribution created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get distribution tracking
 * GET /notices-circulars/distribution/:noticeId
 */
exports.getDistributionTracking = async (req, res, next) => {
  try {
    const distribution = await noticeCircularService.getDistributionTracking(
      req.params.noticeId,
      req.user.schoolId
    );
    return ResponseHelper.success(res, distribution, 'Distribution tracking retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending acknowledgments
 * GET /notices-circulars/acknowledgments/pending
 */
exports.getPendingAcknowledgments = async (req, res, next) => {
  try {
    await validateRequest(req.query, getPendingAcknowledgmentsSchema);
    const result = await noticeCircularService.getPendingAcknowledgments(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.pending,
      result.total,
      result.page,
      result.limit,
      'Pending acknowledgments retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get notice statistics
 * GET /notices-circulars/statistics
 */
exports.getNoticeStatistics = async (req, res, next) => {
  try {
    await validateRequest(req.query, getNoticeStatisticsSchema);
    const stats = await noticeCircularService.getNoticeStatistics(req.user.schoolId, req.query);
    return ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
