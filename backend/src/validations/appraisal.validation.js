/**
 * Appraisal Validation Schemas
 * Request validation for appraisal operations
 */

const Joi = require('joi');

const appraisalValidation = {
  // Create appraisal
  createAppraisalSchema: Joi.object({
    employee: Joi.string().required().messages({
      'string.empty': 'Employee ID is required',
    }),
    appraisalPeriod: Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    }).required(),
    appraisalType: Joi.string()
      .valid('ANNUAL', 'HALF_YEARLY', 'QUARTERLY', 'PROJECT_BASED')
      .required(),
    reportingManager: Joi.string().required(),
    performanceMetrics: Joi.array()
      .items(
        Joi.object({
          criterion: Joi.string().required(),
          rating: Joi.number().min(1).max(5).required(),
          comments: Joi.string().optional(),
        })
      )
      .required(),
  }).unknown(false),

  // Review appraisal
  reviewAppraisalSchema: Joi.object({
    comments: Joi.string().required().min(10).messages({
      'string.empty': 'Comments are required',
      'string.min': 'Comments must be at least 10 characters',
    }),
  }).unknown(false),

  // Finalize appraisal
  finalizeAppraisalSchema: Joi.object({
    salaryIncrement: Joi.object({
      currentSalary: Joi.number().required(),
      proposedSalary: Joi.number().required(),
      incrementPercentage: Joi.number(),
      effectiveFrom: Joi.date().required(),
    }).optional(),
    promotionRecommended: Joi.boolean().default(false),
    promotionProposal: Joi.object({
      proposedDesignation: Joi.string().required(),
      effectiveFrom: Joi.date().required(),
      justification: Joi.string().required(),
    })
      .when('promotionRecommended', {
        is: true,
        then: Joi.required(),
      }),
  }).unknown(false),

  // Update appraisal
  updateAppraisalSchema: Joi.object({
    employee: Joi.string().optional(),
    appraisalPeriod: Joi.object({
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
    }).optional(),
    appraisalType: Joi.string().valid('ANNUAL', 'HALF_YEARLY', 'QUARTERLY', 'PROJECT_BASED').optional(),
    reportingManager: Joi.string().optional(),
    performanceMetrics: Joi.array()
      .items(
        Joi.object({
          criterion: Joi.string().required(),
          rating: Joi.number().min(1).max(5).required(),
          comments: Joi.string().optional(),
        })
      )
      .optional(),
  }).unknown(false),

  // Get appraisals (filters)
  getAppraisalsSchema: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
    employee: Joi.string().optional(),
    appraisalType: Joi.string().optional(),
    status: Joi.string()
      .valid('DRAFT', 'SUBMITTED', 'REVIEWED', 'FINALIZED', 'PUBLISHED')
      .optional(),
  }).unknown(true),

  // Get appraisal history
  getAppraisalHistorySchema: Joi.object({
    employee: Joi.string().required(),
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1).max(100),
  }).unknown(true),

  // Get appraisal statistics
  getAppraisalStatisticsSchema: Joi.object({
    appraisalType: Joi.string().optional(),
  }).unknown(true),
};

module.exports = appraisalValidation;
