/**
 * ReportCard Validation Schemas
 * Request validation for report card operations
 */

const Joi = require('joi');

const reportCardValidation = {
  // Generate report card
  generateReportCardSchema: Joi.object({
    student: Joi.string().required().messages({
      'string.empty': 'Student ID is required',
    }),
    academicYear: Joi.string().required().messages({
      'string.empty': 'Academic year ID is required',
    }),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required().messages({
      'any.only': 'Term must be FIRST, SECOND, or THIRD',
    }),
  }).unknown(false),

  // Add remarks
  remarksSchema: Joi.object({
    remarks: Joi.string().required().min(10).messages({
      'string.empty': 'Remarks are required',
      'string.min': 'Remarks must be at least 10 characters',
    }),
  }).unknown(false),

  // Add feedback
  feedbackSchema: Joi.object({
    feedback: Joi.string().required().min(10).messages({
      'string.empty': 'Feedback is required',
      'string.min': 'Feedback must be at least 10 characters',
    }),
  }).unknown(false),

  // Publish report cards
  publishReportCardsSchema: Joi.object({
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),

  // Get report cards (filters)
  getReportCardsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    student: Joi.string().optional(),
    academicYear: Joi.string().optional(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').optional(),
    status: Joi.string().valid('DRAFT', 'FINALIZED', 'PUBLISHED', 'DISPUTED').optional(),
  }).unknown(true),

  // Get class report cards
  getClassReportCardsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(20).min(1).max(100),
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),

  // Get class statistics
  classStatsSchema: Joi.object({
    class: Joi.string().required(),
    academicYear: Joi.string().required(),
    term: Joi.string().valid('FIRST', 'SECOND', 'THIRD').required(),
  }).unknown(false),
};

module.exports = reportCardValidation;
