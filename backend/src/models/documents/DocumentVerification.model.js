/**
 * DocumentVerification Model
 * Tracks verification of documents and authenticity checks
 */

const mongoose = require('mongoose');

const documentVerificationSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  verificationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentIssued',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'PROVISIONAL_CERTIFICATE', 'CUSTOM'],
  },
  requestedBy: {
    organizationName: String,
    contactPerson: String,
    email: String,
    phone: String,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  verificationDetails: {
    serialNumberVerified: Boolean,
    registrationNumberVerified: Boolean,
    studentDetailsVerified: Boolean,
    signatureVerified: Boolean,
    templateVerified: Boolean,
    issuerVerified: Boolean,
  },
  authenticityCheck: {
    hologramPresent: Boolean,
    qrCodeValid: Boolean,
    watermarkVerified: Boolean,
    paperQualityVerified: Boolean,
    printQualityVerified: Boolean,
    overallStatus: {
      type: String,
      enum: ['AUTHENTIC', 'SUSPICIOUS', 'FORGED', 'INCONCLUSIVE'],
    },
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'INCONCLUSIVE'],
    default: 'PENDING',
  },
  verificationMethod: {
    type: String,
    enum: ['ONLINE', 'MANUAL', 'BIOMETRIC', 'BLOCKCHAIN'],
    default: 'MANUAL',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verificationDate: Date,
  findings: {
    summary: String,
    detailedReport: String,
    recommendations: String,
  },
  complianceChecks: {
    governmentStandards: Boolean,
    schoolPolicies: Boolean,
    internationalStandards: Boolean,
  },
  certificateOfAuthenticity: {
    issued: Boolean,
    certificateUrl: String,
    validityPeriod: String,
  },
  qrCodeGenerated: {
    type: Boolean,
    default: false,
  },
  qrCodeData: {
    qrCodeUrl: String,
    qrCodeValue: String, // Encoded verification info
    generatedDate: Date,
    expiryDate: Date,
  },
  verificationCode: {
    code: String,
    validityPeriod: {
      startDate: Date,
      endDate: Date,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  auditLog: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedDate: Date,
    details: String,
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: Date,
    type: String,
  }],
  remarks: {
    type: String,
    trim: true,
  },
  confidential: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
documentVerificationSchema.index({ schoolId: 1, verificationNumber: 1 }, { unique: true });
documentVerificationSchema.index({ schoolId: 1, document: 1 });
documentVerificationSchema.index({ schoolId: 1, student: 1 });
documentVerificationSchema.index({ schoolId: 1, verificationStatus: 1 });
documentVerificationSchema.index({ requestDate: 1 });
documentVerificationSchema.index({ verificationDate: 1 });

// Pre-save middleware
documentVerificationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('DocumentVerification', documentVerificationSchema);
