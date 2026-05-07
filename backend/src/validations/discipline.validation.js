const Joi = require('joi');

// Incident reporting schema
exports.reportIncidentSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  incidentType: Joi.string()
    .valid(
      'PHYSICAL_VIOLENCE',
      'BULLYING',
      'VERBAL_ABUSE',
      'SUBSTANCE_ABUSE',
      'ACADEMIC_MISCONDUCT',
      'PROPERTY_DAMAGE',
      'THEFT',
      'TRUANCY',
      'DISRUPTIVE_BEHAVIOR',
      'HARASSMENT',
      'INSUBORDINATION',
      'DRESS_CODE_VIOLATION',
      'MOBILE_PHONE_MISUSE',
      'LATE_ARRIVAL',
      'ABSENCE_WITHOUT_LEAVE',
      'VANDALISM',
      'INAPPROPRIATE_CONDUCT',
      'OTHER'
    )
    .required(),
  severity: Joi.string().valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL').required(),
  incidentDate: Joi.date().iso().required(),
  incidentTime: Joi.string(),
  incidentLocation: Joi.string()
    .valid('CLASSROOM', 'CORRIDOR', 'PLAYGROUND', 'CAFETERIA', 'RESTROOM', 'DORMITORY', 'TRANSPORT', 'GATE', 'OFFICE', 'OTHER')
    .required(),
  description: Joi.string().trim().required(),
  witnesses: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      contact: Joi.string(),
      statement: Joi.string()
    })
  ),
  involvedStudents: Joi.array().items(Joi.string().hex().length(24)),
  involvedStaff: Joi.array().items(Joi.string().hex().length(24)),
  injuriesReported: Joi.boolean(),
  injuryDetails: Joi.object({
    description: Joi.string(),
    severity: Joi.string().valid('MINOR', 'MODERATE', 'SEVERE'),
    medicalAttention: Joi.boolean(),
    hospitalAdmitted: Joi.boolean()
  }),
  propertyDamage: Joi.boolean(),
  damageDetails: Joi.object({
    description: Joi.string(),
    estimatedCost: Joi.number().min(0),
    itemsDamaged: Joi.array().items(Joi.string())
  })
}).required();

// Update incident schema
exports.updateIncidentSchema = Joi.object({
  investigationStatus: Joi.string().valid('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PENDING_REVIEW'),
  investigatedBy: Joi.string().hex().length(24),
  investigationNotes: Joi.string(),
  investigationDate: Joi.date().iso(),
  evidenceCollected: Joi.boolean(),
  evidence: Joi.array().items(
    Joi.object({
      type: Joi.string(),
      description: Joi.string(),
      fileUrl: Joi.string().uri()
    })
  ),
  findings: Joi.string(),
  responsibilityConfirmed: Joi.boolean(),
  status: Joi.string().valid('REPORTED', 'UNDER_INVESTIGATION', 'AWAITING_DECISION', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'APPEALED'),
  parentNotified: Joi.boolean(),
  parentNotificationMethod: Joi.string().valid('PHONE', 'EMAIL', 'IN_PERSON', 'SMS', 'LETTER'),
  policeInvolved: Joi.boolean(),
  policeReportNumber: Joi.string(),
  policeReportDate: Joi.date().iso()
}).min(1).required();

// Discipline record schema
exports.createDisciplineRecordSchema = Joi.object({
  incidentId: Joi.string().hex().length(24),
  offenseCategory: Joi.string()
    .valid('ACADEMIC', 'BEHAVIORAL', 'ATTENDANCE', 'DRESS_CODE', 'CONDUCT', 'VIOLENCE', 'SUBSTANCE', 'PROPERTY', 'OTHER')
    .required(),
  offenseDescription: Joi.string().trim().required(),
  frequency: Joi.number().min(1),
  severity: Joi.string().valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL').required(),
  circumstances: Joi.string(),
  contributingFactors: Joi.array().items(Joi.string()),
  studentStatement: Joi.string(),
  admittedGuilt: Joi.boolean(),
  admissionDetails: Joi.string(),
  academicPerformance: Joi.string().valid('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'FAILING'),
  behavioralHistory: Joi.string().valid('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'),
  homeCircumstances: Joi.string(),
  socialBackground: Joi.string(),
  recommendedAction: Joi.array().items(
    Joi.string().valid(
      'VERBAL_WARNING',
      'WRITTEN_WARNING',
      'DETENTION',
      'SUSPENSION',
      'EXPULSION',
      'COUNSELING',
      'COMMUNITY_SERVICE',
      'GRADE_REDUCTION',
      'RESTITUTION',
      'BEHAVIOR_CONTRACT',
      'MONITORING'
    )
  ),
  recommendationNotes: Joi.string(),
  mitigatingFactors: Joi.array().items(Joi.string()),
  counselingRequired: Joi.boolean(),
  mentalHealthConcerns: Joi.string()
}).required();

// Approve discipline record schema
exports.approveDisciplineRecordSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED', 'DISMISSED', 'UNDER_APPEAL').required(),
  approvalReason: Joi.string(),
  reviewNotes: Joi.string()
}).required();

