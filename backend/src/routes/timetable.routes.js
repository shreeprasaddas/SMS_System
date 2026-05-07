const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const { authenticate } = require('../middleware/authenticate.middleware');
const { authorize } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createPeriodConfigSchema,
  createTimeSlotSchema,
  createTimetableSchema,
  updateTimetableSchema,
  createTeacherTimetableSchema,
  requestTimetableChangeSchema,
  approveTimetableChangeSchema,
  rejectTimetableChangeSchema,
  periodConfigFiltersSchema,
  timeSlotFiltersSchema,
  timetableFiltersSchema,
  timetableChangeFiltersSchema
} = require('../validations/timetable.validation');

// Apply authentication to all routes
router.use(authenticate);

// ============== PERIOD CONFIGURATION ROUTES ==============

/**
 * POST /api/v1/timetable/period-configs
 * Create period configuration
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/period-configs',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createPeriodConfigSchema, 'body'),
  timetableController.createPeriodConfig
);

/**
 * GET /api/v1/timetable/period-configs
 * Get all period configurations
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/period-configs',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(periodConfigFiltersSchema, 'query'),
  timetableController.getAllPeriodConfigs
);

/**
 * GET /api/v1/timetable/period-configs/:id
 * Get period configuration by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/period-configs/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  timetableController.getPeriodConfigById
);

// ============== TIME SLOT ROUTES ==============

/**
 * POST /api/v1/timetable/time-slots
 * Create time slot
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/time-slots',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createTimeSlotSchema, 'body'),
  timetableController.createTimeSlot
);

/**
 * GET /api/v1/timetable/time-slots
 * Get all time slots
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/time-slots',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(timeSlotFiltersSchema, 'query'),
  timetableController.getAllTimeSlots
);

// ============== TIMETABLE ROUTES ==============

/**
 * POST /api/v1/timetable
 * Create timetable
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createTimetableSchema, 'body'),
  timetableController.createTimetable
);

/**
 * GET /api/v1/timetable
 * Get all timetables
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(timetableFiltersSchema, 'query'),
  timetableController.getAllTimetables
);

/**
 * GET /api/v1/timetable/:id
 * Get timetable by ID
 * Roles: ADMIN, PRINCIPAL, TEACHER, STUDENT
 */
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  timetableController.getTimetableById
);

/**
 * PUT /api/v1/timetable/:id
 * Update timetable
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateTimetableSchema, 'body'),
  timetableController.updateTimetable
);

/**
 * PUT /api/v1/timetable/:id/publish
 * Publish timetable
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/:id/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  timetableController.publishTimetable
);

/**
 * PUT /api/v1/timetable/:id/activate
 * Activate timetable
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/:id/activate',
  authorize(['ADMIN', 'PRINCIPAL']),
  timetableController.activateTimetable
);

/**
 * GET /api/v1/timetable/:id/statistics
 * Get timetable statistics
 * Roles: ADMIN, PRINCIPAL
 */
router.get(
  '/:id/statistics',
  authorize(['ADMIN', 'PRINCIPAL']),
  timetableController.getTimetableStatistics
);

// ============== TEACHER TIMETABLE ROUTES ==============

/**
 * POST /api/v1/timetable/teachers/:teacherId
 * Create teacher timetable
 * Roles: ADMIN, PRINCIPAL
 */
router.post(
  '/teachers/:teacherId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createTeacherTimetableSchema, 'body'),
  timetableController.createTeacherTimetable
);

/**
 * GET /api/v1/timetable/teachers/:teacherId
 * Get teacher timetable
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/teachers/:teacherId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  timetableController.getTeacherTimetable
);

/**
 * PUT /api/v1/timetable/teachers/:teacherId/confirm
 * Confirm teacher timetable
 * Roles: TEACHER
 */
router.put(
  '/teachers/:teacherId/confirm',
  authorize(['TEACHER']),
  timetableController.confirmTeacherTimetable
);

// ============== TIMETABLE CHANGE ROUTES ==============

/**
 * POST /api/v1/timetable/:timetableId/changes
 * Request timetable change
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.post(
  '/:timetableId/changes',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(requestTimetableChangeSchema, 'body'),
  timetableController.requestTimetableChange
);

/**
 * GET /api/v1/timetable/changes
 * Get all timetable changes
 * Roles: ADMIN, PRINCIPAL, TEACHER
 */
router.get(
  '/changes',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(timetableChangeFiltersSchema, 'query'),
  timetableController.getTimetableChanges
);

/**
 * PUT /api/v1/timetable/changes/:changeId/approve
 * Approve timetable change
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/changes/:changeId/approve',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(approveTimetableChangeSchema, 'body'),
  timetableController.approveTimetableChange
);

/**
 * PUT /api/v1/timetable/changes/:changeId/reject
 * Reject timetable change
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/changes/:changeId/reject',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(rejectTimetableChangeSchema, 'body'),
  timetableController.rejectTimetableChange
);

/**
 * PUT /api/v1/timetable/changes/:changeId/implement
 * Implement timetable change
 * Roles: ADMIN, PRINCIPAL
 */
router.put(
  '/changes/:changeId/implement',
  authorize(['ADMIN', 'PRINCIPAL']),
  timetableController.implementTimetableChange
);

module.exports = router;
