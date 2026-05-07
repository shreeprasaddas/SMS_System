const mongoose = require('mongoose');

const disciplinaryActionSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    actionCode: {
      type: String,
      required: true,
      unique: true
    },

    // Related records
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    disciplineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DisciplineRecord',
      required: true
    },

    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    },

    // Action details
    actionType: {
      type: String,
      enum: [
        'VERBAL_WARNING',
        'WRITTEN_WARNING',
        'DETENTION',
        'SUSPENSION',
        'EXPULSION',
        'COUNSELING',
        'COMMUNITY_SERVICE',
        'GRADE_REDUCTION',
        'RESTITUTION',
        'BEHAVIOR_CONTRACT',
        'ACADEMIC_PROBATION',
        'PARENT_MEETING',
        'MONITORING',
        'RESTRICTION',
        'REMOVAL_FROM_EVENT',
        'OTHER'
      ],
      required: true
    },

    actionDescription: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ['MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'],
      required: true
    },

    // Issued by
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    issuanceDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    // Duration/Scope
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['DAYS', 'WEEKS', 'MONTHS', 'PERMANENT']
      }
    },

    startDate: Date,

    endDate: Date,

    // Conditions
    conditions: [
      {
        condition: String,
        isMet: Boolean,
        verificationDate: Date
      }
    ],

    // Specific action details

    // For detention
    detentionDetails: {
      date: Date,
      duration: Number, // in minutes
      location: String,
      supervisingOfficer: mongoose.Schema.Types.ObjectId
    },

    // For suspension
    suspensionDetails: {
      startDate: Date,
      endDate: Date,
      daysCount: Number,
      reason: String,
      canApply: {
        type: Boolean,
        default: true
      }
    },

    // For expulsion
    expulsionDetails: {
      effectiveDate: Date,
      permanent: Boolean,
      appealPossible: {
        type: Boolean,
        default: true
      },
      appealDeadline: Date
    },

    // For community service
    communityServiceDetails: {
      hours: Number,
      activity: String,
      supervisor: String,
      location: String
    },

    // For counseling
    counselingDetails: {
      counselor: mongoose.Schema.Types.ObjectId,
      sessions: Number,
      startDate: Date,
      topics: [String]
    },

    // For grade reduction
    gradeReductionDetails: {
      subject: String,
      percentage: Number,
      assignment: String,
      assessmentType: String
    },

    // For restitution
    restitutionDetails: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      },
      itemsToReplace: [String],
      deadline: Date,
      paymentStatus: {
        type: String,
        enum: ['PENDING', 'PARTIAL', 'COMPLETED'],
        default: 'PENDING'
      }
    },

    // For behavior contract
    behaviorContractDetails: {
      contractDate: Date,
      expectations: [String],
      reviewFrequency: String,
      reviewDate: Date
    },

    // Status
    status: {
      type: String,
      enum: ['ISSUED', 'ACTIVE', 'SERVING', 'SERVED', 'COMPLETED', 'CANCELLED', 'UNDER_APPEAL', 'APPEALED'],
      default: 'ISSUED'
    },

    // Compliance tracking
    isCompliant: Boolean,

    complianceNotes: String,

    complianceVerificationDate: Date,

    // Appeal information
    appealed: Boolean,

    appealedDate: Date,

    appealedBy: {
      type: String,
      enum: ['STUDENT', 'PARENT', 'GUARDIAN']
    },

    appealReason: String,

    appealDecision: {
      type: String,
      enum: ['UPHELD', 'OVERTURNED', 'MODIFIED', 'PENDING'],
      default: 'PENDING'
    },

    appealDecisionDate: Date,

    appealDecisionNotes: String,

    // Parent/Guardian notification
    parentNotified: Boolean,

    parentNotificationDate: Date,

    parentNotificationMethod: {
      type: String,
      enum: ['PHONE', 'EMAIL', 'IN_PERSON', 'SMS', 'LETTER']
    },

    parentAcknowledged: Boolean,

    parentAcknowledgeDate: Date,

    // Student acknowledgment
    studentAcknowledged: Boolean,

    studentAcknowledgeDate: Date,

    // Documentation
    documentation: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadDate: Date
      }
    ],

    // Evidence of completion
    completionEvidence: [
      {
        description: String,
        date: Date,
        verifiedBy: mongoose.Schema.Types.ObjectId,
        attachments: [String]
      }
    ],

    // Review and closure
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    reviewDate: Date,

    reviewNotes: String,

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    closureDate: Date,

    closureReason: String,

    // Effectiveness assessment
    effectiveness: {
      type: String,
      enum: ['VERY_EFFECTIVE', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_ASSESSED'],
      default: 'NOT_ASSESSED'
    },

    effectivenessNotes: String,

    // Audit trail
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

// Indexes for frequently queried fields
disciplinaryActionSchema.index({ schoolId: 1, status: 1 });
disciplinaryActionSchema.index({ actionCode: 1 }, { unique: true });
disciplinaryActionSchema.index({ studentId: 1, schoolId: 1 });
disciplinaryActionSchema.index({ disciplineRecordId: 1, schoolId: 1 });
disciplinaryActionSchema.index({ actionType: 1, schoolId: 1 });
disciplinaryActionSchema.index({ issuanceDate: 1, schoolId: 1 });
disciplinaryActionSchema.index({ endDate: 1, schoolId: 1 });
disciplinaryActionSchema.index({ status: 1, issuanceDate: 1, schoolId: 1 });

// Pre-save middleware
disciplinaryActionSchema.pre('save', async function (next) {
  // Auto-generate actionCode if not provided
  if (!this.actionCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('DisciplinaryAction').countDocuments({
      schoolId: this.schoolId
    });
    this.actionCode = `ACT-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('DisciplinaryAction', disciplinaryActionSchema);
