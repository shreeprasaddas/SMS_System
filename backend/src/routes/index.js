/**
 * Routes Aggregator
 * Central location to mount all API routes
 */

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');

// ========================================
// Import Route Modules
// ========================================

// Auth (public)
const authRoutes = require('./auth.routes');

// Core Academic
const studentRoutes = require('./student.routes');
const teacherRoutes = require('./teacher.routes');
const classRoutes = require('./class.routes');
const subjectRoutes = require('./subject.routes');

// Assessment & Grading
const attendanceRoutes = require('./attendance.routes');
const gradeRoutes = require('./grade.routes');
const examRoutes = require('./exam.routes');
const assignmentRoutes = require('./assignment.routes');

// Finance & Payments
const feeRoutes = require('./fee.routes');
const financeRoutes = require('./finance.routes');
const paymentRoutes = require('./payment.routes');
const expenseRoutes = require('./expense.routes');

// Communication
const communicationRoutes = require('./communication.routes');

// Analytics & Reports
const analyticsRoutes = require('./analytics.routes');
const reportRoutes = require('./report.routes');
const reportcardRoutes = require('./reportcard.routes');

// Administration
const timetableRoutes = require('./timetable.routes');
const transportRoutes = require('./transport.routes');
const hrRoutes = require('./hr.routes');
const libraryRoutes = require('./library.routes');
const hostelRoutes = require('./hostel.routes');
const documentRoutes = require('./document.routes');
const admissionRoutes = require('./admission.routes');

module.exports = (app) => {
  const router = express.Router();

  // ========================================
  // Public Routes (no authentication)
  // ========================================
  router.use('/auth', authRoutes);

  // ========================================
  // Protected Routes (authentication required)
  // ========================================

  // Core Academic
  router.use('/students', authenticate, studentRoutes);
  router.use('/teachers', authenticate, teacherRoutes);
  router.use('/classes', authenticate, classRoutes);
  router.use('/subjects', authenticate, subjectRoutes);

  // Assessment & Grading
  router.use('/attendance', authenticate, attendanceRoutes);
  router.use('/grades', authenticate, gradeRoutes);
  router.use('/exams', authenticate, examRoutes);
  router.use('/assignments', authenticate, assignmentRoutes);

  // Finance & Payments
  router.use('/fees', authenticate, feeRoutes);
  router.use('/finance', authenticate, financeRoutes);
  router.use('/payments', authenticate, paymentRoutes);
  router.use('/expenses', authenticate, expenseRoutes);

  // Communication
  router.use('/communication', authenticate, communicationRoutes);

  // Analytics & Reports
  router.use('/analytics', authenticate, analyticsRoutes);
  router.use('/reports', authenticate, reportRoutes);
  router.use('/reportcards', authenticate, reportcardRoutes);

  // Administration
  router.use('/timetables', authenticate, timetableRoutes);
  router.use('/transport', authenticate, transportRoutes);
  router.use('/hr', authenticate, hrRoutes);
  router.use('/library', authenticate, libraryRoutes);
  router.use('/hostel', authenticate, hostelRoutes);
  router.use('/documents', authenticate, documentRoutes);
  router.use('/admissions', authenticate, admissionRoutes);

  // Mount all routes under /api/v1
  app.use('/api/v1', router);
};

