const mongoose = require('mongoose');

const disciplineRecordSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    recordCode: {
      type: String,
      required: true,
      unique: true
    },

    // Student details
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    // Linked incident
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    },

    // Record officer
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    recordDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    // Offense details
    offenseCategory: {
      type: String,
      enum: [
        'ACADEMIC',
        'BEHAVIORAL',
        'ATTENDANCE',
        'DRESS_CODE',
        'CONDUCT',
        'VIOLENCE',
        'SUBSTANCE',
        'PROPERTY',
        'OTHER'
      ],
      required: true
    },

    offenseDescription: {
      type: String,
      required: true,
      trim: true
    },

    frequency: {
      type: Number,
      default: 1,
      min: 1
    },

    // Severity classification
    severity: {
      type: String,
      enum: ['MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'],
      required: true
    },

    // Circumstances
    circumstances: String,

    // Contributing factors
    contributingFactors: [String],

    // Student's version
    studentStatement: String,

    // Admission of guilt
    admittedGuilt: {
      type: Boolean,
      default: null
    },

    admissionDetails: String,

    // Status
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DISMISSED', 'UNDER_APPEAL'],
      default: 'PENDING_REVIEW'
    },

    // Previous history
    previousIncidents: {
      totalCount: Number,
      lastIncidentDate: Date,
      lastIncidentType: String
    },

    // Pattern analysis
    isRepeatOffender: Boolean,

    patternNotes: String,

    // Contextual information
    academicPerformance: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'FAILING']
    },

    behavioralHistory: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR']
    },

    homeCircumstances: String,

    socialBackground: String,

    // Recommendations
    recommendedAction: [
      {
        type: String,
        enum: [
          'VERBAL_WARNING',
          'WRITTEN_WARNING',
          'DETENTION',
          'SUSPENSION',
          'EXPULSION',
          'COUNSELING',
          'COMMUNITY_SERVICE',
          'PARENT_MEETING',
          'GRADE_REDUCTION',
          'RESTITUTION',
          'BEHAVIOR_CONTRACT',
          'MONITORING'
        ]
      }
    ],

    recommendationNotes: String,

    recommendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    recommendationDate: Date,

    // Review information
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    reviewDate: Date,

    reviewNotes: String,

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvalDate: Date,

    approvalReason: String,

    // Parent/Guardian consultation
    parentConsulted: Boolean,

    parentConsultationDate: Date,

    parentResponse: String,

    // Mitigating factors
    mitigatingFactors: [String],

    // Links to support services
    counselingRequired: Boolean,

    mentalHealthConcerns: String,

    supportServicesReferred: [
      {
        serviceName: String,
        referralDate: Date,
        referralReason: String
      }
    ],

    // Attachments
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String
      }
    ],

    // Expiry/Review dates
    reviewDueDate: Date,

    recordExpiryDate: Date,

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
disciplineRecordSchema.index({ schoolId: 1, status: 1 });
disciplineRecordSchema.index({ recordCode: 1 }, { unique: true });
disciplineRecordSchema.index({ studentId: 1, schoolId: 1 });
disciplineRecordSchema.index({ incidentId: 1, schoolId: 1 });
disciplineRecordSchema.index({ offenseCategory: 1, schoolId: 1 });
disciplineRecordSchema.index({ severity: 1, schoolId: 1 });
disciplineRecordSchema.index({ recordDate: 1, schoolId: 1 });
disciplineRecordSchema.index({ status: 1, recordDate: 1, schoolId: 1 });

// Pre-save middleware
disciplineRecordSchema.pre('save', async function (next) {
  // Auto-generate recordCode if not provided
  if (!this.recordCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('DisciplineRecord').countDocuments({
      schoolId: this.schoolId
    });
    this.recordCode = `DIS-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('DisciplineRecord', disciplineRecordSchema);
