/**
 * System Validation Schemas
 * Request validation for system operations
 */

const Joi = require('joi');

const systemValidation = {
  // Generate report
  generateReportSchema: Joi.object({
    reportName: Joi.string().required().trim(),
    reportType: Joi.string()
      .valid('STUDENT_ACADEMIC', 'STUDENT_ATTENDANCE', 'STUDENT_BEHAVIOR', 'TEACHER_PERFORMANCE', 'CLASS_PERFORMANCE', 'FINANCIAL', 'INVENTORY', 'HR', 'TRANSPORT', 'LIBRARY', 'HOSTEL', 'CUSTOM')
      .required(),
    description: Joi.string().optional().trim(),
    reportPeriod: Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    }).required(),
    filters: Joi.object({
      class: Joi.string().optional(),
      academicYear: Joi.string().optional(),
      department: Joi.string().optional(),
    }).optional(),
    fileFormat: Joi.string()
      .valid('PDF', 'EXCEL', 'CSV', 'JSON')
      .default('PDF'),
  }).unknown(false),

  // Get reports (filters)
  getReportsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    reportType: Joi.string()
      .valid('STUDENT_ACADEMIC', 'STUDENT_ATTENDANCE', 'STUDENT_BEHAVIOR', 'TEACHER_PERFORMANCE', 'CLASS_PERFORMANCE', 'FINANCIAL', 'INVENTORY', 'HR', 'TRANSPORT', 'LIBRARY', 'HOSTEL', 'CUSTOM')
      .optional(),
    status: Joi.string()
      .valid('GENERATING', 'GENERATED', 'FAILED', 'ARCHIVED')
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }).unknown(true),

  // Log backup
  logBackupSchema: Joi.object({
    backupName: Joi.string().required().trim(),
    backupType: Joi.string()
      .valid('FULL', 'INCREMENTAL', 'DIFFERENTIAL')
      .required(),
    backupSource: Joi.string()
      .valid('DATABASE', 'FILES', 'DOCUMENTS', 'COMPLETE')
      .required(),
    startTime: Joi.date().required(),
    backupSize: Joi.number().min(0).required(),
    dataSize: Joi.number().min(0).required(),
    location: Joi.string().required().trim(),
    encryptionEnabled: Joi.boolean().default(true),
    retentionDays: Joi.number().integer().min(1).default(30),
    notes: Joi.string().optional().trim(),
  }).unknown(false),

  // Get backup logs (filters)
  getBackupLogsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    status: Joi.string()
      .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'VERIFIED')
      .optional(),
    backupType: Joi.string()
      .valid('FULL', 'INCREMENTAL', 'DIFFERENTIAL')
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }).unknown(true),

  // Get system logs (filters)
  getSystemLogsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    action: Joi.string()
      .valid('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'UPLOAD', 'DOWNLOAD', 'ACCESS', 'FAILED_LOGIN', 'PERMISSION_DENIED', 'SYSTEM_ERROR')
      .optional(),
    module: Joi.string()
      .valid('STUDENT', 'TEACHER', 'CLASS', 'EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'GRADE', 'FEE', 'HR', 'PAYROLL', 'LIBRARY', 'TRANSPORT', 'HOSTEL', 'COMMUNICATION', 'REPORTS', 'ADMIN', 'SYSTEM')
      .optional(),
    userId: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }).unknown(true),

  // Create security policy
  createSecurityPolicySchema: Joi.object({
    policyName: Joi.string().required().trim(),
    policyCode: Joi.string().required().trim(),
    policyType: Joi.string()
      .valid('DATA_PROTECTION', 'ACCESS_CONTROL', 'PASSWORD', 'AUTHENTICATION', 'BACKUP', 'AUDIT', 'INCIDENT_RESPONSE', 'ACCEPTABLE_USE', 'CHANGE_MANAGEMENT', 'COMPLIANCE')
      .required(),
    description: Joi.string().optional().trim(),
    content: Joi.string().required().trim(),
    version: Joi.string().default('1.0').trim(),
    effectiveDate: Joi.date().required(),
    expiryDate: Joi.date().optional(),
    applicableTo: Joi.array().items(
      Joi.string().valid('ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'CONTRACTOR', 'THIRD_PARTY')
    ).optional(),
    requirements: Joi.array().items(
      Joi.object({
        requirement: Joi.string().required(),
        mandatory: Joi.boolean().default(true),
        frequency: Joi.string()
          .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'ON_DEMAND')
          .optional(),
      })
    ).optional(),
  }).unknown(false),

  // Get security policies (filters)
  getSecurityPoliciesSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    policyType: Joi.string()
      .valid('DATA_PROTECTION', 'ACCESS_CONTROL', 'PASSWORD', 'AUTHENTICATION', 'BACKUP', 'AUDIT', 'INCIDENT_RESPONSE', 'ACCEPTABLE_USE', 'CHANGE_MANAGEMENT', 'COMPLIANCE')
      .optional(),
    status: Joi.string()
      .valid('DRAFT', 'APPROVED', 'ACTIVE', 'RETIRED')
      .optional(),
  }).unknown(true),

  // Create compliance
  createComplianceSchema: Joi.object({
    complianceName: Joi.string().required().trim(),
    complianceCode: Joi.string().required().trim(),
    complianceType: Joi.string()
      .valid('LEGAL', 'REGULATORY', 'INTERNAL', 'AUDIT', 'CERTIFICATION')
      .required(),
    category: Joi.string()
      .valid('DATA_PROTECTION', 'EDUCATIONAL', 'FINANCIAL', 'HR', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'OTHER')
      .required(),
    description: Joi.string().optional().trim(),
    deadline: Joi.date().required(),
    frequency: Joi.string()
      .valid('MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY')
      .required(),
    requirements: Joi.array().items(
      Joi.object({
        requirementId: Joi.string().required(),
        requirement: Joi.string().required(),
      })
    ).optional(),
  }).unknown(false),

  // Get compliance records (filters)
  getComplianceRecordsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    complianceType: Joi.string()
      .valid('LEGAL', 'REGULATORY', 'INTERNAL', 'AUDIT', 'CERTIFICATION')
      .optional(),
    category: Joi.string()
      .valid('DATA_PROTECTION', 'EDUCATIONAL', 'FINANCIAL', 'HR', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'OTHER')
      .optional(),
    overallStatus: Joi.string()
      .valid('COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'PENDING')
      .optional(),
  }).unknown(true),

  // Update compliance status
  updateComplianceStatusSchema: Joi.object({
    overallStatus: Joi.string()
      .valid('COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'PENDING')
      .optional(),
    compliancePercentage: Joi.number().min(0).max(100).optional(),
    requirements: Joi.array().items(
      Joi.object({
        requirementId: Joi.string().required(),
        status: Joi.string()
          .valid('COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'NOT_APPLICABLE')
          .optional(),
        evidence: Joi.string().optional(),
        remarks: Joi.string().optional(),
      })
    ).optional(),
  }).unknown(false),
};

module.exports = systemValidation;
