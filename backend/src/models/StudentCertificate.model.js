/**
 * StudentCertificate Model
 * Represents certificates issued to students with issuance details and tracking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const studentCertificateSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      required: true,
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
    certificateContent: {
      recipientName: String,
      awardReason: String,
      awardDetails: String,
      academicYear: String,
      classOrBatch: String,
      percentage: Number,
      grade: String,
      performanceMetrics: mongoose.Schema.Types.Mixed,
    },
    certificateNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    issuanceDetails: {
      issuedDate: {
        type: Date,
        default: Date.now,
      },
      issuedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      issuedByDesignation: String,
      approverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvalDate: Date,
      approvalStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'APPROVED',
      },
      rejectionReason: String,
    },
    validityDetails: {
      issueDate: Date,
      expiryDate: Date,
      isValid: {
        type: Boolean,
        default: true,
      },
      validityStatus: {
        type: String,
        enum: ['VALID', 'EXPIRED', 'REVOKED', 'SUSPENDED'],
        default: 'VALID',
      },
    },
    distributionDetails: {
      distributedDate: Date,
      distributedBy: mongoose.Schema.Types.ObjectId,
      distributedMode: {
        type: String,
        enum: ['PHYSICAL', 'DIGITAL', 'EMAIL', 'PORTAL', 'BOTH'],
      },
      recipientEmail: String,
      digitalCertificateUrl: String,
      qrCode: String,
      trackingNumber: String,
    },
    certificateFile: {
      fileUrl: String,
      fileName: String,
      fileSize: Number,
      fileFormat: {
        type: String,
        enum: ['PDF', 'PNG', 'JPG'],
      },
      generationDate: Date,
    },
    verificationDetails: {
      verificationCode: {
        type: String,
        unique: true,
        sparse: true,
      },
      verificationUrl: String,
      verificationStatus: {
        type: String,
        enum: ['NOT_VERIFIED', 'VERIFIED', 'INVALID'],
        default: 'NOT_VERIFIED',
      },
      lastVerificationDate: Date,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ISSUED', 'DISTRIBUTED', 'REVOKED', 'REJECTED'],
      default: 'DRAFT',
      index: true,
    },
    remarks: String,
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
studentCertificateSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('SCERT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
studentCertificateSchema.index({ schoolId, status: 1 });
studentCertificateSchema.index({ schoolId, studentId: 1 });
studentCertificateSchema.index({ schoolId, certificateType: 1 });
studentCertificateSchema.index({ certificateNumber: 1, schoolId: 1 });

// Virtual: Days until expiry
studentCertificateSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.validityDetails?.expiryDate) return null;
  const now = new Date();
  const timeDiff = this.validityDetails.expiryDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is expired
studentCertificateSchema.virtual('isExpired').get(function () {
  if (!this.validityDetails?.expiryDate) return false;
  return new Date() > this.validityDetails.expiryDate;
});

// Virtual: Days since issuance
studentCertificateSchema.virtual('daysSinceIssuance').get(function () {
  const issueDate = this.issuanceDetails?.issuedDate || this.createdAt;
  const now = new Date();
  const timeDiff = now - issueDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('StudentCertificate', studentCertificateSchema);
