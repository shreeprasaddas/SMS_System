/**
 * SecurityPolicy Model
 * Represents security and compliance policies
 */

const mongoose = require('mongoose');

const securityPolicySchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  policyName: {
    type: String,
    required: true,
    trim: true,
  },
  policyCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  policyType: {
    type: String,
    enum: ['DATA_PROTECTION', 'ACCESS_CONTROL', 'PASSWORD', 'AUTHENTICATION', 'BACKUP', 'AUDIT', 'INCIDENT_RESPONSE', 'ACCEPTABLE_USE', 'CHANGE_MANAGEMENT', 'COMPLIANCE'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  version: {
    type: String,
    default: '1.0',
    trim: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'APPROVED', 'ACTIVE', 'RETIRED'],
    default: 'DRAFT',
  },
  applicableTo: [{
    type: String,
    enum: ['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'CONTRACTOR', 'THIRD_PARTY'],
  }],
  requirements: [{
    requirement: {
      type: String,
      required: true,
      trim: true,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'ON_DEMAND'],
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  lastReviewDate: {
    type: Date,
  },
  nextReviewDate: {
    type: Date,
  },
  reviewCycle: {
    type: Number,
    default: 12, // months
    min: 1,
    max: 60,
  },
  keywords: [{
    type: String,
    trim: true,
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
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
securityPolicySchema.index({ schoolId: 1, policyCode: 1 }, { unique: true });
securityPolicySchema.index({ schoolId: 1, policyType: 1 });
securityPolicySchema.index({ schoolId: 1, status: 1 });
securityPolicySchema.index({ schoolId: 1, effectiveDate: 1 });

module.exports = mongoose.model('SecurityPolicy', securityPolicySchema);
