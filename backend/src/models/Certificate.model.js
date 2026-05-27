/**
 * Certificate Model
 * Represents certificate templates and master certificate definitions
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const certificateSchema = new mongoose.Schema(
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
    certificateName: {
      type: String,
      required: true,
      trim: true,
    },
    certificateType: {
      type: String,
      enum: [
        'ACADEMIC_ACHIEVEMENT',
        'PARTICIPATION',
        'CONDUCT',
        'SPORTS',
        'CULTURAL',
        'CO_CURRICULAR',
        'ACHIEVEMENT',
        'MERIT',
        'COMPLETION',
        'SPECIAL_RECOGNITION',
        'OTHER',
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    issuedFor: {
      type: String,
      enum: ['STUDENTS', 'TEACHERS', 'STAFF', 'EVENTS', 'PROGRAMS', 'ALL'],
      required: true,
    },
    designTemplate: {
      templateName: String,
      logoUrl: String,
      backgroundImageUrl: String,
      borderStyle: String,
      fontFamily: String,
      certificateLayout: {
        orientation: { type: String, enum: ['PORTRAIT', 'LANDSCAPE'] },
        width: Number,
        height: Number,
      },
    },
    fields: [
      {
        fieldName: String,
        fieldType: {
          type: String,
          enum: ['TEXT', 'DATE', 'NUMBER', 'NAME', 'ACHIEVEMENT'],
        },
        position: {
          x: Number,
          y: Number,
        },
        fontSize: Number,
        fontStyle: String,
        required: Boolean,
      },
    ],
    signatories: [
      {
        name: String,
        designation: String,
        signatureImageUrl: String,
        order: Number,
      },
    ],
    validityPeriod: {
      hasExpiry: Boolean,
      validityDays: Number,
      expiryDate: Date,
    },
    issueStartDate: {
      type: Date,
      default: Date.now,
    },
    issueEndDate: Date,
    certificateNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DISCONTINUED'],
      default: 'ACTIVE',
      index: true,
    },
    issuedCount: {
      type: Number,
      default: 0,
    },
    approvalRequired: {
      type: Boolean,
      default: false,
    },
    approverRoles: [String],
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware for code generation
certificateSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('CERT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
certificateSchema.index({ schoolId: 1, status: 1 });
certificateSchema.index({ schoolId: 1, certificateType: 1 });
certificateSchema.index({ schoolId: 1, issuedFor: 1 });
certificateSchema.index({ code: 1, schoolId: 1 });

// Virtual: Days until expiry
certificateSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.issueEndDate) return null;
  const now = new Date();
  const timeDiff = this.issueEndDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is expired
certificateSchema.virtual('isExpired').get(function () {
  if (!this.issueEndDate) return false;
  return new Date() > this.issueEndDate;
});

module.exports = mongoose.model('Certificate', certificateSchema);
