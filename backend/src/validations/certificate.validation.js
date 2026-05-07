/**
 * Certificate Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Create Certificate Schema
 */
exports.createCertificateSchema = Joi.object({
  certificateName: Joi.string().required().trim().min(3).max(100).messages({
    'string.empty': 'Certificate name is required',
    'string.min': 'Certificate name must be at least 3 characters',
    'string.max': 'Certificate name cannot exceed 100 characters',
  }),
  certificateType: Joi.string()
    .required()
    .valid(
      'ACADEMIC_ACHIEVEMENT',
      'PARTICIPATION',
      'CONDUCT',
      'SPORTS',
      'CULTURAL',
      'CO_CURRICULAR',
      'ACHIEVEMENT',
      'MERIT',
      'COMPLETION',
      'SPECIAL_RECOGNITION',
      'OTHER'
    ),
  description: Joi.string().trim().max(500),
  issuedFor: Joi.string()
    .required()
    .valid('STUDENTS', 'TEACHERS', 'STAFF', 'EVENTS', 'PROGRAMS', 'ALL'),
  designTemplate: Joi.object({
    templateName: Joi.string().trim(),
    logoUrl: Joi.string().uri(),
    backgroundImageUrl: Joi.string().uri(),
    borderStyle: Joi.string(),
    fontFamily: Joi.string(),
    certificateLayout: Joi.object({
      orientation: Joi.string().valid('PORTRAIT', 'LANDSCAPE'),
      width: Joi.number(),
      height: Joi.number(),
    }),
  }),
  signatories: Joi.array().items(
    Joi.object({
      name: Joi.string().trim(),
      designation: Joi.string().trim(),
      signatureImageUrl: Joi.string().uri(),
      order: Joi.number(),
    })
  ),
  validityPeriod: Joi.object({
    hasExpiry: Joi.boolean(),
    validityDays: Joi.number(),
    expiryDate: Joi.date(),
  }),
  approvalRequired: Joi.boolean(),
  approverRoles: Joi.array().items(Joi.string()),
}).unknown(false);

/**
 * Create Certificate Template Schema
 */
exports.createTemplateSchema = Joi.object({
  templateName: Joi.string().required().trim().min(3).max(100),
  description: Joi.string().trim().max(500),
  templateCategory: Joi.string()
    .required()
    .valid('ACADEMIC', 'SPORTS', 'CULTURAL', 'CO_CURRICULAR', 'PARTICIPATION', 'ACHIEVEMENT', 'SPECIAL', 'GENERAL'),
  templateDesign: Joi.object({
    orientation: Joi.string().valid('PORTRAIT', 'LANDSCAPE'),
    width: Joi.number(),
    height: Joi.number(),
    backgroundColor: Joi.string(),
    fontDefault: Joi.object({
      family: Joi.string(),
      size: Joi.number(),
      color: Joi.string(),
    }),
  }),
  elements: Joi.array().items(
    Joi.object({
      elementType: Joi.string().valid('TEXT', 'IMAGE', 'SIGNATURE', 'DATE', 'SEAL', 'LOGO', 'DIVIDER'),
      content: Joi.string(),
      position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
      }),
      size: Joi.object({
        width: Joi.number(),
        height: Joi.number(),
      }),
      styling: Joi.object({
        fontSize: Joi.number(),
        fontFamily: Joi.string(),
        color: Joi.string(),
        alignment: Joi.string().valid('LEFT', 'CENTER', 'RIGHT'),
        bold: Joi.boolean(),
        italic: Joi.boolean(),
      }),
      isVariable: Joi.boolean(),
      variableName: Joi.string(),
    })
  ),
  isPublic: Joi.boolean(),
}).unknown(false);

/**
 * Issue Certificate Schema
 */
exports.issueCertificateSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid student ID format',
    'string.length': 'Invalid student ID length',
  }),
  certificateId: Joi.string().hex().length(24).required(),
  certificateType: Joi.string()
    .required()
    .valid(
      'ACADEMIC_ACHIEVEMENT',
      'PARTICIPATION',
      'CONDUCT',
      'SPORTS',
      'CULTURAL',
      'CO_CURRICULAR',
      'ACHIEVEMENT',
      'MERIT',
      'COMPLETION',
      'SPECIAL_RECOGNITION',
      'OTHER'
    ),
  certificateContent: Joi.object({
    recipientName: Joi.string().required().trim(),
    awardReason: Joi.string().trim(),
    awardDetails: Joi.string().trim(),
    academicYear: Joi.string(),
    classOrBatch: Joi.string(),
    percentage: Joi.number().min(0).max(100),
    grade: Joi.string(),
  }).required(),
  validityDetails: Joi.object({
    issueDate: Joi.date(),
    expiryDate: Joi.date().min(Joi.ref('issueDate')),
  }),
}).unknown(false);

