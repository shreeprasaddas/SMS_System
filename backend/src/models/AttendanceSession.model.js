/**
 * AttendanceSession Model
 * Daily attendance sessions with check-in/check-out, geolocation tracking, and biometric records
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const attendanceSessionSchema = new mongoose.Schema(
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
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    sessionDate: {
      type: Date,
      required: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ['MORNING_ROLL_CALL', 'CLASS_ATTENDANCE', 'ASSEMBLY', 'EVENT', 'GENERAL'],
      default: 'CLASS_ATTENDANCE',
    },
    checkInDetails: {
      checkInTime: {
        type: Date,
        required: true,
      },
      checkInMethod: {
        type: String,
        enum: ['QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL', 'RFID'],
        required: true,
      },
      checkInDeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileAttendanceDevice',
      },
      checkInLocation: {
        latitude: Number,
        longitude: Number,
        accuracy: Number,
        address: String,
        geofence: String,
      },
      checkInBy: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userRole: String,
      },
      isLate: Boolean,
      lateMinutes: Number,
    },
    checkOutDetails: {
      checkOutTime: Date,
      checkOutMethod: {
        type: String,
        enum: ['QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL', 'RFID'],
      },
      checkOutDeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileAttendanceDevice',
      },
      checkOutLocation: {
        latitude: Number,
        longitude: Number,
        accuracy: Number,
        address: String,
      },
      checkOutBy: {
        userId: mongoose.Schema.Types.ObjectId,
        userRole: String,
      },
      isEarlyCheckOut: Boolean,
      earlyMinutes: Number,
    },
    attendanceStatus: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED', 'ON_LEAVE', 'SUSPENDED'],
      default: 'PRESENT',
      index: true,
    },
    biometricVerification: {
      verified: Boolean,
      matchPercentage: Number,
      verificationMethod: String,
      verificationTime: Date,
      biometricTemplate: String,
    },
    geoFenceValidation: {
      isWithinGeofence: Boolean,
      geofenceDeviation: Number,
      geofenceAlert: Boolean,
    },
    sessionNotes: String,
    remarks: String,
    verificationDetails: {
      verifiedByUserId: mongoose.Schema.Types.ObjectId,
      verificationDate: Date,
      verificationStatus: {
        type: String,
        enum: ['VERIFIED', 'PENDING', 'REJECTED'],
      },
      verificationReason: String,
    },
    durationMinutes: Number,
    regularityScore: Number,
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'DISPUTED', 'CANCELLED', 'ADJUSTED'],
      default: 'CONFIRMED',
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
attendanceSessionSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('ASESS', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
attendanceSessionSchema.index({ schoolId: 1, studentId: 1 });
attendanceSessionSchema.index({ schoolId: 1, sessionDate: 1 });
attendanceSessionSchema.index({ schoolId: 1, attendanceStatus: 1 });
attendanceSessionSchema.index({ code: 1, schoolId: 1 });

// Virtual: Session duration in minutes
attendanceSessionSchema.virtual('sessionDuration').get(function () {
  if (!this.checkInDetails?.checkInTime || !this.checkOutDetails?.checkOutTime) return null;
  const timeDiff = this.checkOutDetails.checkOutTime - this.checkInDetails.checkInTime;
  return Math.floor(timeDiff / (1000 * 60));
});

// Virtual: Is late
attendanceSessionSchema.virtual('isLateSession').get(function () {
  return this.attendanceStatus === 'LATE' || this.checkInDetails?.isLate || false;
});

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
