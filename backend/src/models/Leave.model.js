/**
 * Leave Model
 * Schema for managing employee and student leave requests
 */

const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
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
    leaveRequestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: true,
    },
    leaveTypeCode: {
      type: String,
      enum: ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'STUDY', 'SABBATICAL', 'EMERGENCY', 'HALF_DAY', 'SPECIAL'],
      required: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    durationUnit: {
      type: String,
      enum: ['DAYS', 'HOURS', 'HALF_DAY'],
      default: 'DAYS',
    },
    reason: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileId: String,
        fileName: String,
        fileUrl: String,
        uploadDate: { type: Date, default: () => new Date() },
      },
    ],
    approvers: [
      {
        approverId: mongoose.Schema.Types.ObjectId,
        approverName: String,
        approverRole: String,
        sequenceNumber: Number,
      },
    ],
    currentApprovalLevel: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
      default: 'DRAFT',
      index: true,
    },
    approvalDetails: {
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvedDate: Date,
      approvalRemarks: String,
      rejectionReason: String,
      rejectedDate: Date,
      rejectedBy: mongoose.Schema.Types.ObjectId,
    },
    replacementArrangement: {
      isArrangementRequired: Boolean,
      replacementPersonId: mongoose.Schema.Types.ObjectId,
      replacementPersonName: String,
      arrangementDescription: String,
      arrangementApproved: Boolean,
    },
    notificationDetails: {
      notifiedTo: [mongoose.Schema.Types.ObjectId],
      notificationSentDate: Date,
      notificationMethod: [String],
    },
    workCompletionStatus: {
      isWorkTransferred: Boolean,
      transferredTo: mongoose.Schema.Types.ObjectId,
      transferDate: Date,
      workResumeDate: Date,
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
leaveSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('LEAVE', this.schoolId);
  }
  next();
});

// Virtual: days remaining
leaveSchema.virtual('daysRemaining').get(function () {
  if (!this.toDate) return null;
  const now = new Date();
  return Math.max(0, Math.ceil((this.toDate - now) / (1000 * 60 * 60 * 24)));
});

// Virtual: is ongoing
leaveSchema.virtual('isOngoing').get(function () {
  const now = new Date();
  return this.fromDate <= now && now <= this.toDate;
});

// Virtual: is expired
leaveSchema.virtual('isExpired').get(function () {
  return new Date() > this.toDate;
});

// Virtual: approval progress
leaveSchema.virtual('approvalProgress').get(function () {
  if (!this.approvers || this.approvers.length === 0) return 0;
  return Math.round((this.currentApprovalLevel / this.approvers.length) * 100);
});

// Compound index
leaveSchema.index({ schoolId: 1, leaveRequestBy: 1 });
leaveSchema.index({ schoolId: 1, status: 1 });
leaveSchema.index({ fromDate: 1, toDate: 1, schoolId: 1 });
leaveSchema.index({ leaveTypeCode: 1, schoolId: 1 });

leaveSchema.set('toJSON', { virtuals: true });
leaveSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Leave', leaveSchema);