/**
 * Distribute Certificate Schema
 */
exports.distributeCertificateSchema = Joi.object({
  distributedMode: Joi.string()
    .required()
    .valid('PHYSICAL', 'DIGITAL', 'EMAIL', 'PORTAL', 'BOTH'),
  recipientEmail: Joi.string().email().when('distributedMode', {
    is: Joi.string().valid('DIGITAL', 'EMAIL', 'PORTAL', 'BOTH'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  digitalCertificateUrl: Joi.string().uri(),
  remarks: Joi.string().trim().max(500),
}).unknown(false);

/**
 * Create Event Schema
 */
exports.createEventSchema = Joi.object({
  eventName: Joi.string().required().trim().min(3).max(100),
  eventType: Joi.string()
    .required()
    .valid(
      'DISTRIBUTION_CEREMONY',
      'PRIZE_DISTRIBUTION',
      'AWARDS_NIGHT',
      'ASSEMBLY',
      'SPECIAL_PRESENTATION',
      'VIRTUAL_CEREMONY',
      'MAIL_DISTRIBUTION',
      'DIGITAL_DISTRIBUTION',
      'OTHER'
    ),
  eventDescription: Joi.string().trim().max(500),
  eventDate: Joi.date().required().min('now'),
  eventTime: Joi.object({
    startTime: Joi.string(),
    endTime: Joi.string(),
  }),
  eventLocation: Joi.object({
    venue: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    pincode: Joi.string(),
    isVirtual: Joi.boolean(),
    meetingLink: Joi.string().uri().when('isVirtual', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
  totalCertificatesToDistribute: Joi.number().required().min(1),
}).unknown(false);

/**
 * Register Event Attendee Schema
 */
exports.registerAttendeeSchema = Joi.object({
  attendeeId: Joi.string().hex().length(24),
  name: Joi.string().required().trim().min(2).max(100),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().regex(/^\d{10}$/),
}).unknown(false);

/**
 * Verify Certificate Schema
 */
exports.verifyCertificateSchema = Joi.object({
  verificationCode: Joi.string().required().trim().min(5),
}).unknown(false);

/**
 * List Certificates Query Schema
 */
exports.listCertificatesSchema = Joi.object({
  certificateType: Joi.string().valid(
    'ACADEMIC_ACHIEVEMENT',
    'PARTICIPATION',
    'CONDUCT',
    'SPORTS',
    'CULTURAL',
    'CO_CURRICULAR',
    'ACHIEVEMENT',
    'MERIT',
    'COMPLETION',
    'SPECIAL_RECOGNITION',
    'OTHER'
  ),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DISCONTINUED'),
  issuedFor: Joi.string().valid('STUDENTS', 'TEACHERS', 'STAFF', 'EVENTS', 'PROGRAMS', 'ALL'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Templates Query Schema
 */
exports.listTemplatesSchema = Joi.object({
  templateCategory: Joi.string().valid('ACADEMIC', 'SPORTS', 'CULTURAL', 'CO_CURRICULAR', 'PARTICIPATION', 'ACHIEVEMENT', 'SPECIAL', 'GENERAL'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Events Query Schema
 */
exports.listEventsSchema = Joi.object({
  eventType: Joi.string().valid(
    'DISTRIBUTION_CEREMONY',
    'PRIZE_DISTRIBUTION',
    'AWARDS_NIGHT',
    'ASSEMBLY',
    'SPECIAL_PRESENTATION',
    'VIRTUAL_CEREMONY',
    'MAIL_DISTRIBUTION',
    'DIGITAL_DISTRIBUTION',
    'OTHER'
  ),
  status: Joi.string().valid('PLANNING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);

/**
 * List Student Certificates Query Schema
 */
exports.listStudentCertificatesSchema = Joi.object({
  certificateType: Joi.string().valid(
    'ACADEMIC_ACHIEVEMENT',
    'PARTICIPATION',
    'CONDUCT',
    'SPORTS',
    'CULTURAL',
    'CO_CURRICULAR',
    'ACHIEVEMENT',
    'MERIT',
    'COMPLETION',
    'SPECIAL_RECOGNITION',
    'OTHER'
  ),
  status: Joi.string().valid('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ISSUED', 'DISTRIBUTED', 'REVOKED', 'REJECTED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(false);
