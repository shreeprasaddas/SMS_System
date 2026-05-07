const Joi = require('joi');

// ============== ADMISSION CYCLE SCHEMAS ==============

exports.createAdmissionCycleSchema = Joi.object({
  cycleName: Joi.string().trim().required(),
  academicYear: Joi.string().required(),
  classesOffering: Joi.array()
    .items(
      Joi.object({
        classId: Joi.string().hex().length(24).required(),
        totalSeats: Joi.number().min(1).required(),
        reservedSeatsOBC: Joi.number().min(0),
        reservedSeatsSC: Joi.number().min(0),
        reservedSeatsST: Joi.number().min(0),
        reservedSeatsMinority: Joi.number().min(0),
        reservedSeatsPWD: Joi.number().min(0),
        meritBasedSeats: Joi.number().min(0).required(),
        feeAmount: Joi.number().min(0).required(),
        cutoffMarks: Joi.number()
      })
    )
    .required(),
  eligibilityCriteria: Joi.object({
    minimumAge: Joi.number(),
    maximumAge: Joi.number(),
    minimumMarks: Joi.number(),
    qualifyingExams: Joi.array().items(Joi.string()),
    boardAffiliation: Joi.array().items(Joi.string()),
    specialRequirements: Joi.string()
  }),
  applicationStartDate: Joi.date().iso().required(),
  applicationEndDate: Joi.date().iso().required(),
  documentSubmissionDeadline: Joi.date().iso(),
  admissionTestDate: Joi.date().iso(),
  meritListPublishDate: Joi.date().iso(),
  admissionFeeSubmissionDeadline: Joi.date().iso(),
  admissionStartDate: Joi.date().iso(),
  admissionEndDate: Joi.date().iso(),
  admissionMode: Joi.string().valid('MERIT_BASED', 'ENTRANCE_TEST', 'MANAGEMENT_QUOTA', 'COMBINED'),
  prospectusURL: Joi.string().uri(),
  description: Joi.string().trim()
}).required();

// ============== APPLICATION SCHEMAS ==============

exports.createApplicationSchema = Joi.object({
  admissionCycleId: Joi.string().hex().length(24).required(),
  applicationFormId: Joi.string().hex().length(24).required(),
  applicantName: Joi.object({
    firstName: Joi.string().trim().required(),
    middleName: Joi.string().trim(),
    lastName: Joi.string().trim().required()
  }).required(),
  dateOfBirth: Joi.date().iso().required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  category: Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD'),
  contactInformation: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    alternatePhone: Joi.string(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string()
    })
  }).required(),
  parentInformation: Joi.object({
    fatherName: Joi.string(),
    fatherOccupation: Joi.string(),
    fatherPhone: Joi.string(),
    motherName: Joi.string(),
    motherOccupation: Joi.string(),
    motherPhone: Joi.string(),
    parentEmail: Joi.string().email(),
    parentAddress: Joi.object()
  }),
  academicInformation: Joi.object({
    previousSchool: Joi.string(),
    previousSchoolBoard: Joi.string(),
    lastClassMarks: Joi.number(),
    lastClassPercentage: Joi.number(),
    lastClassGrade: Joi.string(),
    qualifyingExam: Joi.string(),
    qualifyingExamMarks: Joi.number(),
    qualifyingExamPercentage: Joi.number(),
    qualifyingExamRank: Joi.string()
  }),
  appliedClasses: Joi.array()
    .items(
      Joi.object({
        classId: Joi.string().hex().length(24).required(),
        priority: Joi.number().min(1).max(5),
        seatType: Joi.string().valid('MERIT_BASED', 'RESERVED_OBC', 'RESERVED_SC', 'RESERVED_ST', 'RESERVED_MINORITY', 'RESERVED_PWD', 'MANAGEMENT_QUOTA')
      })
    )
    .required(),
  formDataSubmitted: Joi.object()
}).required();

exports.submitApplicationSchema = Joi.object({
  applicationStatus: Joi.string().valid('SUBMITTED')
}).required();

// ============== APPLICATION FORM SCHEMAS ==============

