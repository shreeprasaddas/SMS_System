const mongoose = require('mongoose');

const timetableChangeSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    changeCode: {
      type: String,
      required: true,
      unique: true
    },

    // Timetable reference
    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
      required: true
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    // Change details
    changeType: {
      type: String,
      enum: [
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
      ],
      required: true
    },

    description: {
      type: String,
      trim: true,
      required: true
    },

    reason: {
      type: String,
      enum: [
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
      ]
    },

    reasonDetails: String,

    // Affected entities
    affectedEntities: [
      {
        entityType: {
          type: String,
          enum: ['CLASS', 'SECTION', 'TEACHER', 'SUBJECT', 'CLASSROOM']
        },
        entityId: mongoose.Schema.Types.ObjectId,
        entityName: String
      }
    ],

    // Original schedule
    originalSchedule: {
      date: Date,
      dayOfWeek: String,
      periodNumber: Number,
      classId: mongoose.Schema.Types.ObjectId,
      sectionId: mongoose.Schema.Types.ObjectId,
      teacherId: mongoose.Schema.Types.ObjectId,
      subjectId: mongoose.Schema.Types.ObjectId,
      classroomId: mongoose.Schema.Types.ObjectId,
      startTime: String,
      endTime: String,
      activityType: String
    },

    // Modified schedule
    modifiedSchedule: {
      date: Date,
      dayOfWeek: String,
      periodNumber: Number,
      classId: mongoose.Schema.Types.ObjectId,
      sectionId: mongoose.Schema.Types.ObjectId,
      teacherId: mongoose.Schema.Types.ObjectId,
      subjectId: mongoose.Schema.Types.ObjectId,
      classroomId: mongoose.Schema.Types.ObjectId,
      startTime: String,
      endTime: String,
      activityType: String
    },

    // Swap details (if applicable)
    swapWith: {
      timetableChangeId: mongoose.Schema.Types.ObjectId,
      swapType: String
    },

    // Impact assessment
    impactedClasses: [mongoose.Schema.Types.ObjectId],

    impactedTeachers: [mongoose.Schema.Types.ObjectId],

    impactedStudents: Number,

    impactDetails: String,

    // Timeline
    changeDate: {
      type: Date,
      required: true
    },

    effectiveFrom: {
      type: Date,
      required: true
    },

    effectiveTo: Date,

    isTemporary: {
      type: Boolean,
      default: false
    },

    // Status management
    status: {
      type: String,
      enum: ['REQUESTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'CANCELLED', 'ROLLED_BACK'],
      default: 'REQUESTED'
    },

    approvalRequired: {
      type: Boolean,
      default: true
    },

    // Approval workflow
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    requestedDate: {
      type: Date,
      default: Date.now
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvalDate: Date,

    approvalComments: String,

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    rejectionDate: Date,

    rejectionReason: String,

    // Implementation details
    implementedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    implementationDate: Date,

    implementationNotes: String,

    // Rollback tracking
    canBeRolledBack: {
      type: Boolean,
      default: true
    },

    rolledBackBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    rollbackDate: Date,

    rollbackReason: String,

    // Notifications
    notificationsSent: {
      toTeachers: {
        type: Boolean,
        default: false
      },
      toStudents: {
        type: Boolean,
        default: false
      },
      toParents: {
        type: Boolean,
        default: false
      },
      sentDate: Date
    },

    // Related changes
    linkedChanges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimetableChange'
      }
    ],

    // Alternatives/fallback
    alternativeSchedules: [
      {
        scheduleOption: String,
        details: Object
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
timetableChangeSchema.index({ schoolId: 1, status: 1 });
timetableChangeSchema.index({ changeCode: 1 }, { unique: true });
timetableChangeSchema.index({ timetableId: 1, schoolId: 1 });
timetableChangeSchema.index({ changeDate: 1, schoolId: 1 });
timetableChangeSchema.index({ status: 1, effectiveFrom: 1, schoolId: 1 });
timetableChangeSchema.index({ requestedBy: 1, schoolId: 1 });
timetableChangeSchema.index({ changeType: 1, status: 1, schoolId: 1 });

// Pre-save middleware
timetableChangeSchema.pre('save', async function (next) {
  // Auto-generate changeCode if not provided
  if (!this.changeCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('TimetableChange').countDocuments({
      schoolId: this.schoolId
    });
    this.changeCode = `TC-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('TimetableChange', timetableChangeSchema);
