const mongoose = require('mongoose');

const leavePolicySchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    policyCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: LP-{year}-{5-digit-count}'
    },
    policyName: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },
    effectiveFrom: {
      type: Date,
      required: true
    },
    effectiveTo: {
      type: Date,
      required: true
    },
    applicableRoles: [
      {
        role: {
          type: String,
          enum: ['TEACHER', 'ADMIN', 'STAFF', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD', 'COORDINATOR'],
          required: true
        },
        leavesAllocated: [
          {
            leaveTypeId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'LeaveType',
              required: true
            },
            allocatedDays: {
              type: Number,
              required: true,
              min: 0
            },
            carryForwardDays: {
              type: Number,
              default: 0,
              comment: 'Days that can be carried forward to next year'
            },
            encashableDays: {
              type: Number,
              default: 0,
              comment: 'Days that can be encashed'
            }
          }
        ]
      }
    ],
    leaveRules: {
      halfDayAllowed: {
        type: Boolean,
        default: false
      },
      leaveOnWeekends: {
        type: Boolean,
        default: false
      },
      leaveOnPublicHolidays: {
        type: Boolean,
        default: false
      },
      maximumLeavePerRequest: {
        type: Number,
        default: 5,
        comment: 'Maximum consecutive days allowed per request'
      },
      leaveRequestAdvanceDays: {
        type: Number,
        default: 2,
        comment: 'Days in advance leave must be requested'
      },
      lastMinuteLeaveAllowed: {
        type: Boolean,
        default: false
      },
      lastMinuteNoticeDays: {
        type: Number,
        default: 1
      }
    },
    approvalWorkflow: {
      requiresApproval: {
        type: Boolean,
        default: true
      },
      approvalLevels: [
        {
          level: {
            type: Number,
            min: 1,
            max: 3,
            comment: '1 = Department HOD, 2 = Principal, 3 = Management'
          },
          role: String,
          timeLimit: {
            type: Number,
            comment: 'Hours within which approval must be given'
          }
        }
      ],
      autoApprovalAfter: {
        type: Number,
        comment: 'Hours after which leave is auto-approved if not reviewed'
      }
    },
    restrictions: {
      noLeaveOnFestivalDays: {
        type: Boolean,
        default: true
      },
      noLeaveBeforeExams: {
        type: Boolean,
        default: false
      },
      daysBeforeExamsRestricted: {
        type: Number,
        comment: 'Number of days before exam when leave is restricted'
      },
      maximumConcurrentLeaves: {
        type: Number,
        comment: 'Maximum number of staff members on leave at a time'
      }
    },
    publicHolidaysApplicable: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Holiday'
      }
    ],
    remarksTemplate: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    remarks: String,
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        changes: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: 'leave_policies'
  }
);

// Indexes for multi-tenancy queries
leavePolicySchema.index({ schoolId: 1, status: 1 });
leavePolicySchema.index({ schoolId: 1, academicYearId: 1 });
leavePolicySchema.index({ schoolId: 1, isDefault: 1 });

// Pre-save middleware for code generation
leavePolicySchema.pre('save', async function (next) {
  if (!this.policyCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LeavePolicy').countDocuments({
      schoolId: this.schoolId
    });
    this.policyCode = `LP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LeavePolicy', leavePolicySchema);
