/**
 * Leave Management Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Schema: Create leave request
 */
exports.createLeaveRequestSchema = Joi.object({
  leaveTypeCode: Joi.string()
    .valid('CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL')
    .required(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  duration: Joi.number().positive().required(),
  durationUnit: Joi.string().valid('DAYS', 'HOURS', 'HALF_DAY'),
  reason: Joi.string().min(10).required(),
  attachments: Joi.array().items(
    Joi.object({
      fileId: Joi.string(),
      fileName: Joi.string(),
      fileUrl: Joi.string().uri(),
    })
  ),
}).unknown(false);

/**
 * Schema: Update leave request
 */
exports.updateLeaveRequestSchema = Joi.object({
  fromDate: Joi.date(),
  toDate: Joi.date(),
  duration: Joi.number().positive(),
  reason: Joi.string().min(10),
}).unknown(false);

/**
 * Schema: Get leave requests (query validation)
 */
exports.getLeaveRequestsSchema = Joi.object({
  userId: Joi.string().hex().length(24),
  status: Joi.string().valid('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'),
  leaveTypeCode: Joi.string().valid('CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get leave balance (query validation)
 */
exports.getLeaveBalanceSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  academicYear: Joi.string().required(),
  leaveTypeCode: Joi.string().valid('CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL'),
}).unknown(true);

/**
 * Schema: Create leave approval
 */
exports.createLeaveApprovalSchema = Joi.object({
  leaveId: Joi.string().hex().length(24).required(),
  approvalLevel: Joi.number().required(),
  approverUserId: Joi.string().hex().length(24).required(),
  approverName: Joi.string(),
  approverRole: Joi.string().valid('TEACHER', 'STAFF', 'PRINCIPAL', 'ADMIN'),
}).unknown(false);

/**
 * Schema: Approve leave
 */
exports.approveLeaveSchema = Joi.object({
  leaveId: Joi.string().hex().length(24).required(),
  approverId: Joi.string().hex().length(24).required(),
  remarks: Joi.string().max(500),
}).unknown(false);

/**
 * Schema: Reject leave
 */
exports.rejectLeaveSchema = Joi.object({
  leaveId: Joi.string().hex().length(24).required(),
  approverId: Joi.string().hex().length(24).required(),
  rejectionReason: Joi.string().min(10).required(),
}).unknown(false);

/**
 * Schema: Get leave approvals (query validation)
 */
exports.getLeaveApprovalsSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'SKIPPED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Create leave type
 */
exports.createLeaveTypeSchema = Joi.object({
  leaveTypeName: Joi.string().min(3).max(100).required(),
  leaveTypeCode: Joi.string()
    .valid('CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL')
    .required(),
  description: Joi.string(),
  applicableFor: Joi.array().items(
    Joi.string().valid('TEACHER', 'STAFF', 'STUDENT', 'PRINCIPAL', 'ADMIN')
  ),
  annualLimit: Joi.number().positive().required(),
}).unknown(false);

/**
 * Schema: Get leave policy (query validation)
 */
exports.getLeavePolicySchema = Joi.object({
  academicYear: Joi.string(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get pending leaves for approval (query validation)
 */
exports.getPendingLeavesSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get leave statistics (query validation)
 */
exports.getLeaveStatisticsSchema = Joi.object({
  userId: Joi.string().hex().length(24),
  academicYear: Joi.string(),
}).unknown(true);
