const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transport.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  createRouteSchema,
  updateRouteSchema,
  registerBusSchema,
  updateBusSchema,
  registerDriverSchema,
  updateDriverSchema,
  assignStudentSchema,
  addAttendanceSchema,
  listRoutesSchema,
  listBusesSchema,
  listDriversSchema
} = require('../validations/transport.validation');

// All routes require authentication
router.use(authenticate);

// ==================== ROUTES ====================

router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(createRouteSchema),
  transportController.createRoute
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(listRoutesSchema),
  transportController.getAllRoutes
);

router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  transportController.getRouteById
);

router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(updateRouteSchema),
  transportController.updateRoute
);

router.put(
  '/:routeId/deactivate',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  transportController.deactivateRoute
);

router.get(
  '/:routeId/allocations',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER']),
  transportController.getRouteAllocations
);

// ==================== BUSES ====================

router.post(
  '/buses',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(registerBusSchema),
  transportController.registerBus
);

router.get(
  '/buses',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  validate(listBusesSchema),
  transportController.getAllBuses
);

router.get(
  '/buses/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  transportController.getBusById
);

router.put(
  '/buses/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(updateBusSchema),
  transportController.updateBus
);

router.get(
  '/buses/:busId/logs',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER']),
  transportController.getBusLogs
);

// ==================== DRIVERS ====================

router.post(
  '/drivers',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(registerDriverSchema),
  transportController.registerDriver
);

router.get(
  '/drivers',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER']),
  validate(listDriversSchema),
  transportController.getAllDrivers
);

router.put(
  '/drivers/:driverId/deactivate',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  transportController.deactivateDriver
);

// ==================== STUDENT ALLOCATIONS ====================

router.post(
  '/allocations',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validate(assignStudentSchema),
  transportController.assignStudentToRoute
);

router.get(
  '/allocations/student/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  transportController.getStudentAllocation
);

router.post(
  '/allocations/:studentId/collect-fee',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  transportController.collectTransportFee
);

// ==================== ATTENDANCE ====================

router.post(
  '/attendance',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER']),
  validate(addAttendanceSchema),
  transportController.addTransportAttendance
);

// ==================== STATISTICS ====================

router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  transportController.getTransportStatistics
);

module.exports = router;

/**
 * Driver routes
 */
router.post(
  '/drivers',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validateRequest(transportValidation.addDriverSchema, 'body'),
  TransportController.addDriver
);

router.get(
  '/drivers',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validateRequest(transportValidation.getDriversSchema, 'query'),
  TransportController.getDrivers
);

/**
 * Student transport assignment routes
 */
router.post(
  '/assignments',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  validateRequest(transportValidation.assignStudentTransportSchema, 'body'),
  TransportController.assignStudentTransport
);

/**
 * Statistics
 */
router.get(
  '/stats',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.getTransportStats
);

module.exports = router;
