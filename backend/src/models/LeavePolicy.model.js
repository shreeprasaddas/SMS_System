/**
 * Leave Policy Model
 * Schema for managing school-wide leave policies
 */

const mongoose = require('mongoose');

const leavePolicySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    policyName: {
      type: String,
      required: true,
      trim: true,
    },
    policyCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    effectiveFromDate: {
      type: Date,
      required: true,
    },
    effectiveToDate: {
      type: Date,
    },
    applicableFor: [
      {
        type: String,
        enum: ['TEACHER', 'STAFF', 'STUDENT', 'PRINCIPAL', 'ADMIN'],
      },
    ],
    leaveTypes: [
      {
        leaveTypeId: mongoose.Schema.Types.ObjectId,
        leaveTypeCode: String,
        maxDaysAllowed: Number,
      },
    ],
    generalPolicy: {
      minimumNoticePeriod: Number,
      minimumNoticePeriodUnit: { type: String, enum: ['DAYS', 'HOURS'] },
      maximumContinuousLeave: Number,
      maximumLeavesPerMonth: Number,
      leaveStartingDay: {
        type: String,
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      },
    },
    weekendPolicy: {
      countWeekendInLeave: Boolean,
      countHolidayInLeave: Boolean,
    },
    approvalWorkflow: {
      requiresApproval: Boolean,
      numberOfApprovalsRequired: Number,
      approverHierarchy: [
        {
          level: Number,
          role: String,
          designation: String,
        },
      ],
      approvalTimeLimit: Number,
      approvalTimeLimitUnit: { type: String, enum: ['HOURS', 'DAYS'] },
    },
    penalties: {
      penaltyForLateSubmission: Boolean,
      penaltyDays: Number,
      penaltyDeductionMethod: {
        type: String,
        enum: ['SALARY_CUT', 'LEAVE_REDUCTION', 'WARNING'],
      },
      penaltyAmount: Number,
    },
    specialProvisions: {
      bonusLeaveForStaff: Number,
      leaveEncashmentAllowed: Boolean,
      encashmentPercentage: Number,
      carriedForwardAllowed: Boolean,
      carriedForwardPercentage: Number,
      maxCarriedForwardDays: Number,
    },
    exceptions: [
      {
        exceptionType: String,
        description: String,
        affectsRole: [String],
        specialConditions: String,
      },
    ],
    holidayMapping: {
      holidays: [
        {
          holidayName: String,
          holidayDate: Date,
          isOptional: Boolean,
        },
      ],
    },
    publicHolidays: [
      {
        name: String,
        date: Date,
        countAsLeave: Boolean,
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED'],
      default: 'DRAFT',
      index: true,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: {
      type: Date,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: () => new Date() },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate code
leavePolicySchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('LPOL', this.schoolId);
  }
  next();
});

// Virtual: is active
leavePolicySchema.virtual('isActive').get(function () {
  const now = new Date();
  return (
    this.status === 'ACTIVE' &&
    this.effectiveFromDate <= now &&
    (!this.effectiveToDate || now <= this.effectiveToDate)
  );
});

// Virtual: days until effective
leavePolicySchema.virtual('daysUntilEffective').get(function () {
  const now = new Date();
  if (this.effectiveFromDate <= now) return 0;
  return Math.ceil((this.effectiveFromDate - now) / (1000 * 60 * 60 * 24));
});

// Virtual: total leave types
leavePolicySchema.virtual('totalLeaveTypes').get(function () {
  return this.leaveTypes?.length || 0;
});

// Compound index
leavePolicySchema.index({ schoolId: 1, academicYear: 1 });
leavePolicySchema.index({ schoolId: 1, status: 1 });
leavePolicySchema.index({ effectiveFromDate: 1, effectiveToDate: 1 });

leavePolicySchema.set('toJSON', { virtuals: true });
leavePolicySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeavePolicy', leavePolicySchema);
