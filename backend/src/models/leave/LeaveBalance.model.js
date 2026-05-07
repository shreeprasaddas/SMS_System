const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    balanceCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: LB-{year}-{5-digit-count}'
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      enum: ['TEACHER', 'ADMIN', 'STAFF', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD', 'COORDINATOR'],
      required: true
    },
    leavesBreakdown: [
      {
        leaveTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LeaveType',
          required: true
        },
        leaveTypeName: String,
        allocatedDays: {
          type: Number,
          default: 0,
          comment: 'Days allocated in the policy'
        },
        usedDays: {
          type: Number,
          default: 0,
          comment: 'Days used so far'
        },
        balanceDays: {
          type: Number,
          default: 0,
          comment: 'Remaining days (allocatedDays - usedDays)'
        },
        pendingDays: {
          type: Number,
          default: 0,
          comment: 'Days in pending applications'
        },
        approvedDays: {
          type: Number,
          default: 0,
          comment: 'Approved but not yet taken'
        },
        carryForwardDays: {
          type: Number,
          default: 0,
          comment: 'Days carried over from previous year'
        },
        encashedDays: {
          type: Number,
          default: 0,
          comment: 'Days encashed as payment'
        },
        lastUpdatedDate: Date
      }
    ],
    totalAllocatedDays: {
      type: Number,
      default: 0
    },
    totalUsedDays: {
      type: Number,
      default: 0
    },
    totalBalanceDays: {
      type: Number,
      default: 0
    },
    totalPendingDays: {
      type: Number,
      default: 0
    },
    balanceStatus: {
      type: String,
      enum: ['ADEQUATE', 'CRITICAL', 'EXHAUSTED', 'NEGATIVE'],
      default: 'ADEQUATE',
      comment: 'ADEQUATE > 30%, CRITICAL 10-30%, EXHAUSTED 0-10%, NEGATIVE < 0'
    },
    criticalThreshold: {
      type: Number,
      default: 3,
      comment: 'Threshold number of days for critical status'
    },
    leaveUsageHistory: [
      {
        leaveApplicationId: mongoose.Schema.Types.ObjectId,
        leaveTypeId: mongoose.Schema.Types.ObjectId,
        startDate: Date,
        endDate: Date,
        daysTaken: Number,
        approvalDate: Date,
        status: String
      }
    ],
    carryForwardHistory: [
      {
        fromAcademicYear: String,
        leaveTypeId: mongoose.Schema.Types.ObjectId,
        carryForwardedDays: Number,
        carryForwardDate: Date,
        usageDeadline: Date
      }
    ],
    encashmentHistory: [
      {
        encashmentDate: Date,
        leaveTypeId: mongoose.Schema.Types.ObjectId,
        dayEncashed: Number,
        amountPerDay: Number,
        totalAmount: Number,
        remarks: String
      }
    ],
    lastBalanceCalculationDate: Date,
    nextBalanceCalculationDate: Date,
    balanceAdjustments: [
      {
        adjustmentDate: Date,
        adjustmentType: {
          type: String,
          enum: ['MANUAL_ADDITION', 'MANUAL_DEDUCTION', 'CORRECTION', 'PROMOTIONAL'],
          default: 'MANUAL_ADDITION'
        },
        leaveTypeId: mongoose.Schema.Types.ObjectId,
        adjustmentDays: Number,
        reason: String,
        approvedBy: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          default: 'PENDING'
        }
      }
    ],
    warnings: [
      {
        warningType: {
          type: String,
          enum: ['BALANCE_LOW', 'EXCEEDING_LIMITS', 'ENCASHMENT_DEADLINE', 'CARRYFORWARD_DEADLINE'],
          default: 'BALANCE_LOW'
        },
        warningDate: {
          type: Date,
          default: Date.now
        },
        resolved: {
          type: Boolean,
          default: false
        },
        resolvedDate: Date
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    remarks: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
    },
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
    collection: 'leave_balances'
  }
);

// Indexes for multi-tenancy queries
leaveBalanceSchema.index({ schoolId: 1, academicYearId: 1 });
leaveBalanceSchema.index({ schoolId: 1, userId: 1, academicYearId: 1 });
leaveBalanceSchema.index({ schoolId: 1, balanceStatus: 1 });

// Pre-save middleware for code generation
leaveBalanceSchema.pre('save', async function (next) {
  if (!this.balanceCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LeaveBalance').countDocuments({
      schoolId: this.schoolId
    });
    this.balanceCode = `LB-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
