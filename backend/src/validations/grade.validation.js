/**
 * Grade Validation Schemas
 * Request validation for grade operations
 */

const Joi = require('joi');

const gradeValidation = {
  // Create/Update grade
  createGradeSchema: Joi.object({
    student: Joi.string().required().messages({
      'string.empty': 'Student ID is required',
    }),
    subject: Joi.string().required().messages({
      'string.empty': 'Subject ID is required',
    }),
    class: Joi.string().required().messages({
      'string.empty': 'Class ID is required',
    }),
    academicYear: Joi.string().required().messages({
      'string.empty': 'Academic year ID is required',
    }),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required().messages({
      'any.only': 'Term must be FIRST, SECOND, or THIRD',
    }),
    gradeStructure: Joi.string().required().messages({
      'string.empty': 'Grade structure ID is required',
    }),
    continuousAssessmentMarks: Joi.number().min(0).required(),
    examMarks: Joi.number().min(0).required(),
    totalMarks: Joi.number().min(1).required(),
    remarks: Joi.string().optional(),
  }).unknown(false),

  // Finalize grades
  finalizeGradesSchema: Joi.object({
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),

  // Publish grades
  publishGradesSchema: Joi.object({
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),

  // Contest grade
  contestGradeSchema: Joi.object({
    reason: Joi.string().required().min(10).messages({
      'string.empty': 'Reason for contest is required',
      'string.min': 'Reason must be at least 10 characters',
    }),
  }).unknown(false),

  // Resolve contest
  resolveContestSchema: Joi.object({
    remark: Joi.string().required().min(10).messages({
      'string.min': 'Resolution remark must be at least 10 characters',
    }),
    newGrade: Joi.object({
      grade: Joi.string().required(),
      gradePoint: Joi.number().required(),
    }).optional(),
  }).unknown(false),

  // Get grades (filters)
  getGradesSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    student: Joi.string().optional(),
    subject: Joi.string().optional(),
    academicYear: Joi.string().optional(),
    status: Joi.string().valid('PENDING', 'FINALIZED', 'PUBLISHED', 'CONTESTED').optional(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').optional(),
  }).unknown(true),

  // Class statistics
  classStatsSchema: Joi.object({
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),
};

module.exports = gradeValidation;
