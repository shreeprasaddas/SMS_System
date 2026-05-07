/**
 * Leave Approval Model
 * Schema for tracking leave approval workflow and history
 */

const mongoose = require('mongoose');

const leaveApprovalSchema = new mongoose.Schema(
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
    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leave',
      required: true,
      index: true,
    },
    leaveCode: {
      type: String,
      required: true,
    },
    approvalLevel: {
      type: Number,
      required: true,
    },
    approverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    approverName: {
      type: String,
    },
    approverRole: {
      type: String,
    },
    approverDesignation: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'SKIPPED'],
      default: 'PENDING',
      index: true,
    },
    actionTakenDate: {
      type: Date,
    },
    approvalRemarks: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    returnReason: {
      type: String,
    },
    delegatedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    delegatedToName: {
      type: String,
    },
    delegationReason: {
      type: String,
    },
    delegationStartDate: {
      type: Date,
    },
    delegationEndDate: {
      type: Date,
    },
    responseTime: {
      type: Number,
    },
    responseTimeUnit: {
      type: String,
      enum: ['HOURS', 'DAYS'],
      default: 'HOURS',
    },
    escalation: {
      isEscalated: Boolean,
      escalationDate: Date,
      escalationReason: String,
      escalatedToUserId: mongoose.Schema.Types.ObjectId,
    },
    comments: [
      {
        commentBy: mongoose.Schema.Types.ObjectId,
        commentDate: { type: Date, default: () => new Date() },
        commentText: String,
      },
    ],
    attachments: [
      {
        fileId: String,
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
      },
    ],
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
leaveApprovalSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('LAPP', this.schoolId);
  }
  // Calculate response time if action taken
  if (this.actionTakenDate && !this.responseTime) {
    const createdTime = this.createdAt;
    this.responseTime = Math.ceil((this.actionTakenDate - createdTime) / (1000 * 60 * 60));
    this.responseTimeUnit = 'HOURS';
  }
  next();
});

// Virtual: is pending
leaveApprovalSchema.virtual('isPending').get(function () {
  return this.status === 'PENDING';
});

// Virtual: is approved
leaveApprovalSchema.virtual('isApproved').get(function () {
  return this.status === 'APPROVED';
});

// Virtual: is overdue (pending for more than 3 days)
leaveApprovalSchema.virtual('isOverdue').get(function () {
  if (this.status !== 'PENDING') return false;
  const now = new Date();
  const daysDiff = (now - this.createdAt) / (1000 * 60 * 60 * 24);
  return daysDiff > 3;
});

// Compound index
leaveApprovalSchema.index({ schoolId: 1, leaveId: 1 });
leaveApprovalSchema.index({ approverUserId: 1, status: 1 });
leaveApprovalSchema.index({ leaveId: 1, approvalLevel: 1 });

leaveApprovalSchema.set('toJSON', { virtuals: true });
leaveApprovalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeaveApproval', leaveApprovalSchema);
