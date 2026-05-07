const mongoose = require('mongoose');

const teacherTimetableSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    teacherTimetableCode: {
      type: String,
      required: true,
      unique: true
    },

    // Teacher reference
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    // Timetable reference
    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable'
    },

    // Teacher assignment summary
    assignedClasses: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        },
        sectionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Section'
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject'
        },
        hoursPerWeek: Number,
        totalClasses: Number
      }
    ],

    // Weekly schedule
    weeklySchedule: [
      {
        dayOfWeek: {
          type: String,
          enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        },

        periods: [
          {
            periodNumber: Number,
            classId: mongoose.Schema.Types.ObjectId,
            sectionId: mongoose.Schema.Types.ObjectId,
            subjectId: mongoose.Schema.Types.ObjectId,
            startTime: String,
            endTime: String,
            classroomId: mongoose.Schema.Types.ObjectId,
            duration: Number,
            activityType: String,
            remarks: String
          }
        ],

        totalPeriods: Number,

        isHoliday: Boolean,

        holidayName: String
      }
    ],

    // Workload statistics
    totalClassesPerWeek: {
      type: Number,
      default: 0
    },

    totalHoursPerWeek: {
      type: Number,
      default: 0
    },

    averageClassDuration: {
      value: Number,
      unit: String
    },

    numberOfSubjects: Number,

    numberOfClasses: Number,

    numberOfSections: Number,

    // Availability and constraints
    maximumClassesPerDay: Number,

    minimumBreakRequired: {
      value: Number,
      unit: String
    },

    preferredTimeSlots: [String],

    avoidTimeSlots: [String],

    unavailablePeriods: [
      {
        date: Date,
        reason: String,
        startTime: String,
        endTime: String
      }
    ],

    // Special assignments
    specialAssignments: [
      {
        duty: {
          type: String,
          enum: ['SUPERVISION', 'DUTY', 'EXAMINATION', 'SPECIAL_CLASS', 'WORKSHOP']
        },
        dayOfWeek: String,
        periodNumber: Number,
        description: String,
        location: String
      }
    ],

    // Status and lifecycle
    status: {
      type: String,
      enum: ['DRAFT', 'ASSIGNED', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
      default: 'DRAFT'
    },

    isConfirmed: {
      type: Boolean,
      default: false
    },

    confirmedDate: Date,

    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Preferences and feedback
    preferenceNotes: String,

    teacherFeedback: String,

    feedbackDate: Date,

    // Change management
    changesRequested: {
      type: Boolean,
      default: false
    },

    changeReason: String,

    requestedChanges: String,

    // Performance metrics
    balanceIndex: {
      type: Number,
      description: 'Score indicating workload balance'
    },

    consecutiveFreePeriodsCount: Number,

    maxConsecutivePeriodsPerDay: Number,

    // Audit and version
    version: {
      type: Number,
      default: 1
    },

    previousVersions: [
      {
        versionNumber: Number,
        weeklySchedule: [Object],
        replacedDate: Date,
        replacedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now
        },
        changes: mongoose.Schema.Types.Mixed
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
teacherTimetableSchema.index({ schoolId: 1, status: 1 });
teacherTimetableSchema.index({ teacherTimetableCode: 1 }, { unique: true });
teacherTimetableSchema.index({ teacherId: 1, academicYearId: 1, schoolId: 1 });
teacherTimetableSchema.index({ timetableId: 1, schoolId: 1 });
teacherTimetableSchema.index({ status: 1, confirmedDate: 1, schoolId: 1 });

// Pre-save middleware
teacherTimetableSchema.pre('save', async function (next) {
  // Auto-generate teacherTimetableCode if not provided
  if (!this.teacherTimetableCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('TeacherTimetable').countDocuments({
      schoolId: this.schoolId
    });
    this.teacherTimetableCode = `TT-T-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('TeacherTimetable', teacherTimetableSchema);
