const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    leaveTypeCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: LT-{year}-{5-digit-count}'
    },
    leaveTypeName: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    leaveCategory: {
      type: String,
      enum: ['CASUAL', 'EARNED', 'SICK', 'MATERNITY', 'PATERNITY', 'SABBATICAL', 'STUDY', 'SPECIAL', 'UNPAID', 'OTHER'],
      required: true,
      index: true
    },
    applicableToRoles: [
      {
        type: String,
        enum: ['TEACHER', 'ADMIN', 'STAFF', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD', 'COORDINATOR', 'ALL']
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    paidLeave: {
      type: Boolean,
      default: true,
      comment: 'True if salary is paid during leave'
    },
    requiresDocumentation: {
      type: Boolean,
      default: false,
      comment: 'True if documents like medical certificate are required'
    },
    attachmentRequired: {
      type: Boolean,
      default: false
    },
    allowMultipleDays: {
      type: Boolean,
      default: true
    },
    maximumConsecutiveDays: {
      type: Number,
      comment: 'Maximum consecutive days allowed'
    },
    advanceNotificationDays: {
      type: Number,
      default: 0,
      comment: 'Days in advance notification is required'
    },
    approvalRequired: {
      type: Boolean,
      default: true
    },
    approverRole: {
      type: String,
      enum: ['PRINCIPAL', 'HOD', 'ADMIN', 'HR'],
      default: 'PRINCIPAL'
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
    collection: 'leave_types'
  }
);

// Indexes for multi-tenancy queries
leaveTypeSchema.index({ schoolId: 1, status: 1 });
leaveTypeSchema.index({ schoolId: 1, leaveCategory: 1 });

// Pre-save middleware for code generation
leaveTypeSchema.pre('save', async function (next) {
  if (!this.leaveTypeCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LeaveType').countDocuments({
      schoolId: this.schoolId
    });
    this.leaveTypeCode = `LT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
