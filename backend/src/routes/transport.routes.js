const express = require('express');
const router = express.Router();
const TransportController = require('../controllers/transport.controller');
const { authorize } = require('../middleware/authorization.middleware');

// ==================== ROUTES ====================

router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.createRoute
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  TransportController.getRoutes
);

router.put(
  '/:routeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.updateRoute
);

router.delete(
  '/:routeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.deleteRoute
);

router.get(
  '/:routeId/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.getRouteStatistics
);

// ==================== BUSES ====================

router.post(
  '/buses',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.createBus
);

router.get(
  '/buses',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER', 'STUDENT', 'PARENT']),
  TransportController.getBuses
);

router.put(
  '/buses/:busId/assign-driver',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.assignDriver
);

router.get(
  '/buses/:busId/maintenance',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.getBusMaintenanceSchedule
);

router.put(
  '/buses/:busId/mileage',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.updateBusMileage
);

// ==================== STUDENT ALLOCATIONS ====================

router.post(
  '/allocations',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER']),
  TransportController.assignStudentToRoute
);

router.get(
  '/allocations',
  authorize(['ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER', 'TEACHER']),
  TransportController.getStudentTransports
);

module.exports = router;
