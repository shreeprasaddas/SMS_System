/**
 * System Controller
 * HTTP request handlers for system management, reports, and compliance
 */

const SystemService = require('../services/system.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

class SystemController {
  /**
   * Generate report
   * POST /api/v1/system/reports
   */
  static async generateReport(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const reportData = req.body;

      const report = await SystemService.generateReport(schoolId, reportData, userId);

      responseHelper.created(res, report, 'Report generated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reports
   * GET /api/v1/system/reports
   */
  static async getReports(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await SystemService.getReports(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'Reports retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log backup
   * POST /api/v1/system/backups
   */
  static async logBackup(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const backupData = req.body;

      const backup = await SystemService.logBackup(schoolId, backupData, userId);

      responseHelper.created(res, backup, 'Backup logged successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get backup logs
   * GET /api/v1/system/backups
   */
  static async getBackupLogs(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await SystemService.getBackupLogs(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'Backup logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get system logs
   * GET /api/v1/system/logs
   */
  static async getSystemLogs(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await SystemService.getSystemLogs(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'System logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create security policy
   * POST /api/v1/system/policies
   */
  static async createSecurityPolicy(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const policyData = req.body;

      const policy = await SystemService.createSecurityPolicy(schoolId, policyData, userId);

      responseHelper.created(res, policy, 'Security policy created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get security policies
   * GET /api/v1/system/policies
   */
  static async getSecurityPolicies(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await SystemService.getSecurityPolicies(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'Security policies retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create compliance record
   * POST /api/v1/system/compliance
   */
  static async createCompliance(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const complianceData = req.body;

      const compliance = await SystemService.createCompliance(schoolId, complianceData, userId);

      responseHelper.created(res, compliance, 'Compliance record created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get compliance records
   * GET /api/v1/system/compliance
   */
  static async getComplianceRecords(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await SystemService.getComplianceRecords(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'Compliance records retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update compliance status
   * PUT /api/v1/system/compliance/:complianceId
   */
  static async updateComplianceStatus(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { complianceId } = req.params;
      const updateData = req.body;

      const compliance = await SystemService.updateComplianceStatus(schoolId, complianceId, updateData, userId);

      responseHelper.success(res, compliance, 'Compliance status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get system statistics
   * GET /api/v1/system/stats
   */
  static async getSystemStats(req, res, next) {
    try {
      const { schoolId } = req.user;

      const stats = await SystemService.getSystemStats(schoolId);

      responseHelper.success(res, stats, 'System statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SystemController;
