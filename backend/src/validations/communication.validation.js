const Joi = require('joi');

/**
 * Announcement Validations
 */
exports.createAnnouncementSchema = Joi.object().keys({
  title: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'Title is required'
  }),
  description: Joi.string().min(10).max(5000).required(),
  content: Joi.string().required(),
  category: Joi.string()
    .valid('ACADEMIC', 'EVENT', 'HOLIDAY', 'URGENT', 'NOTICE', 'ACHIEVEMENT', 'RULE_CHANGE', 'FEES', 'GENERAL')
    .default('GENERAL'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM'),
  targetAudience: Joi.string()
    .valid('ALL', 'STUDENTS', 'PARENTS', 'TEACHERS', 'STAFF', 'SPECIFIC_CLASS', 'SPECIFIC_GROUP')
    .required(),
  targetClassIds: Joi.array().items(Joi.string()),
  targetUserIds: Joi.array().items(Joi.string()),
  targetRoles: Joi.array().items(Joi.string()),
  publishedDate: Joi.date(),
  expiryDate: Joi.date(),
  attachments: Joi.array().items(
    Joi.object().keys({
      fileName: Joi.string().required(),
      fileURL: Joi.string().required(),
      fileType: Joi.string()
    })
  ),
  communicationChannels: Joi.array().items(
    Joi.string().valid('IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION')
  )
});

exports.publishAnnouncementSchema = Joi.object().keys({
  announcementId: Joi.string().required()
});

