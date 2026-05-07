/**
 * Certificate Routes
 * API endpoints for certificate management
 */

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const certificateValidation = require('../validations/certificate.validation');

// Middleware: All routes require authentication
router.use(authenticate);

/**
 * CERTIFICATES - Master Certificate Management
 */

// POST: Create certificate
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(certificateValidation.createCertificateSchema, 'body'),
  certificateController.createCertificate
);

// GET: List all certificates
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(certificateValidation.listCertificatesSchema, 'query'),
  certificateController.getAllCertificates
);

// GET: Certificate by ID
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  certificateController.getCertificateById
);

// PUT: Update certificate
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(certificateValidation.createCertificateSchema, 'body'),
  certificateController.updateCertificate
);

/**
 * CERTIFICATE TEMPLATES - Design & Layout Management
 */

// POST: Create template
router.post(
  '/templates/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(certificateValidation.createTemplateSchema, 'body'),
  certificateController.createTemplate
);

// GET: List templates
router.get(
  '/templates/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(certificateValidation.listTemplatesSchema, 'query'),
  certificateController.getAllTemplates
);

/**
 * STUDENT CERTIFICATES - Issuance & Distribution
 */

// POST: Issue certificate
router.post(
  '/issue',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(certificateValidation.issueCertificateSchema, 'body'),
  certificateController.issueCertificate
);

// GET: Get student certificates
router.get(
  '/students/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(certificateValidation.listStudentCertificatesSchema, 'query'),
  certificateController.getStudentCertificates
);

// PATCH: Distribute certificate
router.patch(
  '/:id/distribute',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(certificateValidation.distributeCertificateSchema, 'body'),
  certificateController.distributeCertificate
);

// PATCH: Revoke certificate
router.patch(
  '/:id/revoke',
  authorize(['ADMIN', 'PRINCIPAL']),
  certificateController.revokeCertificate
);

/**
 * CERTIFICATE EVENTS - Distribution Ceremonies & Events
 */

// POST: Create event
router.post(
  '/events/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(certificateValidation.createEventSchema, 'body'),
  certificateController.createEvent
);

// GET: List events
router.get(
  '/events/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(certificateValidation.listEventsSchema, 'query'),
  certificateController.getEvents
);

// POST: Register for event
router.post(
  '/events/:id/register',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(certificateValidation.registerAttendeeSchema, 'body'),
  certificateController.registerEventAttendee
);

/**
 * CERTIFICATE VERIFICATION - Authenticity & Validation
 */

// POST: Verify certificate
router.post(
  '/verify',
  validateRequest(certificateValidation.verifyCertificateSchema, 'body'),
  certificateController.verifyCertificate
);

/**
 * STATISTICS - Dashboard Data
 */

// GET: Certificate statistics
router.get(
  '/dashboard/statistics',
  authorize(['ADMIN', 'PRINCIPAL']),
  certificateController.getStatistics
);

module.exports = router;
