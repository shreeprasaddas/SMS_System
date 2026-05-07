const Joi = require('joi');

const createProgramSchema = Joi.object({
  programName: Joi.string().min(5).max(200).required(),
  programType: Joi.string()
    .valid('WORKSHOP', 'TRAINING_COURSE', 'CERTIFICATION', 'SEMINAR', 'CONFERENCE', 'ONLINE_COURSE', 'IN_HOUSE_TRAINING', 'MENTORING')
    .required(),
  programCategory: Joi.string()
    .valid('SUBJECT_MATTER_EXPERTISE', 'PEDAGOGICAL_SKILLS', 'TECHNOLOGY', 'LEADERSHIP', 'SOFT_SKILLS', 'HEALTH_SAFETY', 'COMPLIANCE', 'PERSONAL_DEVELOPMENT')
    .required(),
  description: Joi.string().min(10).required(),
  objectives: Joi.array().items(Joi.string()).optional(),
  targetAudience: Joi.array().items(Joi.string()),
  provider: Joi.string().valid('INTERNAL', 'EXTERNAL', 'GOVERNMENT', 'NGO', 'PARTNER_INSTITUTION').required(),
  duration: Joi.object({
    durationValue: Joi.number().required(),
    durationUnit: Joi.string().valid('HOURS', 'DAYS', 'WEEKS', 'MONTHS').required(),
  }).required(),
  schedule: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    location: Joi.string().valid('SCHOOL', 'EXTERNAL', 'ONLINE', 'HYBRID').required(),
    venue: Joi.string(),
  }).required(),
  capacity: Joi.object({
    maxParticipants: Joi.number().required(),
  }),
});

const getProgramsSchema = Joi.object({
  programType: Joi.string().valid('WORKSHOP', 'TRAINING_COURSE', 'CERTIFICATION', 'SEMINAR', 'CONFERENCE', 'ONLINE_COURSE', 'IN_HOUSE_TRAINING', 'MENTORING'),
  programCategory: Joi.string().valid('SUBJECT_MATTER_EXPERTISE', 'PEDAGOGICAL_SKILLS', 'TECHNOLOGY', 'LEADERSHIP', 'SOFT_SKILLS', 'HEALTH_SAFETY', 'COMPLIANCE', 'PERSONAL_DEVELOPMENT'),
  status: Joi.string().valid('PLANNING', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const enrollEmployeeSchema = Joi.object({
  programId: Joi.string().length(24).hex().required(),
  employeeId: Joi.string().length(24).hex().required(),
  employeeName: Joi.string(),
  employeeDesignation: Joi.string(),
  enrollmentDate: Joi.date().required(),
});

const getEmployeeTrainingSchema = Joi.object({
  enrollmentStatus: Joi.string().valid('REGISTERED', 'CONFIRMED', 'ATTENDED', 'COMPLETED', 'WITHDRAWN', 'CANCELLED'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const updateTrainingStatusSchema = Joi.object({
  enrollmentStatus: Joi.string().valid('REGISTERED', 'CONFIRMED', 'ATTENDED', 'COMPLETED', 'WITHDRAWN', 'CANCELLED'),
  attendance: Joi.object({
    sessionsAttended: Joi.number(),
    totalSessions: Joi.number(),
    attendancePercentage: Joi.number().min(0).max(100),
  }),
  performance: Joi.object({
    assessmentScore: Joi.number().min(0).max(100),
    assessmentStatus: Joi.string().valid('NOT_ASSESSED', 'PASSED', 'FAILED', 'PENDING'),
    assessmentDate: Joi.date(),
  }),
});

const createCertificationSchema = Joi.object({
  employeeId: Joi.string().length(24).hex().required(),
  certificationName: Joi.string().required(),
  certificationType: Joi.string()
    .valid('ACADEMIC_DEGREE', 'PROFESSIONAL_CERTIFICATION', 'SKILL_CERTIFICATION', 'LANGUAGE_PROFICIENCY', 'TECHNICAL_CERTIFICATION', 'SOFT_SKILLS', 'SPECIALIZED_TRAINING')
    .required(),
  certificateNumber: Joi.string().required(),
  issuingBody: Joi.string().required(),
  issueDate: Joi.date().required(),
  expiryDate: Joi.date(),
});

const getStaffCertificationsSchema = Joi.object({
  certificationType: Joi.string().valid('ACADEMIC_DEGREE', 'PROFESSIONAL_CERTIFICATION', 'SKILL_CERTIFICATION', 'LANGUAGE_PROFICIENCY', 'TECHNICAL_CERTIFICATION', 'SOFT_SKILLS', 'SPECIALIZED_TRAINING'),
  validityStatus: Joi.string().valid('ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'RENEWED'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createSkillAssessmentSchema = Joi.object({
  employeeId: Joi.string().length(24).hex().required(),
  assessmentDate: Joi.date().required(),
  assessmentType: Joi.string()
    .valid('SELF_ASSESSMENT', 'PEER_ASSESSMENT', 'MANAGER_ASSESSMENT', 'TRAINING_BASED', 'PERFORMANCE_BASED', 'ANNUAL_APPRAISAL')
    .required(),
  academicYear: Joi.string().required(),
  technicalSkills: Joi.array().items(
    Joi.object({
      skillName: Joi.string(),
      currentLevel: Joi.number().min(1).max(5),
      targetLevel: Joi.number().min(1).max(5),
    })
  ),
  pedagogicalSkills: Joi.array().items(
    Joi.object({
      skillName: Joi.string(),
      currentLevel: Joi.number().min(1).max(5),
    })
  ),
});

const getSkillAssessmentsSchema = Joi.object({
  assessmentType: Joi.string().valid('SELF_ASSESSMENT', 'PEER_ASSESSMENT', 'MANAGER_ASSESSMENT', 'TRAINING_BASED', 'PERFORMANCE_BASED', 'ANNUAL_APPRAISAL'),
  academicYear: Joi.string(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

const createProviderSchema = Joi.object({
  providerName: Joi.string().required(),
  providerType: Joi.string()
    .valid('GOVERNMENT_AGENCY', 'PRIVATE_INSTITUTION', 'NGO', 'UNIVERSITY', 'ONLINE_PLATFORM', 'CONSULTANT', 'PROFESSIONAL_BODY', 'INTERNAL')
    .required(),
  contactDetails: Joi.object({
    primaryContactPerson: Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
    }),
  }),
  specializations: Joi.array().items(Joi.string()),
  pricing: Joi.object({
    baseCostPerParticipant: Joi.number(),
  }),
});

const getProvidersSchema = Joi.object({
  providerType: Joi.string().valid('GOVERNMENT_AGENCY', 'PRIVATE_INSTITUTION', 'NGO', 'UNIVERSITY', 'ONLINE_PLATFORM', 'CONSULTANT', 'PROFESSIONAL_BODY', 'INTERNAL'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED'),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().default(10).min(1).max(100),
});

module.exports = {
  createProgramSchema,
  getProgramsSchema,
  enrollEmployeeSchema,
  getEmployeeTrainingSchema,
  updateTrainingStatusSchema,
  createCertificationSchema,
  getStaffCertificationsSchema,
  createSkillAssessmentSchema,
  getSkillAssessmentsSchema,
  createProviderSchema,
  getProvidersSchema,
};