exports.announcementFilterSchema = Joi.object().keys({
  status: Joi.string().valid('DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'ARCHIVED'),
  category: Joi.string().valid('ACADEMIC', 'EVENT', 'HOLIDAY', 'URGENT', 'NOTICE', 'ACHIEVEMENT', 'RULE_CHANGE', 'FEES', 'GENERAL'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Message Validations
 */
exports.sendMessageSchema = Joi.object().keys({
  subject: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(1).required(),
  recipientType: Joi.string()
    .valid('INDIVIDUAL', 'GROUP', 'CLASS', 'ROLE', 'BROADCAST')
    .required(),
  recipients: Joi.array().items(Joi.string()).min(1).required(),
  messageType: Joi.string().valid('DIRECT', 'CONVERSATION', 'BROADCAST', 'SYSTEM_ALERT').default('DIRECT'),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').default('NORMAL'),
  category: Joi.string()
    .valid('ACADEMIC', 'ADMINISTRATIVE', 'PERSONAL', 'EMERGENCY', 'GENERAL', 'DISCIPLINARY')
    .default('GENERAL'),
  attachments: Joi.array().items(
    Joi.object().keys({
      fileName: Joi.string().required(),
      fileURL: Joi.string().required(),
      fileType: Joi.string()
    })
  ),
  communicationChannels: Joi.array().items(
    Joi.string().valid('IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION')
  )
});

exports.messageFilterSchema = Joi.object().keys({
  status: Joi.string().valid('DRAFT', 'SCHEDULED', 'SENT', 'ARCHIVED', 'DELETED'),
  messageType: Joi.string().valid('DIRECT', 'CONVERSATION', 'BROADCAST', 'SYSTEM_ALERT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Notification Validations
 */
exports.createNotificationSchema = Joi.object().keys({
  userId: Joi.string().required(),
  title: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(1).max(5000).required(),
  notificationType: Joi.string()
    .valid('ANNOUNCEMENT', 'ADMISSION', 'EXAM', 'ATTENDANCE', 'ASSIGNMENT', 'GRADE', 'FEE', 'TRANSPORT', 'HOSTEL', 'LEAVE', 'EVENT', 'ALERT', 'SYSTEM', 'OTHER')
    .required(),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'CRITICAL').default('NORMAL'),
  sourceEntityType: Joi.string()
    .valid('STUDENT', 'TEACHER', 'CLASS', 'EXAM', 'ASSIGNMENT', 'ANNOUNCEMENT', 'EVENT', 'SYSTEM'),
  sourceEntityId: Joi.string(),
  communicationChannels: Joi.array().items(
    Joi.string().valid('IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION')
  ),
  actionUrl: Joi.string(),
  expiresAt: Joi.date()
});

exports.notificationFilterSchema = Joi.object().keys({
  status: Joi.string().valid('PENDING', 'SENT', 'READ', 'ARCHIVED', 'DELETED'),
  notificationType: Joi.string()
    .valid('ANNOUNCEMENT', 'ADMISSION', 'EXAM', 'ATTENDANCE', 'ASSIGNMENT', 'GRADE', 'FEE', 'TRANSPORT', 'HOSTEL', 'LEAVE', 'EVENT', 'ALERT', 'SYSTEM', 'OTHER'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Message Template Validations
 */
exports.createMessageTemplateSchema = Joi.object().keys({
  templateName: Joi.string().min(3).max(100).required(),
  description: Joi.string(),
  templateType: Joi.string()
    .valid('EMAIL', 'SMS', 'IN_APP_MESSAGE', 'PUSH_NOTIFICATION')
    .required(),
  category: Joi.string()
    .valid('ANNOUNCEMENT', 'ASSIGNMENT', 'GRADE', 'ATTENDANCE', 'LEAVE', 'FEE', 'EVENT', 'ALERT', 'CUSTOM')
    .default('CUSTOM'),
  subject: Joi.string().max(200),
  bodyTemplate: Joi.string().required(),
  variables: Joi.array().items(
    Joi.object().keys({
      variableName: Joi.string().required(),
      displayName: Joi.string(),
      dataType: Joi.string().valid('STRING', 'NUMBER', 'DATE', 'ARRAY', 'OBJECT').default('STRING'),
      isRequired: Joi.boolean().default(false),
      defaultValue: Joi.any()
    })
  ),
  language: Joi.string().valid('EN', 'HI', 'ES', 'FR', 'DE').default('EN'),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED').default('DRAFT')
});

exports.templateFilterSchema = Joi.object().keys({
  templateType: Joi.string().valid('EMAIL', 'SMS', 'IN_APP_MESSAGE', 'PUSH_NOTIFICATION'),
  category: Joi.string()
    .valid('ANNOUNCEMENT', 'ASSIGNMENT', 'GRADE', 'ATTENDANCE', 'LEAVE', 'FEE', 'EVENT', 'ALERT', 'CUSTOM'),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Communication Preference Validations
 */
exports.updateCommunicationPreferencesSchema = Joi.object().keys({
  emailPreferences: Joi.object().keys({
    receiveEmails: Joi.boolean(),
    announcements: Joi.boolean(),
    academicUpdates: Joi.boolean(),
    assignments: Joi.boolean(),
    grades: Joi.boolean(),
    attendance: Joi.boolean(),
    fees: Joi.boolean(),
    events: Joi.boolean(),
    systemAlerts: Joi.boolean(),
    newsletter: Joi.boolean(),
    emailFrequency: Joi.string().valid('IMMEDIATE', 'DAILY', 'WEEKLY', 'MONTHLY')
  }),
  smsPreferences: Joi.object().keys({
    receiveSMS: Joi.boolean(),
    announcements: Joi.boolean(),
    academicUpdates: Joi.boolean(),
    assignments: Joi.boolean(),
    grades: Joi.boolean(),
    attendance: Joi.boolean(),
    fees: Joi.boolean(),
    events: Joi.boolean(),
    systemAlerts: Joi.boolean(),
    emergencyOnly: Joi.boolean()
  }),
  pushNotificationPreferences: Joi.object().keys({
    receiveNotifications: Joi.boolean(),
    announcements: Joi.boolean(),
    academicUpdates: Joi.boolean(),
    assignments: Joi.boolean(),
    grades: Joi.boolean(),
    attendance: Joi.boolean(),
    fees: Joi.boolean(),
    events: Joi.boolean(),
    systemAlerts: Joi.boolean(),
    soundEnabled: Joi.boolean(),
    vibrationEnabled: Joi.boolean()
  }),
  quietHours: Joi.object().keys({
    enabled: Joi.boolean(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    allowCriticalOnly: Joi.boolean()
  }),
  unsubscribedCategories: Joi.array().items(
    Joi.string().valid('ANNOUNCEMENT', 'ACADEMIC', 'ASSIGNMENT', 'GRADE', 'ATTENDANCE', 'FEE', 'EVENT', 'ALERT')
  ),
  blockedSenders: Joi.array().items(Joi.string()),
  doNotDisturb: Joi.object().keys({
    enabled: Joi.boolean(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    reason: Joi.string()
  })
});

module.exports = exports;
