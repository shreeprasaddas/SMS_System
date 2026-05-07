const mongoose = require('mongoose');

const periodConfigSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    periodConfigCode: {
      type: String,
      required: true,
      unique: true
    },

    // Basic information
    configName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    // Period structure
    totalPeriods: {
      type: Number,
      required: true,
      min: 1
    },

    periodsPerDay: {
      type: Number,
      required: true
    },

    workingDays: [
      {
        type: String,
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      }
    ],

    // Time slots for periods
    periods: [
      {
        periodNumber: {
          type: Number,
          required: true
        },

        periodName: String,

        startTime: {
          type: String,
          required: true
        },

        endTime: {
          type: String,
          required: true
        },

        duration: {
          value: Number,
          unit: {
            type: String,
            enum: ['MINUTES', 'HOURS']
          }
        },

        type: {
          type: String,
          enum: ['CLASS', 'LAB', 'BREAK', 'LUNCH', 'ASSEMBLY', 'SPORTS', 'FREE'],
          default: 'CLASS'
        }
      }
    ],

    // Break configuration
    breaks: [
      {
        breakName: String,
        startTime: String,
        endTime: String,
        duration: Number,
        type: {
          type: String,
          enum: ['SHORT_BREAK', 'LUNCH_BREAK', 'PRAYER', 'ASSEMBLY']
        }
      }
    ],

    // School timings
    schoolStartTime: String,

    schoolEndTime: String,

    totalSchoolHours: {
      value: Number,
      unit: String
    },

    // Shift configuration
    isMultiShift: {
      type: Boolean,
      default: false
    },

    shifts: [
      {
        shiftName: String,
        startTime: String,
        endTime: String,
        classes: [mongoose.Schema.Types.ObjectId]
      }
    ],

    // Configuration options
    allowPartialDays: {
      type: Boolean,
      default: false
    },

    hasEarlyLeaving: {
      type: Boolean,
      default: false
    },

    earlyLeavingTime: String,

    hasDelay: {
      type: Boolean,
      default: false
    },

    lateStartTime: String,

    // Flexibility
    fixedPeriods: {
      type: Boolean,
      default: true
    },

    flexibleDurationRange: {
      min: Number,
      max: Number
    },

    // Status and lifecycle
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'DRAFT'
    },

    isDefault: {
      type: Boolean,
      default: false
    },

    effectiveFrom: Date,

    effectiveTo: Date,

    // Rules and constraints
    consecutivePeriodsLimit: Number,

    minimumBreakBetweenPeriods: {
      value: Number,
      unit: String
    },

    maxClassesPerPeriod: Number,

    // Version management
    version: {
      type: Number,
      default: 1
    },

    previousVersions: [
      {
        versionNumber: Number,
        periods: [Object],
        breaks: [Object],
        replacedDate: Date,
        replacedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Creator and audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvalDate: Date,

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
periodConfigSchema.index({ schoolId: 1, status: 1 });
periodConfigSchema.index({ periodConfigCode: 1 }, { unique: true });
periodConfigSchema.index({ academicYearId: 1, schoolId: 1 });
periodConfigSchema.index({ isDefault: 1, schoolId: 1 });

// Pre-save middleware
periodConfigSchema.pre('save', async function (next) {
  // Auto-generate periodConfigCode if not provided
  if (!this.periodConfigCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('PeriodConfig').countDocuments({
      schoolId: this.schoolId
    });
    this.periodConfigCode = `PC-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('PeriodConfig', periodConfigSchema);
