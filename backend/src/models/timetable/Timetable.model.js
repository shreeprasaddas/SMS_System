const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    timetableCode: {
      type: String,
      required: true,
      unique: true
    },

    // Academic association
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    },

    // Timetable configuration
    timetableName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // Weekly structure
    dayWiseSchedule: [
      {
        dayOfWeek: {
          type: String,
          enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        },

        periods: [
          {
            periodNumber: Number,
            periodName: String,
            periodConfig: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'PeriodConfig'
            },
            subjectId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Subject'
            },
            teacherId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Teacher'
            },
            classroomId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Classroom'
            },
            startTime: String,
            endTime: String,
            duration: {
              value: Number,
              unit: {
                type: String,
                enum: ['MINUTES', 'HOURS']
              }
            },
            activityType: {
              type: String,
              enum: ['CLASS', 'LAB', 'PRACTICAL', 'SEMINAR', 'TUTORIAL', 'BREAK', 'ASSEMBLY', 'LUNCH', 'SPORTS', 'FREE']
            },
            capacity: Number,
            remarks: String
          }
        ],

        totalPeriods: Number,

        isHoliday: {
          type: Boolean,
          default: false
        },

        holidayName: String
      }
    ],

    // Effective dates
    effectiveFrom: {
      type: Date,
      required: true
    },

    effectiveTo: {
      type: Date,
      required: true
    },

    // Status management
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
      default: 'DRAFT'
    },

    isActive: {
      type: Boolean,
      default: false
    },

    activatedDate: Date,

    // Rotation schedules (if applicable)
    hasRotation: {
      type: Boolean,
      default: false
    },

    rotationPattern: String,

    rotationCycle: {
      value: Number,
      unit: String
    },

    // Time slots configuration
    timeSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot'
      }
    ],

    // Statistics
    totalWorkingDays: Number,

    totalPeriods: Number,

    averagePeriodsPerDay: Number,

    // Constraints and notes
    specialConstraints: [String],

    specialArrangements: [
      {
        date: Date,
        description: String,
        changedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Approval workflow
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvalDate: Date,

    approvalNotes: String,

    rejectionReason: String,

    // Creator info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Change tracking
    previousVersions: [
      {
        versionNumber: Number,
        dayWiseSchedule: [Object],
        effectiveFrom: Date,
        effectiveTo: Date,
        replacedDate: Date,
        replacedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Audit trail
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
timetableSchema.index({ schoolId: 1, status: 1 });
timetableSchema.index({ timetableCode: 1 }, { unique: true });
timetableSchema.index({ classId: 1, academicYearId: 1, schoolId: 1 });
timetableSchema.index({ isActive: 1, schoolId: 1 });
timetableSchema.index({ effectiveFrom: 1, effectiveTo: 1, schoolId: 1 });
timetableSchema.index({ status: 1, activatedDate: 1, schoolId: 1 });

// Pre-save middleware
timetableSchema.pre('save', async function (next) {
  // Auto-generate timetableCode if not provided
  if (!this.timetableCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Timetable').countDocuments({
      schoolId: this.schoolId
    });
    this.timetableCode = `TT-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Timetable', timetableSchema);
