/**
 * Compliance Model
 * Represents compliance checklist and audit records
 */

const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  complianceName: {
    type: String,
    required: true,
    trim: true,
  },
  complianceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  complianceType: {
    type: String,
    enum: ['LEGAL', 'REGULATORY', 'INTERNAL', 'AUDIT', 'CERTIFICATION'],
    required: true,
  },
  category: {
    type: String,
    enum: ['DATA_PROTECTION', 'EDUCATIONAL', 'FINANCIAL', 'HR', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'OTHER'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  requirements: [{
    requirementId: {
      type: String,
      required: true,
      trim: true,
    },
    requirement: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'NOT_APPLICABLE'],
      default: 'NOT_APPLICABLE',
    },
    evidence: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    lastCheckedDate: {
      type: Date,
    },
    nextCheckDate: {
      type: Date,
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  overallStatus: {
    type: String,
    enum: ['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'PENDING'],
    default: 'PENDING',
  },
  compliancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  reviewDate: {
    type: Date,
  },
  nextReviewDate: {
    type: Date,
  },
  frequency: {
    type: String,
    enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY'],
    required: true,
  },
  gaps: [{
    gapDescription: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    correctionDeadline: {
      type: Date,
    },
    correctionStatus: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
      default: 'OPEN',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    closedDate: {
      type: Date,
    },
    closedNotes: {
      type: String,
      trim: true,
    },
  }],
  auditTrail: [{
    auditDate: {
      type: Date,
      default: Date.now,
    },
    auditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    findings: {
      type: String,
      trim: true,
    },
    recommendations: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
      trim: true,
    },
  }],
  attachments: [{
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      trim: true,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
complianceSchema.index({ schoolId: 1, complianceCode: 1 }, { unique: true });
complianceSchema.index({ schoolId: 1, complianceType: 1 });
complianceSchema.index({ schoolId: 1, category: 1 });
complianceSchema.index({ schoolId: 1, overallStatus: 1 });
complianceSchema.index({ schoolId: 1, deadline: 1 });

module.exports = mongoose.model('Compliance', complianceSchema);