// Disciplinary action schema
exports.issueDisciplinaryActionSchema = Joi.object({
  actionType: Joi.string()
    .valid(
      'VERBAL_WARNING',
      'WRITTEN_WARNING',
      'DETENTION',
      'SUSPENSION',
      'EXPULSION',
      'COUNSELING',
      'COMMUNITY_SERVICE',
      'GRADE_REDUCTION',
      'RESTITUTION',
      'BEHAVIOR_CONTRACT',
      'ACADEMIC_PROBATION',
      'PARENT_MEETING',
      'MONITORING',
      'RESTRICTION',
      'REMOVAL_FROM_EVENT',
      'OTHER'
    )
    .required(),
  actionDescription: Joi.string().trim().required(),
  severity: Joi.string().valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL').required(),
  duration: Joi.object({
    value: Joi.number().min(1),
    unit: Joi.string().valid('DAYS', 'WEEKS', 'MONTHS', 'PERMANENT')
  }),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  conditions: Joi.array().items(
    Joi.object({
      condition: Joi.string(),
      isMet: Joi.boolean()
    })
  ),
  detentionDetails: Joi.object({
    date: Joi.date().iso(),
    duration: Joi.number().min(1),
    location: Joi.string(),
    supervisingOfficer: Joi.string().hex().length(24)
  }),
  suspensionDetails: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    daysCount: Joi.number().min(1),
    reason: Joi.string(),
    canApply: Joi.boolean()
  }),
  expulsionDetails: Joi.object({
    effectiveDate: Joi.date().iso(),
    permanent: Joi.boolean(),
    appealPossible: Joi.boolean(),
    appealDeadline: Joi.date().iso()
  }),
  communityServiceDetails: Joi.object({
    hours: Joi.number().min(1),
    activity: Joi.string(),
    supervisor: Joi.string(),
    location: Joi.string()
  }),
  counselingDetails: Joi.object({
    counselor: Joi.string().hex().length(24),
    sessions: Joi.number().min(1),
    startDate: Joi.date().iso(),
    topics: Joi.array().items(Joi.string())
  }),
  gradeReductionDetails: Joi.object({
    subject: Joi.string(),
    percentage: Joi.number().min(1).max(100),
    assignment: Joi.string(),
    assessmentType: Joi.string()
  }),
  restitutionDetails: Joi.object({
    amount: Joi.number().min(0),
    itemsToReplace: Joi.array().items(Joi.string()),
    deadline: Joi.date().iso()
  }),
  behaviorContractDetails: Joi.object({
    contractDate: Joi.date().iso(),
    expectations: Joi.array().items(Joi.string()),
    reviewFrequency: Joi.string()
  })
}).required();

// Update action schema
exports.updateDisciplinaryActionSchema = Joi.object({
  status: Joi.string().valid('ISSUED', 'ACTIVE', 'SERVING', 'SERVED', 'COMPLETED', 'CANCELLED', 'UNDER_APPEAL', 'APPEALED'),
  isCompliant: Joi.boolean(),
  complianceNotes: Joi.string(),
  complianceVerificationDate: Joi.date().iso(),
  parentNotified: Joi.boolean(),
  parentAcknowledged: Joi.boolean(),
  studentAcknowledged: Joi.boolean(),
  effectiveness: Joi.string().valid('VERY_EFFECTIVE', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_ASSESSED'),
  effectivenessNotes: Joi.string()
}).min(1).required();

// Complete action schema
exports.completeActionSchema = Joi.object({
  evidence: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      date: Joi.date().iso().required(),
      verifiedBy: Joi.string().hex().length(24),
      attachments: Joi.array().items(Joi.string().uri())
    })
  ),
  effectiveness: Joi.string().valid('VERY_EFFECTIVE', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_ASSESSED')
}).required();

// Appeal action schema
exports.appealActionSchema = Joi.object({
  appealedBy: Joi.string().valid('STUDENT', 'PARENT', 'GUARDIAN').required(),
  reason: Joi.string().trim().required()
}).required();

// Filters schema
exports.incidentsFiltersSchema = Joi.object({
  status: Joi.string().valid('REPORTED', 'UNDER_INVESTIGATION', 'AWAITING_DECISION', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'APPEALED'),
  incidentType: Joi.string(),
  severity: Joi.string().valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.recordsFiltersSchema = Joi.object({
  status: Joi.string().valid('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DISMISSED', 'UNDER_APPEAL'),
  offenseCategory: Joi.string(),
  severity: Joi.string().valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.actionsFiltersSchema = Joi.object({
  status: Joi.string().valid('ISSUED', 'ACTIVE', 'SERVING', 'SERVED', 'COMPLETED', 'CANCELLED', 'UNDER_APPEAL', 'APPEALED'),
  actionType: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

module.exports = exports;
