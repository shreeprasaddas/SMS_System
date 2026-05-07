/**
 * MobileAttendanceDevice Model
 * Mobile device registration and configuration for attendance marking
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const mobileAttendanceDeviceSchema = new mongoose.Schema(
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
    deviceName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceIdentifier: {
      type: String,
      unique: true,
      sparse: true,
    },
    deviceType: {
      type: String,
      enum: ['MOBILE', 'TABLET', 'LAPTOP', 'DESKTOP', 'KIOSK'],
      required: true,
    },
    osType: {
      type: String,
      enum: ['ANDROID', 'IOS', 'WINDOWS', 'WEB', 'OTHER'],
      required: true,
    },
    appVersion: String,
    buildNumber: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      classroom: String,
      floor: Number,
      building: String,
    },
    assignedTo: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userRole: String,
      assignmentDate: Date,
    },
    hardware: {
      manufacturer: String,
      model: String,
      osVersion: String,
      ramGB: Number,
      storageGB: Number,
      hasBiometric: Boolean,
      biometricType: {
        type: String,
        enum: ['FINGERPRINT', 'FACE_RECOGNITION', 'IRIS', 'NONE'],
      },
      hasGPS: Boolean,
      hasQRScanner: Boolean,
      cameraResolution: String,
    },
    networkInfo: {
      lastKnownIP: String,
      macAddress: String,
      networkType: {
        type: String,
        enum: ['WIFI', 'MOBILE_DATA', 'HOTSPOT'],
      },
      signalStrength: Number,
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
      registrationCode: String,
      isApproved: Boolean,
      approvalDate: Date,
    },
    security: {
      isEncrypted: Boolean,
      pinRequired: Boolean,
      biometricRequired: Boolean,
      lastSecurityUpdate: Date,
      securityPatchLevel: String,
    },
    settings: {
      attendanceMarkingMode: {
        type: String,
        enum: ['QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL', 'HYBRID'],
        default: 'QR_CODE',
      },
      autoSyncEnabled: Boolean,
      offlineMode: Boolean,
      syncInterval: Number,
      timeZone: String,
      language: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'LOST', 'STOLEN', 'ARCHIVED', 'MAINTENANCE'],
      default: 'ACTIVE',
      index: true,
    },
    usageStatistics: {
      totalAttendanceMarked: {
        type: Number,
        default: 0,
      },
      lastUsedDate: Date,
      usageCount: {
        type: Number,
        default: 0,
      },
      errorCount: {
        type: Number,
        default: 0,
      },
      syncFailures: {
        type: Number,
        default: 0,
      },
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
mobileAttendanceDeviceSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('MDEV', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
mobileAttendanceDeviceSchema.index({ schoolId, status: 1 });
mobileAttendanceDeviceSchema.index({ deviceIdentifier: 1, schoolId: 1 });
mobileAttendanceDeviceSchema.index({ code: 1, schoolId: 1 });
mobileAttendanceDeviceSchema.index({ 'assignedTo.userId': 1, schoolId: 1 });

// Virtual: Days since last used
mobileAttendanceDeviceSchema.virtual('daysSinceLastUsed').get(function () {
  if (!this.usageStatistics?.lastUsedDate) return null;
  const now = new Date();
  const timeDiff = now - this.usageStatistics.lastUsedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Health score
mobileAttendanceDeviceSchema.virtual('healthScore').get(function () {
  const totalOps = this.usageStatistics?.usageCount || 0;
  const errors = this.usageStatistics?.errorCount || 0;
  if (totalOps === 0) return 100;
  return Math.max(0, 100 - (errors / totalOps) * 100);
});

module.exports = mongoose.model('MobileAttendanceDevice', mobileAttendanceDeviceSchema);
