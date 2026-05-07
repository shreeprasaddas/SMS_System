const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admission.controller');
const { authenticate } = require('../middleware/authenticate.middleware');
const { authorize } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createAdmissionCycleSchema,
  createApplicationSchema,
  submitApplicationSchema,
  createApplicationFormSchema,
  createDocVerificationSchema,
  verifyDocumentSchema,
  createMeritListSchema,
  publishMeritListSchema,
  finalizeMeritListSchema,
  admissionCycleFiltersSchema,
  applicationFiltersSchema,
  applicationFormFiltersSchema,
  docVerificationFiltersSchema,
  meritListFiltersSchema
} = require('../validations/admission.validation');

// Apply authentication to all routes
router.use(authenticate);

// ============== ADMISSION CYCLE ROUTES ==============

/**
 * POST /api/v1/admission/cycles
 * Create admission cycle
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/cycles',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createAdmissionCycleSchema, 'body'),
  admissionController.createAdmissionCycle
);

/**
 * GET /api/v1/admission/cycles
 * Get all admission cycles
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/cycles',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(admissionCycleFiltersSchema, 'query'),
  admissionController.getAllAdmissionCycles
);

/**
 * GET /api/v1/admission/cycles/:id
 * Get admission cycle by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/cycles/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  admissionController.getAdmissionCycleById
);

/**
 * PUT /api/v1/admission/cycles/:id
 * Update admission cycle
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/cycles/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  admissionController.updateAdmissionCycle
);

/**
 * GET /api/v1/admission/cycles/:cycleId/statistics
 * Get admission statistics
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/cycles/:cycleId/statistics',
  authorize(['ADMIN', 'PRINCIPAL']),
  admissionController.getAdmissionStatistics
);

// ============== APPLICATION ROUTES ==============

/**
 * POST /api/v1/admission/applications
 * Create application
 * Roles: ADMIN, PRINCIPAL, PUBLIC
 */
router.post(
  '/applications',
  validate(createApplicationSchema, 'body'),
  admissionController.createApplication
);

/**
 * GET /api/v1/admission/applications
 * Get all applications
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/applications',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(applicationFiltersSchema, 'query'),
  admissionController.getAllApplications
);

/**
 * GET /api/v1/admission/applications/:id
 * Get application by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/applications/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  admissionController.getApplicationById
);

/**
 * PUT /api/v1/admission/applications/:id
 * Update application
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/applications/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  admissionController.updateApplication
);

/**
 * POST /api/v1/admission/applications/:id/submit
 * Submit application
 * Roles: PUBLIC
 */
router.post(
  '/applications/:id/submit',
  validate(submitApplicationSchema, 'body'),
  admissionController.submitApplication
);

// ============== APPLICATION FORM ROUTES ==============

/**
 * POST /api/v1/admission/forms
 * Create application form
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/forms',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createApplicationFormSchema, 'body'),
  admissionController.createApplicationForm
);

/**
 * GET /api/v1/admission/forms
 * Get all application forms
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/forms',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(applicationFormFiltersSchema, 'query'),
  admissionController.getAllApplicationForms
);

/**
 * GET /api/v1/admission/forms/:id
 * Get application form by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/forms/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  admissionController.getApplicationFormById
);

// ============== DOCUMENT VERIFICATION ROUTES ==============

/**
 * POST /api/v1/admission/verifications
 * Create document verification
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/verifications',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createDocVerificationSchema, 'body'),
  admissionController.createDocVerification
);

/**
 * GET /api/v1/admission/verifications
 * Get all document verifications
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/verifications',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(docVerificationFiltersSchema, 'query'),
  admissionController.getAllDocVerifications
);

/**
 * PUT /api/v1/admission/verifications/:id
 * Update document verification
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/verifications/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  admissionController.updateDocVerification
);

/**
 * POST /api/v1/admission/verifications/:id/verify
 * Verify document
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/verifications/:id/verify',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(verifyDocumentSchema, 'body'),
  admissionController.verifyDocument
);

// ============== MERIT LIST ROUTES ==============

/**
 * POST /api/v1/admission/merit-lists
 * Create merit list
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/merit-lists',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createMeritListSchema, 'body'),
  admissionController.createMeritList
);

/**
 * GET /api/v1/admission/merit-lists
 * Get all merit lists
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/merit-lists',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validate(meritListFiltersSchema, 'query'),
  admissionController.getAllMeritLists
);

/**
 * GET /api/v1/admission/merit-lists/:id
 * Get merit list by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/merit-lists/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  admissionController.getMeritListById
);

/**
 * PUT /api/v1/admission/merit-lists/:id/publish
 * Publish merit list
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/merit-lists/:id/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(publishMeritListSchema, 'body'),
  admissionController.publishMeritList
);

/**
 * PUT /api/v1/admission/merit-lists/:id/finalize
 * Finalize merit list
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/merit-lists/:id/finalize',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(finalizeMeritListSchema, 'body'),
  admissionController.finalizeMeritList
);

module.exports = router;
