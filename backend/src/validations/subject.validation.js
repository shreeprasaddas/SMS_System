/**
 * Subject Validation
 * Joi schemas for subject management endpoints
 */

const Joi = require('joi');

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

const assignTeacherSchema = Joi.object({
  teacher: Joi.string().required(),
  classes: Joi.array().items(Joi.string()),
  qualifications: Joi.array().items(Joi.string()),
  experience: Joi.number().integer(),
});

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
  createCurriculumSchema,
  updateCurriculumSchema,
  assignTeacherSchema,
};
