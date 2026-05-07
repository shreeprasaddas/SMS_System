/**
 * Routes Aggregator
 * Central location to mount all API routes
 */

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');

const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const teacherRoutes = require('./teacher.routes');

module.exports = (app) => {
  const router = express.Router();

  // Public Routes (no authentication required)
  router.use('/auth', authRoutes);

  // Protected Routes (authentication required)
  router.use('/students', authenticate, studentRoutes);
  router.use('/teachers', authenticate, teacherRoutes);

  // Mount all routes under /api/v1
  app.use('/api/v1', router);
};
