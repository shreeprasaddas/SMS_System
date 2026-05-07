const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    // Multi-tenancy
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    timeSlotCode: {
      type: String,
      required: true,
      unique: true
    },

    // Basic information
    slotName: {
      type: String,
      required: true,
      trim: true
    },

    slotLabel: String,

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },

    // Time configuration
    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    duration: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        enum: ['MINUTES', 'HOURS'],
        default: 'MINUTES'
      }
    },

    // Slot type
    slotType: {
      type: String,
      enum: ['TEACHING', 'BREAK', 'LUNCH', 'ASSEMBLY', 'SPORTS', 'ACTIVITY', 'FREE'],
      required: true
    },

    // Period information
    periodNumber: {
      type: Number,
      required: true
    },

    isBreak: {
      type: Boolean,
      default: false
    },

    breakDescription: String,

    // Slot configuration
    allowTeacherSwap: {
      type: Boolean,
      default: true
    },

    allowRoomChange: {
      type: Boolean,
      default: true
    },

    mandatory: {
      type: Boolean,
      default: true
    },

    capacity: {
      min: Number,
      max: Number
    },

    // Applicability
    applicableClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
      }
    ],

    applicableToAllClasses: {
      type: Boolean,
      default: false
    },

    daysApplicable: [
      {
        type: String,
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      }
    ],

    // Status
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
    },

    // Resource tracking
    resourcesRequired: [
      {
        resourceType: {
          type: String,
          enum: ['CLASSROOM', 'LAB', 'GYM', 'HALL', 'AUDITORIUM', 'OTHER']
        },
        quantity: Number,
        notes: String
      }
    ],

    // Constraints
    constraints: [String],

    specialNotes: String,

    // Usage statistics
    usageCount: {
      type: Number,
      default: 0
    },

    lastUsedDate: Date,

    // Version and audit
    version: {
      type: Number,
      default: 1
    },

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
timeSlotSchema.index({ schoolId: 1, status: 1 });
timeSlotSchema.index({ timeSlotCode: 1 }, { unique: true });
timeSlotSchema.index({ academicYearId: 1, schoolId: 1 });
timeSlotSchema.index({ periodNumber: 1, schoolId: 1 });
timeSlotSchema.index({ startTime: 1, endTime: 1, schoolId: 1 });

// Pre-save middleware
timeSlotSchema.pre('save', async function (next) {
  // Auto-generate timeSlotCode if not provided
  if (!this.timeSlotCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('TimeSlot').countDocuments({
      schoolId: this.schoolId
    });
    this.timeSlotCode = `TS-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
