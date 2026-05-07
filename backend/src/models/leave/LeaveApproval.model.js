const mongoose = require('mongoose');

const leaveApprovalSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    approvalCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: APPV-{year}-{5-digit-count}'
    },
    leaveApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveApplication',
      required: true,
      index: true
    },
    applicationCode: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType'
    },
    leaveStartDate: Date,
    leaveEndDate: Date,
    totalLeaveDays: Number,
    approvalLevel: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
      comment: '1 = HOD, 2 = Principal, 3 = Management'
    },
    assignedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedToRole: {
      type: String,
      enum: ['HOD', 'PRINCIPAL', 'MANAGEMENT', 'ADMIN'],
      required: true
    },
    assignedToName: String,
    assignedDate: {
      type: Date,
      default: Date.now
    },
    assignmentStatus: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'FORWARDED', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    reviewedDate: Date,
    reviewComments: String,
    reviewAttachments: [
      {
        fileName: String,
        fileURL: String,
        uploadedDate: Date
      }
    ],
    approvalDecision: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'FORWARDED'],
      default: 'PENDING'
    },
    decisionReason: String,
    decisionDate: Date,
    decidedBy: mongoose.Schema.Types.ObjectId,
    decidedByName: String,
    forwardedToLevel: {
      type: Number,
      comment: 'If forwarded, which level (2 or 3)'
    },
    forwardedToUserId: mongoose.Schema.Types.ObjectId,
    forwardedDate: Date,
    forwardingNotes: String,
    conditionsApplied: [
      {
        condition: String,
        mandatory: Boolean,
        fulfillmentDate: Date,
        status: {
          type: String,
          enum: ['PENDING', 'FULFILLED', 'WAIVED'],
          default: 'PENDING'
        }
      }
    ],
    timeAllowedForReview: {
      type: Number,
      comment: 'Hours allowed for review'
    },
    timeRemainingForReview: {
      type: Number,
      comment: 'Hours remaining for review'
    },
    reviewTimeExceeded: {
      type: Boolean,
      default: false
    },
    escalated: {
      type: Boolean,
      default: false
    },
    escalationReason: String,
    escalatedToUserId: mongoose.Schema.Types.ObjectId,
    escalationDate: Date,
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentDate: Date,
    reminderCount: {
      type: Number,
      default: 0
    },
    communicationLog: [
      {
        communicationType: {
          type: String,
          enum: ['EMAIL', 'SMS', 'IN_APP', 'MANUAL'],
          default: 'EMAIL'
        },
        sentTo: String,
        sentDate: {
          type: Date,
          default: Date.now
        },
        subject: String,
        message: String
      }
    ],
    auditTrail: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        performedByName: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        details: String
      }
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
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
    collection: 'leave_approvals'
  }
);

// Indexes for multi-tenancy queries
leaveApprovalSchema.index({ schoolId: 1, assignmentStatus: 1 });
leaveApprovalSchema.index({ schoolId: 1, leaveApplicationId: 1 });
leaveApprovalSchema.index({ schoolId: 1, assignedToUserId: 1, assignmentStatus: 1 });
leaveApprovalSchema.index({ schoolId: 1, approvalLevel: 1, assignmentStatus: 1 });

// Pre-save middleware for code generation
leaveApprovalSchema.pre('save', async function (next) {
  if (!this.approvalCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LeaveApproval').countDocuments({
      schoolId: this.schoolId
    });
    this.approvalCode = `APPV-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LeaveApproval', leaveApprovalSchema);
