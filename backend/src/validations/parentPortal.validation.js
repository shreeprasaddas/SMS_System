/**
 * Parent Portal Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Schema: Update parent profile
 */
exports.updateParentProfileSchema = Joi.object({
  parentType: Joi.string().valid('MOTHER', 'FATHER', 'GUARDIAN', 'STEPPARENT', 'OTHER'),
  contactInfo: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    alternatePhone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/),
    country: Joi.string(),
  }),
  workInfo: Joi.object({
    occupation: Joi.string(),
    company: Joi.string(),
    designation: Joi.string(),
    workPhone: Joi.string(),
    workEmail: Joi.string().email(),
  }),
  emergencyContact: Joi.object({
    name: Joi.string(),
    relationship: Joi.string(),
    phoneNumber: Joi.string(),
    email: Joi.string().email(),
  }),
  communicationPreferences: Joi.object({
    emailNotifications: Joi.boolean(),
    smsNotifications: Joi.boolean(),
    inAppNotifications: Joi.boolean(),
    pushNotifications: Joi.boolean(),
    notificationFrequency: Joi.string().valid('IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST'),
    preferredLanguage: Joi.string(),
  }),
}).unknown(false);

/**
 * Schema: Get progress reports (query validation)
 */
exports.getProgressReportsSchema = Joi.object({
  academicYear: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get fee statements (query validation)
 */
exports.getFeeStatementsSchema = Joi.object({
  paymentStatus: Joi.string().valid('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE', 'WAIVED'),
  academicYear: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Send message to teacher
 */
exports.sendMessageSchema = Joi.object({
  communicationId: Joi.string().hex().length(24).required(),
  message: Joi.string().min(1).max(5000).required(),
  attachments: Joi.array().items(
    Joi.object({
      fileName: Joi.string(),
      fileUrl: Joi.string(),
    })
  ),
}).unknown(false);

/**
 * Schema: Request teacher appointment
 */
exports.requestAppointmentSchema = Joi.object({
  communicationId: Joi.string().hex().length(24).required(),
  preferredDateTime: Joi.date().required(),
  purpose: Joi.string().required(),
  appointmentType: Joi.string().valid('IN_PERSON', 'VIRTUAL', 'PHONE'),
  notes: Joi.string(),
}).unknown(false);

/**
 * Schema: Mark notification as read
 */
exports.markNotificationAsReadSchema = Joi.object({
  notificationId: Joi.string().hex().length(24).required(),
}).unknown(false);

/**
 * Schema: Get communications (query validation)
 */
exports.getCommunicationsSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'ARCHIVED', 'RESOLVED', 'CLOSED').default('ACTIVE'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get notifications (query validation)
 */
exports.getNotificationsSchema = Joi.object({
  notificationType: Joi.string().valid(
    'GRADE_UPDATE',
    'ATTENDANCE_ALERT',
    'FEE_REMINDER',
    'EVENT_ANNOUNCEMENT',
    'TEACHER_MESSAGE',
    'SUSPENSION',
    'ACHIEVEMENT',
    'BEHAVIORAL_UPDATE',
    'EXAM_SCHEDULE',
    'RESULT_PUBLISHED',
    'HOLIDAY_ANNOUNCEMENT',
    'GENERAL_ANNOUNCEMENT'
  ),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get unread notifications (query validation)
 */
exports.getUnreadNotificationsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Add child association
 */
exports.addChildAssociationSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  relationshipType: Joi.string()
    .valid('BIOLOGICAL', 'STEP', 'GUARDIAN', 'ADOPTIVE')
    .required(),
}).unknown(false);

/**
 * Schema: Update communication preferences
 */
exports.updateCommunicationPreferencesSchema = Joi.object({
  emailNotifications: Joi.boolean(),
  smsNotifications: Joi.boolean(),
  inAppNotifications: Joi.boolean(),
  pushNotifications: Joi.boolean(),
  notificationFrequency: Joi.string().valid('IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST'),
  preferredLanguage: Joi.string(),
}).unknown(false);

/**
 * Schema: Create initial communication with teacher
 */
exports.initiateCommunicationSchema = Joi.object({
  teacherId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24),
  subject: Joi.string().required(),
  communicationType: Joi.string()
    .valid('TEXT_MESSAGE', 'EMAIL', 'APPOINTMENT_REQUEST', 'FEEDBACK', 'COMPLAINT', 'GENERAL_INQUIRY')
    .required(),
  messageContent: Joi.string().required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  category: Joi.string()
    .valid('ACADEMIC', 'BEHAVIORAL', 'HEALTH', 'FINANCIAL', 'GENERAL', 'OTHER'),
}).unknown(false);