exports.createApplicationFormSchema = Joi.object({
  admissionCycleId: Joi.string().hex().length(24).required(),
  formName: Joi.string().trim().required(),
  description: Joi.string().trim(),
  formType: Joi.string().valid('ONLINE', 'OFFLINE', 'HYBRID'),
  applicableClasses: Joi.array().items(Joi.string().hex().length(24)),
  applicableCategories: Joi.array().items(Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD')),
  fields: Joi.array().items(
    Joi.object({
      fieldName: Joi.string().required(),
      fieldType: Joi.string()
        .valid('TEXT', 'EMAIL', 'PHONE', 'DATE', 'NUMBER', 'SELECT', 'CHECKBOX', 'TEXTAREA', 'FILE', 'RADIO', 'MULTISELECT')
        .required(),
      label: Joi.string(),
      placeholder: Joi.string(),
      helpText: Joi.string(),
      required: Joi.boolean(),
      options: Joi.array().items(
        Joi.object({
          optionLabel: Joi.string(),
          optionValue: Joi.string()
        })
      ),
      section: Joi.string().valid('PERSONAL', 'CONTACT', 'ACADEMIC', 'PARENT', 'ADDITIONAL', 'DOCUMENTS')
    })
  ),
  documentRequirements: Joi.array().items(
    Joi.object({
      documentType: Joi.string(),
      isMandatory: Joi.boolean(),
      allowedFormats: Joi.array().items(Joi.string()),
      maxFileSize: Joi.number(),
      comment: Joi.string()
    })
  ),
  termsAndConditions: Joi.object({
    content: Joi.string().required(),
    acceptanceRequired: Joi.boolean()
  }),
  privacyPolicy: Joi.object({
    content: Joi.string().required(),
    acceptanceRequired: Joi.boolean()
  })
}).required();

// ============== DOCUMENT VERIFICATION SCHEMAS ==============

exports.createDocVerificationSchema = Joi.object({
  applicationId: Joi.string().hex().length(24).required(),
  admissionCycleId: Joi.string().hex().length(24).required(),
  applicantName: Joi.string().required(),
  documents: Joi.array()
    .items(
      Joi.object({
        documentType: Joi.string()
          .valid(
            'BIRTH_CERTIFICATE',
            'SCHOOL_CERTIFICATE',
            'MARK_SHEET',
            'TRANSFER_CERTIFICATE',
            'CASTE_CERTIFICATE',
            'INCOME_CERTIFICATE',
            'DISABILITY_CERTIFICATE',
            'ADMISSION_LETTER',
            'AADHAR',
            'PASSPORT',
            'OTHER'
          )
          .required(),
        isMandatory: Joi.boolean(),
        fileURL: Joi.string().uri().required()
      })
    )
    .required()
}).required();

exports.verifyDocumentSchema = Joi.object({
  status: Joi.string().valid('VERIFIED', 'REJECTED', 'RESUBMIT_REQUIRED').required(),
  notes: Joi.string()
}).required();

// ============== MERIT LIST SCHEMAS ==============

exports.createMeritListSchema = Joi.object({
  admissionCycleId: Joi.string().hex().length(24).required(),
  meritListName: Joi.string().trim().required(),
  meritListType: Joi.string()
    .valid('OVERALL', 'CATEGORY_WISE', 'CLASS_WISE', 'TEST_BASED', 'INTERVIEW_BASED')
    .required(),
  forClass: Joi.string().hex().length(24),
  forCategory: Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD', 'ALL'),
  candidates: Joi.array()
    .items(
      Joi.object({
        applicationId: Joi.string().hex().length(24).required(),
        applicantName: Joi.string().required(),
        meritRank: Joi.number().required(),
        score: Joi.number()
      })
    )
    .required(),
  meritCriteria: Joi.object({
    weightage: Joi.object({
      academicMarks: Joi.number().min(0).max(100),
      testMarks: Joi.number().min(0).max(100),
      interviewMarks: Joi.number().min(0).max(100)
    }),
    cutoffMarks: Joi.number()
  }),
  roundNumber: Joi.number().min(1)
}).required();

exports.publishMeritListSchema = Joi.object({
  status: Joi.string().valid('PUBLISHED')
}).required();

exports.finalizeMeritListSchema = Joi.object({
  isFinal: Joi.boolean().valid(true).required()
}).required();

// ============== FILTER SCHEMAS ==============

exports.admissionCycleFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'ANNOUNCED', 'ONGOING', 'CLOSED', 'COMPLETED', 'CANCELLED', 'ARCHIVED'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.applicationFiltersSchema = Joi.object({
  status: Joi.string()
    .valid('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN', 'ADMITTED'),
  cycleId: Joi.string().hex().length(24),
  category: Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.applicationFormFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'ARCHIVED'),
  cycleId: Joi.string().hex().length(24),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.docVerificationFiltersSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PARTIAL', 'VERIFIED', 'REJECTED', 'INCOMPLETE'),
  cycleId: Joi.string().hex().length(24),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.meritListFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ACTIVE', 'APPEAL_OPEN', 'FINAL', 'ARCHIVED'),
  cycleId: Joi.string().hex().length(24),
  type: Joi.string().valid('OVERALL', 'CATEGORY_WISE', 'CLASS_WISE', 'TEST_BASED', 'INTERVIEW_BASED'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

module.exports = exports;
