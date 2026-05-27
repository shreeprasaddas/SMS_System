const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/exam.controller');
const { authorize } = require('../middleware/authorization.middleware');


// ==================== EXAM TYPES ====================
router.post(
  '/types',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.createExamType
);

router.get(
  '/types',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  ExamController.getExamTypes
);

// ==================== EXAM SCHEDULES ====================
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.createExamSchedule
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  ExamController.getExamSchedules
);

router.get(
  '/:scheduleId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  ExamController.getExamScheduleById
);

router.put(
  '/:scheduleId',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.updateExamSchedule
);

router.delete(
  '/:scheduleId',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.deleteExamSchedule
);

// ==================== SEAT ALLOCATIONS ====================
router.post(
  '/allocations',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.allocateSeats
);

router.get(
  '/allocations',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  ExamController.getSeatAllocations
);

// ==================== HALL TICKETS & PUBLISHING ====================
router.get(
  '/:examScheduleId/students/:studentId/hall-ticket',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  ExamController.generateHallTicket
);

router.put(
  '/:examScheduleId/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  ExamController.publishResults
);

// ==================== EXAM EXECUTION ====================
router.put(
  '/:scheduleId/start',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  ExamController.startExam
);

router.put(
  '/:scheduleId/end',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  ExamController.endExam
);

// ==================== STATISTICS ====================
router.get(
  '/:examScheduleId/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  ExamController.getExamStatistics
);

module.exports = router;
