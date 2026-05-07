const mongoose = require('mongoose');

const docVerificationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: DVR-{year}-{5-digit-count}'
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true
    },
    admissionCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionCycle',
      required: true
    },
    applicantName: {
      type: String,
      required: true
    },
    documents: [
      {
        documentId: String,
        documentType: {
          type: String,
          enum: ['BIRTH_CERTIFICATE', 'SCHOOL_CERTIFICATE', 'MARK_SHEET', 'TRANSFER_CERTIFICATE', 'CASTE_CERTIFICATE', 'INCOME_CERTIFICATE', 'DISABILITY_CERTIFICATE', 'ADMISSION_LETTER', 'AADHAR', 'PASSPORT', 'OTHER'],
          required: true
        },
        documentName: String,
        isMandatory: Boolean,
        fileURL: String,
        fileName: String,
        uploadedDate: Date,
        verificationStatus: {
          type: String,
          enum: ['PENDING', 'VERIFIED', 'REJECTED', 'RESUBMIT_REQUIRED'],
          default: 'PENDING',
          index: true
        },
        verificationNotes: String,
        originalityCheck: {
          checked: Boolean,
          checkedDate: Date,
          checkedBy: mongoose.Schema.Types.ObjectId,
          status: {
            type: String,
            enum: ['AUTHENTIC', 'SUSPICIOUS', 'REJECTED'],
            default: 'AUTHENTIC'
          },
          remarks: String
        },
        photoMatch: {
          required: Boolean,
          photoProvidedByApplicant: Boolean,
          photoURL: String,
          photoMatchPercentage: Number,
          photoMatchStatus: {
            type: String,
            enum: ['MATCHED', 'PARTIALLY_MATCHED', 'NOT_MATCHED', 'NOT_APPLICABLE'],
            default: 'NOT_APPLICABLE'
          },
          photoVerifiedDate: Date,
          photoVerifiedBy: mongoose.Schema.Types.ObjectId
        },
        contentVerification: {
          dataMatchesForm: Boolean,
          inconsistencies: [String],
          verificationDate: Date,
          verifiedBy: mongoose.Schema.Types.ObjectId,
          comments: String
        },
        rejectionDetails: {
          isRejected: Boolean,
          rejectionReason: String,
          rejectionDate: Date,
          rejectedBy: mongoose.Schema.Types.ObjectId,
          allowResubmission: Boolean,
          resubmissionDeadline: Date
        }
      }
    ],
    overallVerificationStatus: {
      type: String,
      enum: ['PENDING', 'PARTIAL', 'VERIFIED', 'REJECTED', 'INCOMPLETE'],
      default: 'PENDING',
      index: true
    },
    totalDocumentsRequired: Number,
    totalDocumentsSubmitted: Number,
    totalDocumentsVerified: Number,
    totalDocumentsRejected: Number,
    verificationStartDate: Date,
    verificationCompletionDate: Date,
    verificationInProgressSince: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verificationNotes: String,
    escalationRequired: {
      type: Boolean,
      default: false
    },
    escalationReason: String,
    escalatedToUserId: mongoose.Schema.Types.ObjectId,
    escalationDate: Date,
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'APPROVED_WITH_CONDITIONS', 'REJECTED', 'ON_HOLD'],
      default: 'PENDING'
    },
    approvedBy: mongoose.Schema.Types.ObjectId,
    approvalDate: Date,
    approvalNotes: String,
    conditionDetails: {
      conditions: [String],
      submissionDeadline: Date,
      conditionsMet: Boolean,
      conditionsMetDate: Date
    },
    rejectDetails: {
      rejectReason: String,
      rejectedDate: Date,
      rejectedBy: mongoose.Schema.Types.ObjectId,
      appealPossible: Boolean,
      appealDeadline: Date
    },
    verificationHistory: [
      {
        action: String,
        changedAt: {
          type: Date,
          default: Date.now
        },
        changedBy: mongoose.Schema.Types.ObjectId,
        previousStatus: String,
        newStatus: String,
        comments: String
      }
    ],
    attachments: [
      {
        attachmentType: String,
        fileURL: String,
        fileName: String,
        uploadedDate: Date,
        uploadedBy: mongoose.Schema.Types.ObjectId
      }
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
    },
    remarks: String,
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
    collection: 'doc_verifications'
  }
);

// Indexes for multi-tenancy queries
docVerificationSchema.index({ schoolId: 1, overallVerificationStatus: 1 });
docVerificationSchema.index({ schoolId: 1, applicationId: 1 });
docVerificationSchema.index({ schoolId: 1, admissionCycleId: 1, overallVerificationStatus: 1 });
docVerificationSchema.index({ schoolId: 1, verificationStartDate: 1 });

// Pre-save middleware for code generation
docVerificationSchema.pre('save', async function (next) {
  if (!this.verificationCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('DocVerification').countDocuments({
      schoolId: this.schoolId
    });
    this.verificationCode = `DVR-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('DocVerification', docVerificationSchema);
