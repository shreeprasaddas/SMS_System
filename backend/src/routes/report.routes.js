/**
 * Report Routes
 * API endpoints for system reports, backups, logs, policies, and compliance
 */

const express = require('express');
const router = express.Router();
const SystemController = require('../controllers/system.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const systemValidation = require('../validations/system.validation');

// All routes require authentication
router.use(authenticate);

/**
 * Report routes
 */
router.post(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'REPORT_MANAGER']),
  validateRequest(systemValidation.generateReportSchema, 'body'),
  SystemController.generateReport
);

router.get(
  '/reports',
  authorize(['ADMIN', 'PRINCIPAL', 'REPORT_MANAGER', 'TEACHER']),
  validateRequest(systemValidation.getReportsSchema, 'query'),
  SystemController.getReports
);

/**
 * Backup routes
 */
router.post(
  '/backups',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.logBackupSchema, 'body'),
  SystemController.logBackup
);

router.get(
  '/backups',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.getBackupLogsSchema, 'query'),
  SystemController.getBackupLogs
);

/**
 * System logs
 */
router.get(
  '/logs',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.getSystemLogsSchema, 'query'),
  SystemController.getSystemLogs
);

/**
 * Security policy routes
 */
router.post(
  '/policies',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.createSecurityPolicySchema, 'body'),
  SystemController.createSecurityPolicy
);

router.get(
  '/policies',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM', 'TEACHER']),
  validateRequest(systemValidation.getSecurityPoliciesSchema, 'query'),
  SystemController.getSecurityPolicies
);

/**
 * Compliance routes
 */
router.post(
  '/compliance',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.createComplianceSchema, 'body'),
  SystemController.createCompliance
);

router.get(
  '/compliance',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  validateRequest(systemValidation.getComplianceRecordsSchema, 'query'),
  SystemController.getComplianceRecords
);

router.put(
  '/compliance/:complianceId',
  authorize(['ADMIN', 'SYSTEM']),
  validateRequest(systemValidation.updateComplianceStatusSchema, 'body'),
  SystemController.updateComplianceStatus
);

/**
 * Statistics
 */
router.get(
  '/stats',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  SystemController.getSystemStats
);

module.exports = router;
