/**
 * Assessment Validation Schemas
 * Request validation for assessment operations
 */

const Joi = require('joi');

const assessmentValidation = {
  // Create assessment
  createAssessmentSchema: Joi.object({
    class: Joi.string().required().messages({
      'string.empty': 'Class ID is required',
    }),
    subject: Joi.string().required().messages({
      'string.empty': 'Subject ID is required',
    }),
    academicYear: Joi.string().required().messages({
      'string.empty': 'Academic year ID is required',
    }),
    name: Joi.string().required().min(3).messages({
      'string.empty': 'Assessment name is required',
      'string.min': 'Name must be at least 3 characters',
    }),
    type: Joi.string()
      .valid('QUIZ', 'TEST', 'ASSIGNMENT', 'EXAM', 'PRACTICAL', 'PROJECT', 'MIDTERM', 'FINAL')
      .required()
      .messages({
        'any.only': 'Invalid assessment type',
      }),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').optional(),
    totalMarks: Joi.number().min(1).required().messages({
      'number.min': 'Total marks must be at least 1',
    }),
    passingMarks: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
    assessmentDate: Joi.date().required().messages({
      'date.base': 'Valid assessment date is required',
    }),
    submissionDeadline: Joi.date().optional(),
    weightage: Joi.number().min(0).max(100).optional(),
    isNegativeMarking: Joi.boolean().default(false),
    negativeMarkingPercentage: Joi.number().min(0).max(100).optional(),
  }).unknown(false),

  // Update assessment
  updateAssessmentSchema: Joi.object({
    name: Joi.string().min(3).optional(),
    totalMarks: Joi.number().min(1).optional(),
    description: Joi.string().optional(),
    weightage: Joi.number().min(0).max(100).optional(),
    isNegativeMarking: Joi.boolean().optional(),
    negativeMarkingPercentage: Joi.number().min(0).max(100).optional(),
  }).unknown(false),

  // Submit assessment
  submitAssessmentSchema: Joi.object({
    marksObtained: Joi.number().min(0).optional(),
    attachments: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        fileName: Joi.string().required(),
      })
    ).optional(),
  }).unknown(false),

  // Mark assessment
  markAssessmentSchema: Joi.object({
    marksObtained: Joi.number().min(0).required().messages({
      'number.min': 'Marks cannot be negative',
    }),
    feedback: Joi.string().optional(),
  }).unknown(false),

  // Get assessments (filters)
  getAssessmentsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    class: Joi.string().optional(),
    subject: Joi.string().optional(),
    academicYear: Joi.string().optional(),
    type: Joi.string().optional(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED').optional(),
  }).unknown(true),

  // Get student assessments (filters)
  getStudentAssessmentsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    subject: Joi.string().optional(),
    academicYear: Joi.string().optional(),
    status: Joi.string().optional(),
  }).unknown(true),

  // Request review
  requestReviewSchema: Joi.object({
    reason: Joi.string().required().min(10).messages({
      'string.empty': 'Review reason is required',
      'string.min': 'Reason must be at least 10 characters',
    }),
  }).unknown(false),
};

module.exports = assessmentValidation;
