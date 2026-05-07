/**
 * Academic Validation
 * Joi schemas for academic management endpoints
 */

const Joi = require('joi');

// ============================================================
// ACADEMIC YEAR SCHEMAS
// ============================================================

const createAcademicYearSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().trim().uppercase(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  terms: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required().greater(Joi.ref('startDate')),
      examStartDate: Joi.date(),
      examEndDate: Joi.date(),
    })
  ),
  holidays: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      description: Joi.string(),
    })
  ),
});

const updateAcademicYearSchema = Joi.object({
  name: Joi.string().trim(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  terms: Joi.array().items(Joi.object()),
  holidays: Joi.array().items(Joi.object()),
  status: Joi.string().valid('PLANNING', 'ACTIVE', 'CLOSED', 'ARCHIVED'),
}).min(1);

// ============================================================
// STREAM SCHEMAS
// ============================================================

const createStreamSchema = Joi.object({
  name: Joi.string().valid('SCIENCE', 'COMMERCE', 'ARTS', 'VOCATIONAL', 'GENERAL').required(),
  code: Joi.string().required().trim().uppercase(),
  description: Joi.string(),
  subjects: Joi.array().items(Joi.string()),
});

const updateStreamSchema = Joi.object({
  name: Joi.string().valid('SCIENCE', 'COMMERCE', 'ARTS', 'VOCATIONAL', 'GENERAL'),
  description: Joi.string(),
  subjects: Joi.array().items(Joi.string()),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

// ============================================================
// SECTION SCHEMAS
// ============================================================

const createSectionSchema = Joi.object({
  name: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H').required(),
  code: Joi.string().required().trim().uppercase(),
  description: Joi.string(),
  capacity: Joi.number().integer().min(1).max(100).default(50),
});

const updateSectionSchema = Joi.object({
  description: Joi.string(),
  capacity: Joi.number().integer().min(1).max(100),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

// ============================================================
// SUBJECT SCHEMAS
// ============================================================

const createSubjectSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().trim().uppercase(),
  description: Joi.string(),
  category: Joi.string().valid('CORE', 'ELECTIVE', 'SKILL', 'LANGUAGE').default('CORE'),
  isTheoryBased: Joi.boolean().default(true),
  isPracticalBased: Joi.boolean().default(false),
  maxMarks: Joi.number().integer().min(0).default(100),
  passingMarks: Joi.number().integer().min(0),
  creditHours: Joi.number(),
  streams: Joi.array().items(Joi.string()),
});

const updateSubjectSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  category: Joi.string().valid('CORE', 'ELECTIVE', 'SKILL', 'LANGUAGE'),
  isTheoryBased: Joi.boolean(),
  isPracticalBased: Joi.boolean(),
  maxMarks: Joi.number().integer().min(0),
  passingMarks: Joi.number().integer().min(0),
  creditHours: Joi.number(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

// ============================================================
// CLASS SCHEMAS
// ============================================================

const createClassSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().trim().uppercase(),
  classNumber: Joi.number().integer().required(),
  academicYear: Joi.string().required(),
  stream: Joi.string(),
  sections: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  capacity: Joi.number().integer().min(1),
  description: Joi.string(),
});

const updateClassSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  sections: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  capacity: Joi.number().integer().min(1),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
}).min(1);

const assignClassTeacherSchema = Joi.object({
  teacherId: Joi.string().required(),
});

const addSectionSchema = Joi.object({
  sectionId: Joi.string().required(),
});

const assignSubjectSchema = Joi.object({
  subjectId: Joi.string().required(),
});

// ============================================================
// CURRICULUM SCHEMAS
// ============================================================

const createCurriculumSchema = Joi.object({
  subject: Joi.string().required(),
  class: Joi.string().required(),
  academicYear: Joi.string().required(),
  name: Joi.string().required().trim(),
  chapters: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      sequence: Joi.number().integer(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      topics: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string(),
        })
      ),
    })
  ),
  totalLessons: Joi.number().integer(),
  totalAssignments: Joi.number().integer(),
  totalTests: Joi.number().integer(),
  description: Joi.string(),
});

const updateCurriculumSchema = Joi.object({
  name: Joi.string().trim(),
  chapters: Joi.array().items(Joi.object()),
  totalLessons: Joi.number().integer(),
  totalAssignments: Joi.number().integer(),
  totalTests: Joi.number().integer(),
  description: Joi.string(),
}).min(1);

module.exports = {
  // Academic Year
  createAcademicYearSchema,
  updateAcademicYearSchema,
  // Stream
  createStreamSchema,
  updateStreamSchema,
  // Section
  createSectionSchema,
  updateSectionSchema,
  // Subject
  createSubjectSchema,
  updateSubjectSchema,
  // Class
  createClassSchema,
  updateClassSchema,
  assignClassTeacherSchema,
  addSectionSchema,
  assignSubjectSchema,
  // Curriculum
  createCurriculumSchema,
  updateCurriculumSchema,
};
