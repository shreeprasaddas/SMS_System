/**
 * Notice & Circular Management Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Schema: Create notice
 */
exports.createNoticeSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).required(),
  circularType: Joi.string()
    .valid('NOTICE', 'CIRCULAR', 'ANNOUNCEMENT', 'URGENT', 'HOLIDAY', 'EVENT', 'ADMISSION', 'ACADEMIC', 'ADMINISTRATIVE', 'TRANSPORTATION', 'HOSTEL')
    .required(),
  effectiveDate: Joi.date(),
  expiryDate: Joi.date(),
  recipients: Joi.array().items(
    Joi.object({
      recipientType: Joi.string().valid('ALL', 'ROLE_BASED', 'CLASS_BASED', 'INDIVIDUAL'),
      roleId: Joi.string().hex().length(24),
      classId: Joi.string().hex().length(24),
      userId: Joi.string().hex().length(24),
    })
  ),
  priority: Joi.string().valid('URGENT', 'HIGH', 'NORMAL', 'LOW'),
  acknowledgmentRequired: Joi.boolean(),
}).unknown(false);

/**
 * Schema: Update notice
 */
exports.updateNoticeSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  description: Joi.string().min(10),
  effectiveDate: Joi.date(),
  expiryDate: Joi.date(),
  priority: Joi.string().valid('URGENT', 'HIGH', 'NORMAL', 'LOW'),
  acknowledgmentRequired: Joi.boolean(),
}).unknown(false);

/**
 * Schema: Publish notice
 */
exports.publishNoticeSchema = Joi.object({
  noticeId: Joi.string().hex().length(24).required(),
}).unknown(false);

/**
 * Schema: Get notices (query validation)
 */
exports.getNoticesSchema = Joi.object({
  circularType: Joi.string()
    .valid('NOTICE', 'CIRCULAR', 'ANNOUNCEMENT', 'URGENT', 'HOLIDAY', 'EVENT', 'ADMISSION', 'ACADEMIC', 'ADMINISTRATIVE', 'TRANSPORTATION', 'HOSTEL'),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'),
  priority: Joi.string().valid('URGENT', 'HIGH', 'NORMAL', 'LOW'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Create template
 */
exports.createTemplateSchema = Joi.object({
  templateName: Joi.string().min(5).max(200).required(),
  description: Joi.string(),
  circularType: Joi.string()
    .valid('NOTICE', 'CIRCULAR', 'ANNOUNCEMENT', 'URGENT', 'HOLIDAY', 'EVENT', 'ADMISSION', 'ACADEMIC', 'ADMINISTRATIVE', 'TRANSPORTATION', 'HOSTEL')
    .required(),
  templateContent: Joi.string().min(10).required(),
  placeholders: Joi.array().items(
    Joi.object({
      placeholderName: Joi.string().required(),
      description: Joi.string(),
      dataType: Joi.string(),
      defaultValue: Joi.string(),
    })
  ),
}).unknown(false);

/**
 * Schema: Get templates (query validation)
 */
exports.getTemplatesSchema = Joi.object({
  circularType: Joi.string()
    .valid('NOTICE', 'CIRCULAR', 'ANNOUNCEMENT', 'URGENT', 'HOLIDAY', 'EVENT', 'ADMISSION', 'ACADEMIC', 'ADMINISTRATIVE', 'TRANSPORTATION', 'HOSTEL'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Create acknowledgment
 */
exports.createAcknowledgmentSchema = Joi.object({
  noticeId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  remarks: Joi.string().max(500),
}).unknown(false);

/**
 * Schema: Get acknowledgments (query validation)
 */
exports.getAcknowledgmentsSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'ACKNOWLEDGED', 'OVERDUE'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Upload attachment
 */
exports.uploadAttachmentSchema = Joi.object({
  noticeId: Joi.string().hex().length(24).required(),
  fileName: Joi.string().required(),
  filePath: Joi.string().required(),
  documentType: Joi.string()
    .valid('PDF', 'IMAGE', 'VIDEO', 'DOCUMENT', 'SPREADSHEET', 'OTHER')
    .required(),
  accessLevel: Joi.string().valid('PUBLIC', 'RESTRICTED', 'CONFIDENTIAL'),
  expiryDate: Joi.date(),
}).unknown(false);

/**
 * Schema: Create distribution
 */
exports.createDistributionSchema = Joi.object({
  noticeId: Joi.string().hex().length(24).required(),
  distributionStrategy: Joi.string()
    .valid('IMMEDIATE', 'SCHEDULED', 'BATCH', 'SELECTIVE')
    .required(),
  recipientGroups: Joi.array().items(
    Joi.object({
      groupType: Joi.string().valid('ROLE', 'CLASS', 'SECTION', 'INDIVIDUAL', 'ALL'),
      groupId: Joi.string().hex().length(24),
      groupName: Joi.string(),
      totalRecipients: Joi.number(),
    })
  ),
  scheduledDate: Joi.date(),
  scheduledTime: Joi.string(),
  deliveryMethods: Joi.array().items(
    Joi.object({
      method: Joi.string().valid('EMAIL', 'SMS', 'IN_APP', 'PORTAL', 'PRINT'),
      enabled: Joi.boolean(),
    })
  ),
}).unknown(false);

/**
 * Schema: Get pending acknowledgments (query validation)
 */
exports.getPendingAcknowledgmentsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get notice statistics (query validation)
 */
exports.getNoticeStatisticsSchema = Joi.object({
  circularType: Joi.string()
    .valid('NOTICE', 'CIRCULAR', 'ANNOUNCEMENT', 'URGENT', 'HOLIDAY', 'EVENT', 'ADMISSION', 'ACADEMIC', 'ADMINISTRATIVE', 'TRANSPORTATION', 'HOSTEL'),
}).unknown(true);
