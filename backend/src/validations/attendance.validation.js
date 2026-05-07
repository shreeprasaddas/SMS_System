/**
 * Attendance Validation
 * Joi schemas for attendance management endpoints
 */

const Joi = require('joi');

const markStudentAttendanceSchema = Joi.object({
  student: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  class: Joi.string().required().messages({
    'string.empty': 'Class ID is required',
  }),
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Valid date is required',
  }),
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE')
    .required()
    .messages({
      'any.only': 'Invalid attendance status',
    }),
  remarks: Joi.string().max(500).allow('').optional(),
});

const markBulkStudentAttendanceSchema = Joi.object({
  classId: Joi.string().required().messages({
    'string.empty': 'Class ID is required',
  }),
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Valid date is required',
  }),
  attendanceRecords: Joi.array()
    .items(
      Joi.object({
        student: Joi.string().required(),
        status: Joi.string()
          .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE')
          .required(),
        remarks: Joi.string().max(500).allow('').optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one attendance record is required',
    }),
});

const getStudentAttendanceSchema = Joi.object({
  student: Joi.string().optional(),
  class: Joi.string().optional(),
  academicYear: Joi.string().optional(),
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().min(1900).max(2100).optional(),
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE')
    .optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const markStaffAttendanceSchema = Joi.object({
  user: Joi.string().required().messages({
    'string.empty': 'Staff member ID is required',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Valid date is required',
  }),
  timeIn: Joi.date().optional(),
  timeOut: Joi.date().optional(),
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE')
    .required()
    .messages({
      'any.only': 'Invalid attendance status',
    }),
  remarks: Joi.string().max(500).allow('').optional(),
});

const getStaffAttendanceSchema = Joi.object({
  user: Joi.string().optional(),
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().min(1900).max(2100).optional(),
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY', 'LEAVE')
    .optional(),
  approvalStatus: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const approveStaffAttendanceSchema = Joi.object({
  approvalStatus: Joi.string()
    .valid('APPROVED', 'REJECTED')
    .required()
    .messages({
      'any.only': 'Approval status must be APPROVED or REJECTED',
    }),
  remarks: Joi.string().max(500).allow('').optional(),
});

const attendanceRuleSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.empty': 'Rule name is required',
  }),
  description: Joi.string().max(500).allow('').optional(),
  minimumAttendancePercentage: Joi.number()
    .min(0)
    .max(100)
    .default(75)
    .optional(),
  lateMarkAfter: Joi.number().min(0).default(15).optional().messages({
    'number.min': 'Late mark time cannot be negative',
  }),
  autoMarkAbsentAfter: Joi.number().min(1).default(4).optional().messages({
    'number.min': 'Auto mark absent time must be at least 1 hour',
  }),
  halfDayMarkAfter: Joi.number().min(0).default(180).optional(),
  allowHolidayMarking: Joi.boolean().default(true).optional(),
  allowLeaveMarking: Joi.boolean().default(true).optional(),
  sendNotifications: Joi.boolean().default(true).optional(),
  notificationThreshold: Joi.number().min(0).default(20).optional(),
  applicableTo: Joi.array()
    .items(Joi.string().valid('STUDENTS', 'TEACHERS', 'STAFF'))
    .default(['STUDENTS'])
    .optional(),
});

const createHolidaySchema = Joi.object({
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
  name: Joi.string().max(100).required().messages({
    'string.empty': 'Holiday name is required',
  }),
  description: Joi.string().max(500).allow('').optional(),
  date: Joi.date().required().messages({
    'date.base': 'Valid start date is required',
  }),
  endDate: Joi.date().optional(),
  type: Joi.string()
    .valid('NATIONAL_HOLIDAY', 'SCHOOL_HOLIDAY', 'FESTIVAL', 'VACATION', 'EXAM_BREAK')
    .default('SCHOOL_HOLIDAY')
    .optional(),
  isOptional: Joi.boolean().default(false).optional(),
  appliesTo: Joi.array()
    .items(Joi.string().valid('STUDENTS', 'TEACHERS', 'STAFF', 'ALL'))
    .default(['ALL'])
    .optional(),
});

const getHolidaysSchema = Joi.object({
  academicYear: Joi.string().optional(),
  type: Joi.string()
    .valid('NATIONAL_HOLIDAY', 'SCHOOL_HOLIDAY', 'FESTIVAL', 'VACATION', 'EXAM_BREAK')
    .optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
});

const classAttendanceReportSchema = Joi.object({
  classId: Joi.string().required().messages({
    'string.empty': 'Class ID is required',
  }),
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
  month: Joi.number().min(1).max(12).required().messages({
    'number.min': 'Month must be between 1 and 12',
  }),
  year: Joi.number().min(1900).max(2100).required().messages({
    'number.min': 'Year must be valid',
  }),
});

const calculateAttendancePercentageSchema = Joi.object({
  student: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  academicYear: Joi.string().required().messages({
    'string.empty': 'Academic year is required',
  }),
});

module.exports = {
  markStudentAttendanceSchema,
  markBulkStudentAttendanceSchema,
  getStudentAttendanceSchema,
  markStaffAttendanceSchema,
  getStaffAttendanceSchema,
  approveStaffAttendanceSchema,
  attendanceRuleSchema,
  createHolidaySchema,
  getHolidaysSchema,
  classAttendanceReportSchema,
  calculateAttendancePercentageSchema,
};
