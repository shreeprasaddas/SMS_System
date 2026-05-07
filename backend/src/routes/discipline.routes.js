const express = require('express');
const router = express.Router();
const disciplineController = require('../controllers/discipline.controller');
const { authenticate } = require('../middleware/authenticate.middleware');
const { authorize } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  reportIncidentSchema,
  updateIncidentSchema,
  createDisciplineRecordSchema,
  approveDisciplineRecordSchema,
  issueDisciplinaryActionSchema,
  updateDisciplinaryActionSchema,
  completeActionSchema,
  appealActionSchema,
  incidentsFiltersSchema,
  recordsFiltersSchema,
  actionsFiltersSchema
} = require('../validations/discipline.validation');

// Apply authentication to all routes
router.use(authenticate);

// ============== INCIDENT ROUTES ==============

/**
 * POST /api/v1/discipline/incidents
 * Report a new incident
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.post(
  '/incidents',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(reportIncidentSchema, 'body'),
  disciplineController.reportIncident
);

/**
 * GET /api/v1/discipline/incidents
 * Get all incidents with filters and pagination
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/incidents',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(incidentsFiltersSchema, 'query'),
  disciplineController.getAllIncidents
);

/**
 * GET /api/v1/discipline/incidents/:id
 * Get incident by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/incidents/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  disciplineController.getIncidentById
);

/**
 * PUT /api/v1/discipline/incidents/:id
 * Update incident (add investigation details)
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/incidents/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateIncidentSchema, 'body'),
  disciplineController.updateIncident
);

// ============== DISCIPLINE RECORD ROUTES ==============

/**
 * POST /api/v1/discipline/records
 * Create a new discipline record from an incident
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/records',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createDisciplineRecordSchema, 'body'),
  disciplineController.createDisciplineRecord
);

/**
 * GET /api/v1/discipline/records
 * Get all discipline records with filters and pagination
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/records',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(recordsFiltersSchema, 'query'),
  disciplineController.getAllDisciplineRecords
);

/**
 * GET /api/v1/discipline/students/:studentId/records
 * Get all discipline records for a specific student
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/students/:studentId/records',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  disciplineController.getStudentDisciplineRecords
);

/**
 * PUT /api/v1/discipline/records/:id/approve
 * Approve or reject a discipline record
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/records/:id/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(approveDisciplineRecordSchema, 'body'),
  disciplineController.approveDisciplineRecord
);

// ============== DISCIPLINARY ACTION ROUTES ==============

/**
 * POST /api/v1/discipline/actions
 * Issue a new disciplinary action
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/actions',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(issueDisciplinaryActionSchema, 'body'),
  disciplineController.issueDisciplinaryAction
);

/**
 * GET /api/v1/discipline/actions
 * Get all disciplinary actions with filters and pagination
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/actions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(actionsFiltersSchema, 'query'),
  disciplineController.getAllDisciplinaryActions
);

/**
 * GET /api/v1/discipline/students/:studentId/actions
 * Get active disciplinary actions for a specific student
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/students/:studentId/actions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  disciplineController.getStudentActiveActions
);

/**
 * PUT /api/v1/discipline/actions/:id
 * Update disciplinary action details
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/actions/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateDisciplinaryActionSchema, 'body'),
  disciplineController.updateDisciplinaryAction
);

/**
 * PUT /api/v1/discipline/actions/:id/complete
 * Mark action as complete with evidence
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/actions/:id/complete',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(completeActionSchema, 'body'),
  disciplineController.completeAction
);

/**
 * POST /api/v1/discipline/actions/:id/appeal
 * File an appeal for a disciplinary action
 * Roles: STUDENT, PARENT
 */
router.post(
  '/actions/:id/appeal',
  authorize(['STUDENT', 'PARENT']),
  validate(appealActionSchema, 'body'),
  disciplineController.appealAction
);

// ============== STATISTICS AND REPORTING ROUTES ==============

/**
 * GET /api/v1/discipline/students/:studentId/summary
 * Get discipline summary for a student
 * Roles: ADMIN, PRINCIPAL, TEACHER, PARENT
 */
router.get(
  '/students/:studentId/summary',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT']),
  disciplineController.getStudentDisciplineSummary
);

/**
 * GET /api/v1/discipline/statistics
 * Get overall discipline statistics
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL']),
  disciplineController.getDisciplineStatistics
);

/**
 * POST /api/v1/discipline/report
 * Generate discipline report
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/report',
  authorize(['ADMIN', 'PRINCIPAL']),
  disciplineController.generateDisciplineReport
);

module.exports = router;
