const Joi = require('joi');

/**
 * Leave Type Validations
 */
exports.createLeaveTypeSchema = Joi.object().keys({
  leaveTypeName: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Leave type name is required'
  }),
  leaveCategory: Joi.string()
    .valid('CASUAL', 'EARNED', 'SICK', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'STUDY', 'SABBATICAL', 'UNPAID', 'OTHER')
    .required()
    .messages({ 'string.empty': 'Leave category is required' }),
  description: Joi.string().max(500),
  applicableToRoles: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({ 'array.min': 'At least one applicable role is required' }),
  paidLeave: Joi.boolean().default(true),
  requiresDocumentation: Joi.boolean().default(false),
  maximumConsecutiveDays: Joi.number().min(1).required(),
  maximumDaysPerYear: Joi.number().min(1).required(),
  advanceNotificationDays: Joi.number().min(0).default(0),
  approvalRequired: Joi.boolean().default(true),
  approverRole: Joi.string().valid('HOD', 'PRINCIPAL', 'ADMIN').when('approvalRequired', {
    is: true,
    then: Joi.required()
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

exports.updateLeaveTypeSchema = Joi.object().keys({
  leaveTypeName: Joi.string().min(1).max(100),
  description: Joi.string().max(500),
  applicableToRoles: Joi.array().items(Joi.string()).min(1),
  paidLeave: Joi.boolean(),
  requiresDocumentation: Joi.boolean(),
  maximumConsecutiveDays: Joi.number().min(1),
  maximumDaysPerYear: Joi.number().min(1),
  advanceNotificationDays: Joi.number().min(0),
  approvalRequired: Joi.boolean(),
  approverRole: Joi.string().valid('HOD', 'PRINCIPAL', 'ADMIN'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE')
});

exports.leaveTypeFilterSchema = Joi.object().keys({
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  category: Joi.string().valid('CASUAL', 'EARNED', 'SICK', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'STUDY', 'SABBATICAL', 'UNPAID', 'OTHER'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Leave Policy Validations
 */
exports.createLeavePolicySchema = Joi.object().keys({
  academicYearId: Joi.string().required().messages({
    'string.empty': 'Academic year ID is required'
  }),
  effectiveFrom: Joi.date().required().messages({
    'date.base': 'Effective from date must be valid'
  }),
  effectiveTo: Joi.date().required().messages({
    'date.base': 'Effective to date must be valid'
  }),
  applicableRoles: Joi.array()
    .items(
      Joi.object().keys({
        role: Joi.string().required(),
        leavesAllocated: Joi.array()
          .items(
            Joi.object().keys({
              leaveTypeId: Joi.string().required(),
              allocatedDays: Joi.number().min(1).required(),
              carryForwardDays: Joi.number().min(0).default(0),
              encashableDays: Joi.number().min(0).default(0)
            })
          )
          .min(1)
          .required()
      })
    )
    .min(1)
    .required(),
  leaveRules: Joi.object().keys({
    halfDayAllowed: Joi.boolean().default(true),
    leaveOnWeekends: Joi.boolean().default(false),
    leaveOnPublicHolidays: Joi.boolean().default(false),
    maximumLeavePerRequest: Joi.number().min(1).default(30),
    leaveRequestAdvanceDays: Joi.number().min(1).default(7),
    lastMinuteLeaveAllowed: Joi.boolean().default(false)
  }),
  approvalWorkflow: Joi.object().keys({
    levels: Joi.number().valid(1, 2, 3).required(),
    level1Approver: Joi.string().required(),
    level2Approver: Joi.string(),
    level3Approver: Joi.string()
  }),
  isDefault: Joi.boolean().default(false),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DRAFT').default('DRAFT')
});

exports.leavePolicyFilterSchema = Joi.object().keys({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DRAFT'),
  academicYearId: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Leave Application Validations
 */
exports.createLeaveApplicationSchema = Joi.object().keys({
  leaveTypeId: Joi.string().required().messages({
    'string.empty': 'Leave type is required'
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be valid'
  }),
  endDate: Joi.date().required().messages({
    'date.base': 'End date must be valid'
  }),
  isHalfDay: Joi.boolean().default(false),
  halfDayType: Joi.string().valid('MORNING', 'AFTERNOON').when('isHalfDay', {
    is: true,
    then: Joi.required()
  }),
  reason: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Reason is required',
    'string.min': 'Reason must be at least 5 characters'
  }),
  attachments: Joi.array().items(
    Joi.object().keys({
      fileName: Joi.string().required(),
      fileURL: Joi.string().required()
    })
  ),
  reliefArrangement: Joi.object().keys({
    classesAffected: Joi.array()
      .items(
        Joi.object().keys({
          classId: Joi.string().required(),
          classDate: Joi.date().required(),
          reliefTeacherId: Joi.string()
        })
      )
  })
});

exports.submitLeaveApplicationSchema = Joi.object().keys({
  applicationId: Joi.string().required()
});

exports.approveLeaveApplicationSchema = Joi.object().keys({
  applicationId: Joi.string().required(),
  comments: Joi.string().max(500)
});

exports.rejectLeaveApplicationSchema = Joi.object().keys({
  applicationId: Joi.string().required(),
  reason: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Rejection reason is required',
    'string.min': 'Rejection reason must be at least 5 characters'
  })
});

exports.leaveApplicationFilterSchema = Joi.object().keys({
  status: Joi.string().valid('DRAFT', 'SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
  userId: Joi.string(),
  leaveTypeId: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Leave Approval Validations
 */
exports.createLeaveApprovalSchema = Joi.object().keys({
  leaveApplicationId: Joi.string().required(),
  approvalLevel: Joi.number().valid(1, 2, 3).required().messages({
    'number.base': 'Approval level must be a number',
    'any.only': 'Approval level must be 1, 2, or 3'
  }),
  assignedToUserId: Joi.string().required(),
  assignedToRole: Joi.string().valid('HOD', 'PRINCIPAL', 'MANAGEMENT', 'ADMIN').required(),
  timeAllowedForReview: Joi.number().min(1)
});

exports.approveLeaveAtLevelSchema = Joi.object().keys({
  approvalId: Joi.string().required(),
  comments: Joi.string().max(500),
  conditionsApplied: Joi.array().items(
    Joi.object().keys({
      condition: Joi.string().required(),
      mandatory: Joi.boolean().default(false)
    })
  )
});

exports.leaveApprovalFilterSchema = Joi.object().keys({
  status: Joi.string().valid('PENDING', 'REVIEWED', 'FORWARDED', 'APPROVED', 'REJECTED'),
  approvalLevel: Joi.number().valid(1, 2, 3),
  assignedToUserId: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Leave Balance Validations
 */
exports.leaveBalanceFilterSchema = Joi.object().keys({
  userId: Joi.string(),
  academicYearId: Joi.string(),
  status: Joi.string().valid('ADEQUATE', 'CRITICAL', 'EXHAUSTED', 'NEGATIVE'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * Leave Statistics Validations
 */
exports.leaveStatisticsFilterSchema = Joi.object().keys({
  academicYearId: Joi.string(),
  fromDate: Joi.date(),
  toDate: Joi.date()
});

module.exports = exports;
