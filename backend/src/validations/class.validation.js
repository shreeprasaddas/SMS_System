/**
 * Class Validation
 * Joi schemas for class management endpoints
 */

const Joi = require('joi');

const createClassSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().trim().uppercase(),
  classNumber: Joi.number().integer(),
  academicYear: Joi.string().allow('', null),
  section: Joi.string().allow('', null),
  classTeacher: Joi.string().allow('', null),
  teacherId: Joi.string().allow('', null),
  stream: Joi.string().allow('', null),
  sections: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  capacity: Joi.number().integer().min(1).allow('', null),
  description: Joi.string().allow('', null),
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

const updateStrengthSchema = Joi.object({
  strength: Joi.number().integer().min(0).required(),
});

module.exports = {
  createClassSchema,
  updateClassSchema,
  assignClassTeacherSchema,
  addSectionSchema,
  assignSubjectSchema,
  updateStrengthSchema,
};
