const Joi = require('joi');

// Period Config schemas
exports.createPeriodConfigSchema = Joi.object({
  configName: Joi.string().trim().required(),
  description: Joi.string().trim(),
  academicYearId: Joi.string().hex().length(24).required(),
  totalPeriods: Joi.number().min(1).required(),
  periodsPerDay: Joi.number().min(1).required(),
  workingDays: Joi.array()
    .items(Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
    .required(),
  periods: Joi.array()
    .items(
      Joi.object({
        periodNumber: Joi.number().required(),
        periodName: Joi.string(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        duration: Joi.object({
          value: Joi.number().min(1),
          unit: Joi.string().valid('MINUTES', 'HOURS')
        }),
        type: Joi.string().valid('CLASS', 'LAB', 'BREAK', 'LUNCH', 'ASSEMBLY', 'SPORTS', 'FREE')
      })
    )
    .required(),
  breaks: Joi.array().items(
    Joi.object({
      breakName: Joi.string(),
      startTime: Joi.string(),
      endTime: Joi.string(),
      duration: Joi.number(),
      type: Joi.string().valid('SHORT_BREAK', 'LUNCH_BREAK', 'PRAYER', 'ASSEMBLY')
    })
  ),
  schoolStartTime: Joi.string(),
  schoolEndTime: Joi.string(),
  isMultiShift: Joi.boolean(),
  shifts: Joi.array().items(
    Joi.object({
      shiftName: Joi.string(),
      startTime: Joi.string(),
      endTime: Joi.string(),
      classes: Joi.array().items(Joi.string().hex().length(24))
    })
  ),
  fixedPeriods: Joi.boolean()
}).required();

// TimeSlot schemas
exports.createTimeSlotSchema = Joi.object({
  slotName: Joi.string().trim().required(),
  slotLabel: Joi.string(),
  academicYearId: Joi.string().hex().length(24).required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  duration: Joi.object({
    value: Joi.number().min(1).required(),
    unit: Joi.string().valid('MINUTES', 'HOURS')
  }).required(),
  slotType: Joi.string().valid('TEACHING', 'BREAK', 'LUNCH', 'ASSEMBLY', 'SPORTS', 'ACTIVITY', 'FREE').required(),
  periodNumber: Joi.number().required(),
  isBreak: Joi.boolean(),
  breakDescription: Joi.string(),
  mandatory: Joi.boolean(),
  applicableClasses: Joi.array().items(Joi.string().hex().length(24)),
  applicableToAllClasses: Joi.boolean(),
  daysApplicable: Joi.array().items(
    Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
  )
}).required();

// Timetable schemas
exports.createTimetableSchema = Joi.object({
  timetableName: Joi.string().trim().required(),
  description: Joi.string().trim(),
  academicYearId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24).required(),
  sectionId: Joi.string().hex().length(24),
  dayWiseSchedule: Joi.array()
    .items(
      Joi.object({
        dayOfWeek: Joi.string()
          .valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
          .required(),
        periods: Joi.array().items(
          Joi.object({
            periodNumber: Joi.number(),
            periodName: Joi.string(),
            subjectId: Joi.string().hex().length(24),
            teacherId: Joi.string().hex().length(24),
            classroomId: Joi.string().hex().length(24),
            startTime: Joi.string(),
            endTime: Joi.string(),
            duration: Joi.object({
              value: Joi.number(),
              unit: Joi.string().valid('MINUTES', 'HOURS')
            }),
            activityType: Joi.string()
              .valid('CLASS', 'LAB', 'PRACTICAL', 'SEMINAR', 'TUTORIAL', 'BREAK', 'ASSEMBLY', 'LUNCH', 'SPORTS', 'FREE'),
            remarks: Joi.string()
          })
        ),
        isHoliday: Joi.boolean(),
        holidayName: Joi.string()
      })
    )
    .required(),
  effectiveFrom: Joi.date().iso().required(),
  effectiveTo: Joi.date().iso().required(),
  hasRotation: Joi.boolean(),
  rotationPattern: Joi.string(),
  specialConstraints: Joi.array().items(Joi.string())
}).required();

// Update Timetable schema
exports.updateTimetableSchema = Joi.object({
  timetableName: Joi.string().trim(),
  description: Joi.string().trim(),
  dayWiseSchedule: Joi.array().items(Joi.object()),
  effectiveFrom: Joi.date().iso(),
  effectiveTo: Joi.date().iso(),
  specialConstraints: Joi.array().items(Joi.string())
}).min(1).required();

// Teacher Timetable schemas
exports.createTeacherTimetableSchema = Joi.object({
  timetableId: Joi.string().hex().length(24),
  academicYearId: Joi.string().hex().length(24).required(),
  assignedClasses: Joi.array()
    .items(
      Joi.object({
        classId: Joi.string().hex().length(24).required(),
        sectionId: Joi.string().hex().length(24),
        subjectId: Joi.string().hex().length(24).required(),
        hoursPerWeek: Joi.number(),
        totalClasses: Joi.number()
      })
    )
    .required(),
  weeklySchedule: Joi.array().items(Joi.object()),
  totalClassesPerWeek: Joi.number(),
  maximumClassesPerDay: Joi.number(),
  preferenceNotes: Joi.string()
}).required();

// Timetable Change schemas
exports.requestTimetableChangeSchema = Joi.object({
  changeType: Joi.string()
    .valid(
      'TEACHER_SWAP',
      'CLASSROOM_CHANGE',
      'PERIOD_SWAP',
      'SUBJECT_CHANGE',
      'CLASS_SCHEDULE_CHANGE',
      'SPECIAL_SCHEDULE',
      'HOLIDAY_ADDITION',
      'HOLIDAY_REMOVAL',
      'EMERGENCY_CLOSURE',
      'TIME_ADJUSTMENT',
      'OTHER'
    )
    .required(),
  description: Joi.string().trim().required(),
  reason: Joi.string().valid(
    'STAFF_ABSENT',
    'EXAM_SCHEDULE',
    'SPECIAL_EVENT',
    'HOLIDAY',
    'EMERGENCY',
    'MAINTENANCE',
    'ADMINISTRATIVE',
    'SPORTS',
    'TECHNICAL_ISSUE',
    'REQUEST_FROM_TEACHER',
    'REQUEST_FROM_PRINCIPAL',
    'OTHER'
  ),
  reasonDetails: Joi.string(),
  affectedEntities: Joi.array().items(
    Joi.object({
      entityType: Joi.string().valid('CLASS', 'SECTION', 'TEACHER', 'SUBJECT', 'CLASSROOM'),
      entityId: Joi.string().hex().length(24),
      entityName: Joi.string()
    })
  ),
  originalSchedule: Joi.object(),
  modifiedSchedule: Joi.object(),
  changeDate: Joi.date().iso().required(),
  effectiveFrom: Joi.date().iso().required(),
  effectiveTo: Joi.date().iso(),
  isTemporary: Joi.boolean()
}).required();

// Approval/Rejection schemas
exports.approveTimetableChangeSchema = Joi.object({
  comments: Joi.string().trim()
}).required();

exports.rejectTimetableChangeSchema = Joi.object({
  reason: Joi.string().trim().required()
}).required();

// Filter schemas
exports.periodConfigFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.timeSlotFiltersSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  slotType: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.timetableFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'APPROVED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'),
  classId: Joi.string().hex().length(24),
  isActive: Joi.boolean(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

exports.timetableChangeFiltersSchema = Joi.object({
  status: Joi.string().valid('REQUESTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'CANCELLED', 'ROLLED_BACK'),
  changeType: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

module.exports = exports;
