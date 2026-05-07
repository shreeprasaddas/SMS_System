/**
 * QRCode Model
 * QR codes for attendance marking with expiry and usage tracking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const qrCodeSchema = new mongoose.Schema(
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
    qrCodeId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    qrCodeData: String,
    qrCodeImage: {
      url: String,
      fileName: String,
      generatedDate: Date,
    },
    qrType: {
      type: String,
      enum: ['SESSION_QR', 'DEVICE_QR', 'CLASS_QR', 'EVENT_QR', 'GENERAL_QR'],
      required: true,
    },
    associatedEntity: {
      entityType: {
        type: String,
        enum: ['ATTENDANCE_SESSION', 'CLASS', 'EVENT', 'DEVICE', 'GENERAL'],
      },
      entityId: mongoose.Schema.Types.ObjectId,
      entityName: String,
    },
    validityDetails: {
      generatedDate: {
        type: Date,
        default: Date.now,
      },
      expiryDate: Date,
      validFrom: Date,
      validUpto: Date,
      isValid: {
        type: Boolean,
        default: true,
      },
      validityStatus: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'REVOKED', 'ARCHIVED'],
        default: 'ACTIVE',
      },
    },
    usageDetails: {
      maxScans: Number,
      currentScans: {
        type: Number,
        default: 0,
      },
      lastScannedDate: Date,
      lastScannedBy: mongoose.Schema.Types.ObjectId,
      lastScannedDevice: mongoose.Schema.Types.ObjectId,
      usageLog: [
        {
          scanTime: Date,
          scannedBy: mongoose.Schema.Types.ObjectId,
          deviceId: mongoose.Schema.Types.ObjectId,
          deviceIP: String,
          status: {
            type: String,
            enum: ['SUCCESS', 'FAILED', 'DUPLICATE'],
          },
        },
      ],
    },
    securitySettings: {
      encryptionEnabled: Boolean,
      encryptionKey: String,
      checksumValidation: Boolean,
      ipRestriction: [String],
      deviceRestriction: [mongoose.Schema.Types.ObjectId],
    },
    generatedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userRole: String,
      generationDate: Date,
      generationPurpose: String,
    },
    batchDetails: {
      batchId: String,
      batchNumber: Number,
      totalInBatch: Number,
      sequenceNumber: Number,
    },
    metadata: {
      environment: {
        type: String,
        enum: ['PRODUCTION', 'TESTING', 'STAGING'],
        default: 'PRODUCTION',
      },
      version: String,
      format: {
        type: String,
        enum: ['QR_2D', 'BARCODE_1D', 'NFC'],
        default: 'QR_2D',
      },
      errorCorrectionLevel: {
        type: String,
        enum: ['L', 'M', 'Q', 'H'],
        default: 'M',
      },
      size: String,
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
qrCodeSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('QR', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
qrCodeSchema.index({ schoolId, status: 1 });
qrCodeSchema.index({ qrCodeId: 1, schoolId: 1 });
qrCodeSchema.index({ code: 1, schoolId: 1 });
qrCodeSchema.index({ 'validityDetails.expiryDate': 1, schoolId: 1 });

// Virtual: Days until expiry
qrCodeSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.validityDetails?.expiryDate) return null;
  const now = new Date();
  const timeDiff = this.validityDetails.expiryDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is expired
qrCodeSchema.virtual('isExpired').get(function () {
  if (!this.validityDetails?.expiryDate) return false;
  return new Date() > this.validityDetails.expiryDate;
});

// Virtual: Usage percentage
qrCodeSchema.virtual('usagePercentage').get(function () {
  if (!this.usageDetails?.maxScans) return 0;
  return Math.round((this.usageDetails.currentScans / this.usageDetails.maxScans) * 100);
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
