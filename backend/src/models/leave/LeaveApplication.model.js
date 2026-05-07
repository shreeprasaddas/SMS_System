const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    applicationCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: LEAVE-{year}-{5-digit-count}'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userRole: {
      type: String,
      enum: ['TEACHER', 'ADMIN', 'STAFF', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD', 'COORDINATOR'],
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: true
    },
    leaveTypeName: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    totalDays: {
      type: Number,
      required: true,
      min: 0.5,
      comment: '0.5 for half day'
    },
    isHalfDay: {
      type: Boolean,
      default: false
    },
    halfDayType: {
      type: String,
      enum: ['MORNING', 'AFTERNOON'],
      comment: 'Only if isHalfDay is true'
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    attachments: [
      {
        fileName: String,
        fileURL: String,
        fileType: String,
        uploadedDate: Date
      }
    ],
    reliefArrangement: {
      classesAffected: [
        {
          classId: mongoose.Schema.Types.ObjectId,
          className: String,
          classDate: Date,
          reliefTeacherId: mongoose.Schema.Types.ObjectId,
          reliefTeacherName: String,
          status: {
            type: String,
            enum: ['ASSIGNED', 'CONFIRMED', 'PENDING'],
            default: 'PENDING'
          }
        }
      ],
      remarks: String
    },
    applicationStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'WITHDRAWN'],
      default: 'DRAFT',
      index: true
    },
    applicationDate: {
      type: Date,
      default: Date.now
    },
    submittedDate: Date,
    approvalHistory: [
      {
        approverUserId: mongoose.Schema.Types.ObjectId,
        approverName: String,
        approverRole: String,
        approvalLevel: Number,
        action: {
          type: String,
          enum: ['APPROVED', 'REJECTED', 'FORWARDED'],
          required: true
        },
        actionDate: {
          type: Date,
          default: Date.now
        },
        comments: String
      }
    ],
    finalApprovedBy: mongoose.Schema.Types.ObjectId,
    finalApprovedDate: Date,
    rejectionReason: String,
    rejectedBy: mongoose.Schema.Types.ObjectId,
    rejectionDate: Date,
    cancellationReason: String,
    cancelledBy: mongoose.Schema.Types.ObjectId,
    cancellationDate: Date,
    withdrawalReason: String,
    withdrawnDate: Date,
    communicationSent: {
      toTeacher: {
        type: Boolean,
        default: false
      },
      toPrincipal: {
        type: Boolean,
        default: false
      },
      toHOD: {
        type: Boolean,
        default: false
      },
      dateOfCommunication: Date
    },
    impactAssessment: {
      classesImpacted: Number,
      studentsImpacted: Number,
      remarks: String
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
    collection: 'leave_applications'
  }
);

// Indexes for multi-tenancy queries
leaveApplicationSchema.index({ schoolId: 1, applicationStatus: 1 });
leaveApplicationSchema.index({ schoolId: 1, userId: 1, startDate: 1 });
leaveApplicationSchema.index({ schoolId: 1, leaveTypeId: 1 });
leaveApplicationSchema.index({ startDate: 1, endDate: 1, schoolId: 1 });

// Pre-save middleware for code generation
leaveApplicationSchema.pre('save', async function (next) {
  if (!this.applicationCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LeaveApplication').countDocuments({
      schoolId: this.schoolId
    });
    this.applicationCode = `LEAVE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LeaveApplication', leaveApplicationSchema);
