/**
 * BiometricRecord Model
 * Biometric data including fingerprint, face recognition templates, and verification records
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const biometricRecordSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    biometricType: {
      type: String,
      enum: ['FINGERPRINT', 'FACE_RECOGNITION', 'IRIS', 'VOICE', 'PALM'],
      required: true,
    },
    templates: [
      {
        templateId: mongoose.Schema.Types.ObjectId,
        templateData: Buffer, // Encrypted biometric template
        templateFormat: {
          type: String,
          enum: ['ISO_19794_2', 'ISO_19794_5', 'ISO_19794_11', 'PROPRIETARY', 'OTHER'],
        },
        captureQuality: Number, // 0-100
        captureDate: Date,
        capturedByDevice: mongoose.Schema.Types.ObjectId,
        isActive: {
          type: Boolean,
          default: true,
        },
        matchingScore: Number,
        verificationAttempts: Number,
      },
    ],
    fingerprintDetails: {
      fingerCode: String,
      minutiae: [
        {
          x: Number,
          y: Number,
          angle: Number,
          type: String,
        },
      ],
      pattern: {
        type: String,
        enum: ['ARCH', 'LEFT_LOOP', 'RIGHT_LOOP', 'WHORL', 'TWIN_LOOP'],
      },
    },
    faceRecognitionDetails: {
      faceId: String,
      faceVector: [Number], // Face embedding vector
      landmarks: {
        leftEye: { x: Number, y: Number },
        rightEye: { x: Number, y: Number },
        nose: { x: Number, y: Number },
        mouth: { x: Number, y: Number },
        jawLine: [{ x: Number, y: Number }],
      },
      headPose: {
        pitch: Number,
        yaw: Number,
        roll: Number,
      },
      faceLiveness: Boolean,
    },
    irisDetails: {
      irisId: String,
      irisCode: Buffer,
      pupilDiameter: Number,
      limbusAsymmetry: Number,
    },
    registrationDetails: {
      registeredDate: {
        type: Date,
        default: Date.now,
      },
      registeredByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      registeredByDevice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileAttendanceDevice',
      },
      totalTemplates: Number,
      qualityScore: Number,
      enrollmentStatus: {
        type: String,
        enum: ['ENROLLED', 'PARTIALLY_ENROLLED', 'FAILED', 'PENDING'],
        default: 'ENROLLED',
      },
    },
    verificationHistory: [
      {
        verificationId: mongoose.Schema.Types.ObjectId,
        verificationDate: Date,
        verificationMethod: String,
        matchScore: Number,
        matchPercentage: Number,
        isMatched: Boolean,
        livenessPassed: Boolean,
        device: mongoose.Schema.Types.ObjectId,
        purpose: {
          type: String,
          enum: ['ATTENDANCE', 'AUTHENTICATION', 'VERIFICATION'],
        },
        status: {
          type: String,
          enum: ['SUCCESS', 'FAILED', 'RETRY', 'ERROR'],
        },
        errorDetails: String,
      },
    ],
    security: {
      isEncrypted: Boolean,
      encryptionAlgorithm: String,
      encryptionKey: String,
      lastEncryptedDate: Date,
      tamperDetection: Boolean,
      tamperStatus: {
        type: String,
        enum: ['INTACT', 'TAMPERED', 'UNKNOWN'],
      },
    },
    permissions: {
      allowedDevices: [mongoose.Schema.Types.ObjectId],
      allowedLocations: [String],
      usageRestrictions: [String],
      sharingEnabled: Boolean,
    },
    statistics: {
      totalVerificationAttempts: {
        type: Number,
        default: 0,
      },
      successfulVerifications: {
        type: Number,
        default: 0,
      },
      failedVerifications: {
        type: Number,
        default: 0,
      },
      averageMatchScore: Number,
      lastVerificationDate: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
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
biometricRecordSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('BIO', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
biometricRecordSchema.index({ schoolId, userId: 1 });
biometricRecordSchema.index({ schoolId, biometricType: 1 });
biometricRecordSchema.index({ code: 1, schoolId: 1 });

// Virtual: Verification success rate
biometricRecordSchema.virtual('verificationSuccessRate').get(function () {
  if (this.statistics?.totalVerificationAttempts === 0) return 0;
  return Math.round(
    (this.statistics.successfulVerifications / this.statistics.totalVerificationAttempts) * 100
  );
});

// Virtual: Is template active
biometricRecordSchema.virtual('hasActiveTemplate').get(function () {
  return (this.templates || []).some((t) => t.isActive);
});

module.exports = mongoose.model('BiometricRecord', biometricRecordSchema);
