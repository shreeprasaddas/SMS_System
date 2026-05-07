const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Unique identifier
    incidentCode: {
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

    // Incident reporting
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    reportedDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    // Incident details
    incidentType: {
      type: String,
      enum: [
        'PHYSICAL_VIOLENCE',
        'BULLYING',
        'VERBAL_ABUSE',
        'SUBSTANCE_ABUSE',
        'ACADEMIC_MISCONDUCT',
        'PROPERTY_DAMAGE',
        'THEFT',
        'TRUANCY',
        'DISRUPTIVE_BEHAVIOR',
        'HARASSMENT',
        'INSUBORDINATION',
        'DRESS_CODE_VIOLATION',
        'MOBILE_PHONE_MISUSE',
        'LATE_ARRIVAL',
        'ABSENCE_WITHOUT_LEAVE',
        'VANDALISM',
        'INAPPROPRIATE_CONDUCT',
        'OTHER'
      ],
      required: true
    },

    severity: {
      type: String,
      enum: ['MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL'],
      required: true
    },

    incidentDate: {
      type: Date,
      required: true
    },

    incidentTime: String,

    incidentLocation: {
      type: String,
      enum: ['CLASSROOM', 'CORRIDOR', 'PLAYGROUND', 'CAFETERIA', 'RESTROOM', 'DORMITORY', 'TRANSPORT', 'GATE', 'OFFICE', 'OTHER'],
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    // Witnesses
    witnesses: [
      {
        name: String,
        contact: String,
        statement: String
      }
    ],

    // Involved parties
    involvedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],

    involvedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Injuries or damages
    injuriesReported: Boolean,

    injuryDetails: {
      description: String,
      severity: {
        type: String,
        enum: ['MINOR', 'MODERATE', 'SEVERE']
      },
      medicalAttention: Boolean,
      hospitalAdmitted: Boolean
    },

    propertyDamage: Boolean,

    damageDetails: {
      description: String,
      estimatedCost: Number,
      itemsDamaged: [String]
    },

    // Initial investigation
    investigationStatus: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PENDING_REVIEW'],
      default: 'NOT_STARTED'
    },

    investigatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    investigationNotes: String,

    investigationDate: Date,

    // Evidence
    evidenceCollected: Boolean,

    evidence: [
      {
        type: String,
        description: String,
        fileUrl: String
      }
    ],

    // Findings
    findings: String,

    responsibilityConfirmed: Boolean,

    // Status
    status: {
      type: String,
      enum: ['REPORTED', 'UNDER_INVESTIGATION', 'AWAITING_DECISION', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'APPEALED'],
      default: 'REPORTED'
    },

    // Parent/Guardian notification
    parentNotified: Boolean,

    parentNotificationDate: Date,

    parentNotificationMethod: {
      type: String,
      enum: ['PHONE', 'EMAIL', 'IN_PERSON', 'SMS', 'LETTER']
    },

    parentResponse: String,

    // Police involvement
    policeInvolved: Boolean,

    policeReportNumber: String,

    policeReportDate: Date,

    // Attachments
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String
      }
    ],

    // Related discipline records
    relatedDisciplineRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DisciplineRecord'
      }
    ],

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
incidentSchema.index({ schoolId: 1, status: 1 });
incidentSchema.index({ incidentCode: 1 }, { unique: true });
incidentSchema.index({ studentId: 1, schoolId: 1 });
incidentSchema.index({ incidentType: 1, schoolId: 1 });
incidentSchema.index({ severity: 1, schoolId: 1 });
incidentSchema.index({ incidentDate: 1, schoolId: 1 });
incidentSchema.index({ status: 1, reportedDate: 1, schoolId: 1 });

// Pre-save middleware
incidentSchema.pre('save', async function (next) {
  // Auto-generate incidentCode if not provided
  if (!this.incidentCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Incident').countDocuments({
      schoolId: this.schoolId
    });
    this.incidentCode = `INC-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Incident', incidentSchema);
