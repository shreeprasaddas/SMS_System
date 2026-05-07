/**
 * Certificate Controller
 * HTTP request handlers for certificate management
 */

const certificateService = require('../services/certificate.service');
const { ResponseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const CertificateEvent = require('../models/CertificateEvent.model');

/**
 * Create Certificate
 * POST /api/v1/certificates
 */
exports.createCertificate = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const certificate = await certificateService.createCertificate(req.body, schoolId);
    ResponseHelper.created(res, certificate, 'Certificate created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Certificates
 * GET /api/v1/certificates
 */
exports.getAllCertificates = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await certificateService.getAllCertificates(schoolId, req.query);
    ResponseHelper.paginated(res, result.certificates, result, 'Certificates retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Certificate by ID
 * GET /api/v1/certificates/:id
 */
exports.getCertificateById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const certificate = await certificateService.getCertificateById(req.params.id, schoolId);
    ResponseHelper.success(res, certificate, 'Certificate retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Certificate
 * PUT /api/v1/certificates/:id
 */
exports.updateCertificate = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const certificate = await certificateService.updateCertificate(
      req.params.id,
      { ...req.body, auditLog: { action: 'UPDATED', performedBy: userId, timestamp: new Date(), changes: req.body } },
      schoolId
    );
    ResponseHelper.success(res, certificate, 'Certificate updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Certificate Template
 * POST /api/v1/templates
 */
exports.createTemplate = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const template = await certificateService.createCertificateTemplate({ ...req.body, createdByUserId: userId }, schoolId);
    ResponseHelper.created(res, template, 'Certificate template created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Certificate Templates
 * GET /api/v1/templates
 */
exports.getAllTemplates = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await certificateService.getAllCertificateTemplates(schoolId, req.query);
    ResponseHelper.paginated(res, result.templates, result, 'Templates retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Issue Certificate
 * POST /api/v1/certificates/issue
 */
exports.issueCertificate = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const certificate = await certificateService.issueCertificate(req.body, schoolId, userId);
    ResponseHelper.created(res, certificate, 'Certificate issued successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Student Certificates
 * GET /api/v1/students/:id/certificates
 */
exports.getStudentCertificates = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await certificateService.getStudentCertificates(req.params.id, schoolId, req.query);
    ResponseHelper.paginated(res, result.certificates, result, 'Student certificates retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Distribute Certificate
 * PATCH /api/v1/certificates/:id/distribute
 */
exports.distributeCertificate = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const certificate = await certificateService.distributeCertificate(
      req.params.id,
      req.body.studentId,
      req.body,
      schoolId,
      userId
    );
    ResponseHelper.success(res, certificate, 'Certificate distributed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Certificate Event
 * POST /api/v1/events
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const event = await certificateService.createEvent(req.body, schoolId, userId);
    ResponseHelper.created(res, event, 'Certificate event created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Certificate Events
 * GET /api/v1/events
 */
exports.getEvents = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await certificateService.getEvents(schoolId, req.query);
    ResponseHelper.paginated(res, result.events, result, 'Certificate events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Certificate
 * POST /api/v1/certificates/verify
 */
exports.verifyCertificate = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await certificateService.verifyCertificate(req.body.verificationCode, schoolId);
    ResponseHelper.success(res, result, 'Certificate verification completed');
  } catch (error) {
    next(error);
  }
};

/**
 * Register Event Attendee
 * POST /api/v1/events/:id/register
 */
exports.registerEventAttendee = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const event = await CertificateEvent.findOneAndUpdate(
      { _id: req.params.id, schoolId },
      {
        $push: {
          attendees: {
            ...req.body,
            registrationDate: new Date(),
            registrationStatus: 'REGISTERED',
          },
        },
        $inc: { 'eventStatistics.totalRegistered': 1 },
      },
      { new: true, runValidators: true }
    );
    if (!event) throw new AppError('Event not found', 404);
    ResponseHelper.success(res, event, 'Registered for event successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Certificate Statistics
 * GET /api/v1/certificates/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const stats = await certificateService.getStatistics(schoolId);
    ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke Certificate
 * PATCH /api/v1/certificates/:id/revoke
 */
exports.revokeCertificate = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const certificate = await certificateService.updateCertificate(
      req.params.id,
      {
        'validityDetails.validityStatus': 'REVOKED',
        'validityDetails.isValid': false,
        remarks: req.body.reason,
        auditLog: {
          action: 'CERTIFICATE_REVOKED',
          performedBy: userId,
          timestamp: new Date(),
          changes: { reason: req.body.reason },
        },
      },
      schoolId
    );
    ResponseHelper.success(res, certificate, 'Certificate revoked successfully');
  } catch (error) {
    next(error);
  }
};
