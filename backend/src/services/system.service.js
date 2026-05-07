/**
 * System Service
 * Business logic for system management, reports, and compliance
 */

const Report = require('../models/system/Report.model');
const BackupLog = require('../models/system/BackupLog.model');
const SystemLog = require('../models/system/SystemLog.model');
const SecurityPolicy = require('../models/system/SecurityPolicy.model');
const Compliance = require('../models/system/Compliance.model');
const { AppError } = require('../utils/errorHelper');

class SystemService {
  /**
   * Generate report
   */
  static async generateReport(schoolId, reportData, userId) {
    try {
      const report = new Report({
        ...reportData,
        schoolId,
        generatedBy: userId,
        generatedAt: new Date(),
      });

      await report.save();
      return report;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reports
   */
  static async getReports(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, reportType, status, startDate, endDate } = filters;

      const query = { schoolId };

      if (reportType) query.reportType = reportType;
      if (status) query.status = status;
      if (startDate || endDate) {
        query['reportPeriod.startDate'] = {};
        if (startDate) query['reportPeriod.startDate'].$gte = new Date(startDate);
        if (endDate) query['reportPeriod.startDate'].$lte = new Date(endDate);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { generatedAt: -1 },
        populate: [
          { path: 'generatedBy', select: 'name email' }
        ]
      };

      const result = await Report.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log backup
   */
  static async logBackup(schoolId, backupData, userId) {
    try {
      const backup = new BackupLog({
        ...backupData,
        schoolId,
        initiatedBy: userId,
        expiryDate: new Date(Date.now() + (backupData.retentionDays * 24 * 60 * 60 * 1000)),
      });

      await backup.save();
      return backup;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get backup logs
   */
  static async getBackupLogs(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, status, backupType, startDate, endDate } = filters;

      const query = { schoolId };

      if (status) query.status = status;
      if (backupType) query.backupType = backupType;
      if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { startTime: -1 },
        populate: [
          { path: 'initiatedBy', select: 'name email' }
        ]
      };

      const result = await BackupLog.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log system activity
   */
  static async logActivity(schoolId, logData) {
    try {
      const systemLog = new SystemLog({
        ...logData,
        schoolId,
        timestamp: new Date(),
      });

      await systemLog.save();
      return systemLog;
    } catch (error) {
      // Don't throw - logging should not fail the main operation
      console.error('Failed to log system activity:', error);
    }
  }

  /**
   * Get system logs
   */
  static async getSystemLogs(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, action, module, userId, startDate, endDate } = filters;

      const query = { schoolId };

      if (action) query.action = action;
      if (module) query.module = module;
      if (userId) query.userId = userId;
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { timestamp: -1 },
        populate: [
          { path: 'userId', select: 'name email' }
        ]
      };

      const result = await SystemLog.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create security policy
   */
  static async createSecurityPolicy(schoolId, policyData, userId) {
    try {
      const policy = new SecurityPolicy({
        ...policyData,
        schoolId,
        createdBy: userId,
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get security policies
   */
  static async getSecurityPolicies(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, policyType, status } = filters;

      const query = { schoolId };

      if (policyType) query.policyType = policyType;
      if (status) query.status = status;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'name email' }
        ]
      };

      const result = await SecurityPolicy.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create compliance record
   */
  static async createCompliance(schoolId, complianceData, userId) {
    try {
      const compliance = new Compliance({
        ...complianceData,
        schoolId,
        createdBy: userId,
      });

      await compliance.save();
      return compliance;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get compliance records
   */
  static async getComplianceRecords(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, complianceType, category, overallStatus } = filters;

      const query = { schoolId };

      if (complianceType) query.complianceType = complianceType;
      if (category) query.category = category;
      if (overallStatus) query.overallStatus = overallStatus;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { deadline: 1 },
        populate: [
          { path: 'createdBy', select: 'name email' }
        ]
      };

      const result = await Compliance.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update compliance status
   */
  static async updateComplianceStatus(schoolId, complianceId, updateData, userId) {
    try {
      const compliance = await Compliance.findOneAndUpdate(
        { _id: complianceId, schoolId },
        {
          ...updateData,
          lastUpdated: new Date(),
        },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name');

      if (!compliance) {
        throw new AppError('Compliance record not found', 404);
      }

      return compliance;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get system statistics
   */
  static async getSystemStats(schoolId) {
    try {
      const [
        totalReports,
        reportsGenerated,
        totalBackups,
        successfulBackups,
        totalPolicies,
        activePolicies,
        totalCompliances,
        compliantItems
      ] = await Promise.all([
        Report.countDocuments({ schoolId }),
        Report.countDocuments({ schoolId, status: 'GENERATED' }),
        BackupLog.countDocuments({ schoolId }),
        BackupLog.countDocuments({ schoolId, status: 'COMPLETED' }),
        SecurityPolicy.countDocuments({ schoolId }),
        SecurityPolicy.countDocuments({ schoolId, status: 'ACTIVE' }),
        Compliance.countDocuments({ schoolId }),
        Compliance.countDocuments({ schoolId, overallStatus: 'COMPLIANT' })
      ]);

      return {
        reports: { total: totalReports, generated: reportsGenerated },
        backups: { total: totalBackups, successful: successfulBackups },
        policies: { total: totalPolicies, active: activePolicies },
        compliances: { total: totalCompliances, compliant: compliantItems }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SystemService;
