/**
 * Fee Validation
 * Joi schemas for fee management endpoints
 */

const Joi = require('joi');

const createFeeStructureSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.empty': 'Fee structure name is required',
  }),
  description: Joi.string().max(500).allow('').optional(),
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
  classes: Joi.array()
    .items(
      Joi.object({
        class: Joi.string().required(),
        sections: Joi.array()
          .items(
            Joi.object({
              section: Joi.string(),
              fees: Joi.array()
                .items(
                  Joi.object({
                    name: Joi.string()
                      .valid(
                        'TUITION',
                        'TRANSPORT',
                        'EXAMINATION',
                        'LIBRARY',
                        'SPORTS',
                        'DEVELOPMENT',
                        'OTHER'
                      )
                      .required(),
                    amount: Joi.number().min(0).required(),
                    frequency: Joi.string()
                      .valid('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL')
                      .default('ANNUAL'),
                    dueDate: Joi.date(),
                  })
                )
                .required(),
            })
          )
          .required(),
      })
    )
    .required(),
});

const updateFeeStructureSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  classes: Joi.array().optional(),
  status: Joi.string()
    .valid('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')
    .optional(),
});

const approveFeeStructureSchema = Joi.object({
  feeStructureId: Joi.string().required(),
});

const allocateFeesSchema = Joi.object({
  feeStructureId: Joi.string().required(),
  studentIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one student is required',
    }),
});

const applyConcessionSchema = Joi.object({
  concessionId: Joi.string().required().messages({
    'string.empty': 'Concession ID is required',
  }),
});

const exemptFromFeesSchema = Joi.object({
  reason: Joi.string().max(500).required().messages({
    'string.empty': 'Exemption reason is required',
  }),
});

const getStudentFeesSchema = Joi.object({
  student: Joi.string().optional(),
  class: Joi.string().optional(),
  status: Joi.string()
    .valid('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'DEFAULTER', 'EXEMPTED')
    .optional(),
  academicYear: Joi.string().optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const createConcessionSchema = Joi.object({
  student: Joi.string().required(),
  studentFee: Joi.string().required(),
  academicYear: Joi.string().required(),
  type: Joi.string()
    .valid(
      'MERIT',
      'FINANCIAL_AID',
      'SPORTS',
      'SIBLING',
      'STAFF_CHILD',
      'SCHOLARSHIP',
      'SPECIAL',
      'OTHER'
    )
    .required(),
  amount: Joi.number().min(0).optional(),
  percentage: Joi.number().min(0).max(100).optional(),
  description: Joi.string().max(500).required(),
  reason: Joi.string().optional(),
  validFrom: Joi.date().required(),
  validUpto: Joi.date().required(),
  applicableToFees: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  createFeeStructureSchema,
  updateFeeStructureSchema,
  approveFeeStructureSchema,
  allocateFeesSchema,
  applyConcessionSchema,
  exemptFromFeesSchema,
  getStudentFeesSchema,
  createConcessionSchema,
};
