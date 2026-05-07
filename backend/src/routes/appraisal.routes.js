/**
 * Appraisal Routes
 * API endpoints for performance appraisal workflow
 */

const express = require('express');
const router = express.Router();
const AppraisalController = require('../controllers/appraisal.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const appraisalValidation = require('../validations/appraisal.validation');

// All routes require authentication
router.use(authenticate);

router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validateRequest(appraisalValidation.createAppraisalSchema, 'body'),
  AppraisalController.createAppraisal
);

router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validateRequest(appraisalValidation.getAppraisalsSchema, 'query'),
  AppraisalController.getAppraisals
);

router.get(
  '/:appraisalId',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  AppraisalController.getAppraisalById
);

router.put(
  '/:appraisalId',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validateRequest(appraisalValidation.updateAppraisalSchema, 'body'),
  AppraisalController.updateAppraisal
);

router.patch(
  '/:appraisalId/submit',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  AppraisalController.submitAppraisal
);

router.patch(
  '/:appraisalId/review',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validateRequest(appraisalValidation.reviewAppraisalSchema, 'body'),
  AppraisalController.reviewAppraisal
);

router.patch(
  '/:appraisalId/finalize',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(appraisalValidation.finalizeAppraisalSchema, 'body'),
  AppraisalController.finalizeAppraisal
);

router.patch(
  '/:appraisalId/publish',
  authorize(['ADMIN', 'PRINCIPAL']),
  AppraisalController.publishAppraisal
);

router.get(
  '/history',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER', 'EMPLOYEE']),
  validateRequest(appraisalValidation.getAppraisalHistorySchema, 'query'),
  AppraisalController.getEmployeeAppraisalHistory
);

router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'HR_MANAGER']),
  validateRequest(appraisalValidation.getAppraisalStatisticsSchema, 'query'),
  AppraisalController.getAppraisalStatistics
);

module.exports = router;
