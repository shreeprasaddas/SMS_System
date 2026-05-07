/**
 * MobileAttendanceLog Model
 * Comprehensive audit trail for all mobile attendance operations, API usage, and errors
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const mobileAttendanceLogSchema = new mongoose.Schema(
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
    logType: {
      type: String,
      enum: [
        'ATTENDANCE_MARKED',
        'DEVICE_REGISTERED',
        'DEVICE_SYNCED',
        'QR_GENERATED',
        'QR_SCANNED',
        'BIOMETRIC_ENROLLED',
        'BIOMETRIC_VERIFIED',
        'DATA_EXPORTED',
        'REPORT_GENERATED',
        'SYSTEM_ALERT',
        'API_CALL',
        'SYNC_FAILURE',
        'SECURITY_EVENT',
        'USER_ACTION',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    actionDescription: String,
    performedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByRole: String,
    performedByDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileAttendanceDevice',
    },
    resourceType: {
      type: String,
      enum: ['ATTENDANCE_SESSION', 'DEVICE', 'QR_CODE', 'BIOMETRIC_RECORD', 'STUDENT', 'SYSTEM'],
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    resourceDetails: {
      studentName: String,
      studentId: mongoose.Schema.Types.ObjectId,
      deviceName: String,
      sessionDate: Date,
      attendanceStatus: String,
    },
    operationDetails: {
      operationType: {
        type: String,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'SYNC', 'EXPORT', 'VERIFY', 'SCAN'],
      },
      operationStatus: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PARTIAL', 'PENDING', 'RETRY'],
        default: 'SUCCESS',
      },
      executionTime: Number, // milliseconds
      recordsProcessed: Number,
      recordsSuccessful: Number,
      recordsFailed: Number,
    },
    changeDetails: {
      fieldName: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      reason: String,
    },
    apiDetails: {
      endpoint: String,
      httpMethod: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      requestPayloadSize: Number,
      responsePayloadSize: Number,
      responseTime: Number,
      statusCode: Number,
    },
    networkDetails: {
      ipAddress: String,
      deviceIP: String,
      userAgent: String,
      requestId: String,
      sessionId: String,
      networkType: {
        type: String,
        enum: ['WIFI', 'MOBILE_DATA', 'HOTSPOT'],
      },
      bandwidth: Number,
      latency: Number,
    },
    errorDetails: {
      hasError: Boolean,
      errorCode: String,
      errorMessage: String,
      errorStack: String,
      errorCategory: {
        type: String,
        enum: ['NETWORK', 'AUTHENTICATION', 'AUTHORIZATION', 'VALIDATION', 'DATABASE', 'SYSTEM', 'UNKNOWN'],
      },
      recoveryAttempted: Boolean,
      recoverySuccess: Boolean,
    },
    securityDetails: {
      encryptionUsed: Boolean,
      encryptionAlgorithm: String,
      tamperDetected: Boolean,
      suspiousActivity: Boolean,
      securityFlags: [String],
    },
    syncDetails: {
      syncId: String,
      syncFrom: Date,
      syncTo: Date,
      totalRecords: Number,
      newRecords: Number,
      updatedRecords: Number,
      deletedRecords: Number,
      conflictRecords: Number,
      conflictResolution: String,
    },
    biometricDetails: {
      biometricType: String,
      matchPercentage: Number,
      templateUsed: mongoose.Schema.Types.ObjectId,
      livenessPassed: Boolean,
      qualityScore: Number,
    },
    locationData: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      address: String,
      geofence: String,
      altitude: Number,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    tags: [String],
    remarks: String,
    status: {
      type: String,
      enum: ['LOGGED', 'ACKNOWLEDGED', 'RESOLVED', 'ARCHIVED'],
      default: 'LOGGED',
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
mobileAttendanceLogSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('MAL', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
mobileAttendanceLogSchema.index({ schoolId, logType: 1 });
mobileAttendanceLogSchema.index({ schoolId, performedByUserId: 1 });
mobileAttendanceLogSchema.index({ resourceType: 1, schoolId: 1 });
mobileAttendanceLogSchema.index({ code: 1, schoolId: 1 });
mobileAttendanceLogSchema.index({ createdAt: -1, schoolId: 1 });

// Virtual: Days since log entry
mobileAttendanceLogSchema.virtual('daysSinceAction').get(function () {
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Is recent
mobileAttendanceLogSchema.virtual('isRecent').get(function () {
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return timeDiff < 24 * 60 * 60 * 1000; // 24 hours
});

// Virtual: Success rate for batch operations
mobileAttendanceLogSchema.virtual('operationSuccessRate').get(function () {
  if (!this.operationDetails?.recordsProcessed || this.operationDetails.recordsProcessed === 0) return 0;
  return Math.round(
    (this.operationDetails.recordsSuccessful / this.operationDetails.recordsProcessed) * 100
  );
});

module.exports = mongoose.model('MobileAttendanceLog', mobileAttendanceLogSchema);
