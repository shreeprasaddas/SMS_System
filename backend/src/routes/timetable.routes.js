const express = require('express');
const router = express.Router();
const TimetableController = require('../controllers/timetable.controller');
const { authorize } = require('../middleware/authorization.middleware');

// ==================== PERIOD CONFIGURATIONS ====================

router.post(
  '/period-configs',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.createPeriodConfig
);

router.get(
  '/period-configs',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  TimetableController.getPeriodConfigs
);

// ==================== TIMETABLE CRUD ====================

router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.createTimetable
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  TimetableController.getTimetables
);

router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  TimetableController.getTimetableById
);

router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.updateTimetable
);

router.delete(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.deleteTimetable
);

// ==================== SCHEDULE & VALIDATION ====================

router.get(
  '/:timetableId/schedule',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  TimetableController.getClassScheduleByDay
);

router.get(
  '/:timetableId/validate',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.validateTimetableConflicts
);

// ==================== TEACHER TIMETABLES ====================

router.post(
  '/teachers/:teacherId',
  authorize(['ADMIN', 'PRINCIPAL']),
  TimetableController.createTeacherTimetable
);

router.get(
  '/teachers/:teacherId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  TimetableController.getTeacherTimetable
);

router.get(
  '/teachers/:teacherId/free-periods',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  TimetableController.getTeacherFreePeriods
);

module.exports = router;
