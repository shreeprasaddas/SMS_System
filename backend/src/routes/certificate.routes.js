/**
 * Certificate Routes
 * API endpoints for certificate management
 */

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const certificateValidation = require('../validations/certificate.validation');

/**
 * CERTIFICATES - Master Certificate Management
 */

// POST: Create certificate
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(certificateValidation.createCertificateSchema, 'body'),
  certificateController.createCertificate
);

// GET: List all certificates
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(certificateValidation.listCertificatesSchema, 'query'),
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
  validate(certificateValidation.createCertificateSchema, 'body'),
  certificateController.updateCertificate
);

/**
 * CERTIFICATE TEMPLATES - Design & Layout Management
 */

// POST: Create template
router.post(
  '/templates/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(certificateValidation.createTemplateSchema, 'body'),
  certificateController.createTemplate
);

// GET: List templates
router.get(
  '/templates/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(certificateValidation.listTemplatesSchema, 'query'),
  certificateController.getAllTemplates
);

/**
 * STUDENT CERTIFICATES - Issuance & Distribution
 */

// POST: Issue certificate
router.post(
  '/issue',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(certificateValidation.issueCertificateSchema, 'body'),
  certificateController.issueCertificate
);

// GET: Get student certificates
router.get(
  '/students/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(certificateValidation.listStudentCertificatesSchema, 'query'),
  certificateController.getStudentCertificates
);

// PATCH: Distribute certificate
router.patch(
  '/:id/distribute',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(certificateValidation.distributeCertificateSchema, 'body'),
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
  validate(certificateValidation.createEventSchema, 'body'),
  certificateController.createEvent
);

// GET: List events
router.get(
  '/events/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(certificateValidation.listEventsSchema, 'query'),
  certificateController.getEvents
);

// POST: Register for event
router.post(
  '/events/:id/register',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(certificateValidation.registerAttendeeSchema, 'body'),
  certificateController.registerEventAttendee
);

/**
 * CERTIFICATE VERIFICATION - Authenticity & Validation
 */

// POST: Verify certificate
router.post(
  '/verify',
  validate(certificateValidation.verifyCertificateSchema, 'body'),
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
