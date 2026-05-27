/**
 * Document Routes
 * Certificate templates, document issuance, requests, verification, and archival
 */

const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const documentController = require('../controllers/document.controller');
const validationSchemas = require('../validations/document.validation');

// =============== CERTIFICATE TEMPLATE ROUTES ===============

/**
 * POST /api/v1/documents/templates
 * Create certificate template
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.createTemplateSchema, 'body'),
  documentController.createTemplate
);

/**
 * GET /api/v1/documents/templates
 * Get all certificate templates
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(validationSchemas.getTemplatesSchema, 'query'),
  documentController.getTemplates
);

/**
 * GET /api/v1/documents/templates/:templateId
 * Get template by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/templates/:templateId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  documentController.getTemplateById
);

/**
 * PUT /api/v1/documents/templates/:templateId
 * Update template
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/templates/:templateId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.updateTemplateSchema, 'body'),
  documentController.updateTemplate
);

// =============== DOCUMENT ISSUANCE ROUTES ===============

/**
 * POST /api/v1/documents/issue
 * Issue single document
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/issue',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.issueDocumentSchema, 'body'),
  documentController.issueDocument
);

/**
 * POST /api/v1/documents/issue-bulk
 * Bulk issue documents
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/issue-bulk',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.bulkIssueDocumentsSchema, 'body'),
  documentController.bulkIssueDocuments
);

/**
 * GET /api/v1/documents/issued
 * Get all issued documents
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/issued',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(validationSchemas.getIssuedDocumentsSchema, 'query'),
  documentController.getIssuedDocuments
);

/**
 * GET /api/v1/documents/issued/:documentId
 * Get issued document by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/issued/:documentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  documentController.getDocumentById
);

/**
 * PUT /api/v1/documents/issued/:documentId/approve
 * Approve document
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/issued/:documentId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.approveDocumentSchema, 'body'),
  documentController.approveDocument
);

/**
 * PUT /api/v1/documents/issued/:documentId/reject
 * Reject document
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/issued/:documentId/reject',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.rejectDocumentSchema, 'body'),
  documentController.rejectDocument
);

/**
 * GET /api/v1/documents/student/:studentId
 * Get documents by student
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/student/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  documentController.getDocumentsByStudent
);

// =============== DOCUMENT REQUEST ROUTES ===============

/**
 * POST /api/v1/documents/requests
 * Create document request
 * Roles: ADMIN, PRINCIPAL, STUDENT, PARENT
 */
router.post(
  '/requests',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT']),
  validate(validationSchemas.createRequestSchema, 'body'),
  documentController.createRequest
);

/**
 * GET /api/v1/documents/requests
 * Get all document requests
 * Roles: ADMIN, PRINCIPAL, STUDENT
 */
router.get(
  '/requests',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT']),
  validate(validationSchemas.getRequestsSchema, 'query'),
  documentController.getRequests
);

/**
 * GET /api/v1/documents/requests/:requestId
 * Get request by ID
 * Roles: ADMIN, PRINCIPAL, STUDENT
 */
router.get(
  '/requests/:requestId',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT']),
  documentController.getRequestById
);

/**
 * PUT /api/v1/documents/requests/:requestId/status
 * Update request status
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/requests/:requestId/status',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.updateRequestStatusSchema, 'body'),
  documentController.updateRequestStatus
);

// =============== DOCUMENT VERIFICATION ROUTES ===============

/**
 * POST /api/v1/documents/verify
 * Create verification request
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/verify',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.createVerificationSchema, 'body'),
  documentController.createVerification
);

/**
 * GET /api/v1/documents/verifications
 * Get all verifications
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/verifications',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.getVerificationsSchema, 'query'),
  documentController.getVerifications
);

/**
 * GET /api/v1/documents/verifications/:verificationId
 * Get verification by ID
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/verifications/:verificationId',
  authorize(['ADMIN', 'PRINCIPAL']),
  documentController.getVerificationById
);

/**
 * PUT /api/v1/documents/verifications/:verificationId/complete
 * Complete verification
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/verifications/:verificationId/complete',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.completeVerificationSchema, 'body'),
  documentController.completeVerification
);

// =============== DOCUMENT ARCHIVAL ROUTES ===============

/**
 * POST /api/v1/documents/:documentId/archive
 * Archive document
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/:documentId/archive',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.archiveDocumentSchema, 'body'),
  documentController.archiveDocument
);

/**
 * GET /api/v1/documents/archives
 * Get all archived documents
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/archives',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(validationSchemas.getArchivedDocumentsSchema, 'query'),
  documentController.getArchivedDocuments
);

/**
 * GET /api/v1/documents/archives/:archiveId
 * Get archive by ID
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/archives/:archiveId',
  authorize(['ADMIN', 'PRINCIPAL']),
  documentController.getArchiveById
);

// =============== STATISTICS & ALERTS ROUTES ===============

/**
 * GET /api/v1/documents/stats
 * Get document statistics
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/stats',
  authorize(['ADMIN', 'PRINCIPAL']),
  documentController.getDocumentStats
);

/**
 * GET /api/v1/documents/expiring
 * Get expiring documents
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/expiring',
  authorize(['ADMIN', 'PRINCIPAL']),
  documentController.getExpiringDocuments
);

module.exports = router;
