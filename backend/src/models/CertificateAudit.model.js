/**
 * CertificateAudit Model
 * Comprehensive audit trail for all certificate-related operations and compliance tracking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const certificateAuditSchema = new mongoose.Schema(
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
    auditType: {
      type: String,
      enum: [
        'CERTIFICATE_CREATED',
        'CERTIFICATE_MODIFIED',
        'CERTIFICATE_ISSUED',
        'CERTIFICATE_VERIFIED',
        'CERTIFICATE_REVOKED',
        'CERTIFICATE_DISTRIBUTED',
        'TEMPLATE_CREATED',
        'TEMPLATE_MODIFIED',
        'BULK_ISSUANCE',
        'EVENT_CREATED',
        'EVENT_UPDATED',
        'COMPLIANCE_CHECK',
        'SECURITY_AUDIT',
        'DATA_EXPORT',
        'SYSTEM_ALERT',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    actionDescription: String,
    performedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByRole: String,
    performedByDepartment: String,
    resourceType: {
      type: String,
      enum: ['CERTIFICATE', 'TEMPLATE', 'STUDENT_CERTIFICATE', 'EVENT', 'SYSTEM'],
      required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    resourceDetails: {
      certificateId: mongoose.Schema.Types.ObjectId,
      studentId: mongoose.Schema.Types.ObjectId,
      certificateCode: String,
      certificateType: String,
      studentName: String,
      academicYear: String,
    },
    changeDetails: {
      fieldName: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      reason: String,
    },
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING', 'ROLLED_BACK'],
      default: 'SUCCESS',
    },
    failureReason: String,
    complianceDetails: {
      requiresApproval: Boolean,
      approvalStatus: {
        type: String,
        enum: ['APPROVED', 'PENDING', 'REJECTED'],
      },
      approvedBy: mongoose.Schema.Types.ObjectId,
      approvalDate: Date,
      approvalComment: String,
    },
    securityDetails: {
      encryptionStatus: Boolean,
      integrityVerified: Boolean,
      signatureValid: Boolean,
      securityFlags: [String],
    },
    bulkOperationDetails: {
      operationId: String,
      totalRecords: Number,
      successfulRecords: Number,
      failedRecords: Number,
      batchSize: Number,
      progress: Number,
    },
    attachments: [
      {
        attachmentUrl: String,
        attachmentType: String,
        fileName: String,
        fileSize: Number,
      },
    ],
    tags: [String],
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
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
certificateAuditSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('AUD', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
certificateAuditSchema.index({ schoolId: 1, auditType: 1 });
certificateAuditSchema.index({ schoolId: 1, performedByUserId: 1 });
certificateAuditSchema.index({ schoolId: 1, resourceType: 1 });
certificateAuditSchema.index({ resourceId: 1, schoolId: 1 });
certificateAuditSchema.index({ code: 1, schoolId: 1 });
certificateAuditSchema.index({ createdAt: -1, schoolId: 1 });

// Virtual: Days since audit entry
certificateAuditSchema.virtual('daysSinceAction').get(function () {
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Hours since audit entry
certificateAuditSchema.virtual('hoursSinceAction').get(function () {
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return Math.floor(timeDiff / (1000 * 60 * 60));
});

// Virtual: Success rate for bulk operations
certificateAuditSchema.virtual('bulkSuccessRate').get(function () {
  if (!this.bulkOperationDetails?.totalRecords || this.bulkOperationDetails.totalRecords === 0) return 0;
  return Math.round(
    (this.bulkOperationDetails.successfulRecords / this.bulkOperationDetails.totalRecords) * 100
  );
});

module.exports = mongoose.model('CertificateAudit', certificateAuditSchema);
