/**
 * Leave Type Model
 * Schema for defining types of leave available in the school
 */

const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema(
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
    leaveTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    leaveTypeCode: {
      type: String,
      enum: ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL'],
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    applicableFor: [
      {
        type: String,
        enum: ['TEACHER', 'STAFF', 'STUDENT', 'PRINCIPAL', 'ADMIN'],
      },
    ],
    annualLimit: {
      type: Number,
      required: true,
    },
    isCumulativeAllowed: {
      type: Boolean,
      default: false,
    },
    cumulativeLimit: {
      type: Number,
    },
    minDuration: {
      type: Number,
      default: 0.5,
    },
    maxDuration: {
      type: Number,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
    numberOfApprovalsRequired: {
      type: Number,
      default: 1,
    },
    approvalHierarchy: [
      {
        approvalLevel: Number,
        approverRole: String,
        approverDesignation: String,
      },
    ],
    requiresAttachment: {
      type: Boolean,
      default: false,
    },
    attachmentType: [String],
    requiresReplacement: {
      type: Boolean,
      default: false,
    },
    genderBased: {
      type: Boolean,
      default: false,
    },
    maleLimit: Number,
    femaleLimit: Number,
    requiresNotification: {
      type: Boolean,
      default: true,
    },
    notifyRoles: [String],
    carriedForwardAllowed: {
      type: Boolean,
      default: false,
    },
    carriedForwardPercentage: {
      type: Number,
      default: 0,
    },
    encashmentAllowed: {
      type: Boolean,
      default: false,
    },
    encashmentPercentage: {
      type: Number,
      default: 0,
    },
    rateOfPay: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
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
leaveTypeSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('LEAVT', this.schoolId);
  }
  next();
});

// Virtual: is gender based policy
leaveTypeSchema.virtual('isGenderBasedPolicy').get(function () {
  return this.genderBased === true;
});

// Compound index
leaveTypeSchema.index({ schoolId: 1, leaveTypeCode: 1 });
leaveTypeSchema.index({ schoolId: 1, status: 1 });

leaveTypeSchema.set('toJSON', { virtuals: true });
leaveTypeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
