/**
 * Mobile Attendance Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Schema: Register mobile device
 */
exports.registerDeviceSchema = Joi.object({
  deviceName: Joi.string().required(),
  deviceIdentifier: Joi.string().required(),
  deviceType: Joi.string()
    .valid('MOBILE', 'TABLET', 'LAPTOP', 'DESKTOP', 'KIOSK')
    .required(),
  osType: Joi.string()
    .valid('ANDROID', 'IOS', 'WINDOWS', 'WEB')
    .required(),
  appVersion: Joi.string(),
  buildNumber: Joi.string(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    address: Joi.string(),
  }),
});

/**
 * Schema: Mark attendance
 */
exports.markAttendanceSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24),
  sessionDate: Joi.date().required(),
  sessionType: Joi.string()
    .valid('MORNING_ROLL_CALL', 'CLASS_ATTENDANCE', 'ASSEMBLY', 'EVENT', 'GENERAL')
    .required(),
  checkInDetails: Joi.object({
    checkInTime: Joi.date().required(),
    checkInMethod: Joi.string()
      .valid('QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL', 'HYBRID')
      .required(),
    checkInDeviceId: Joi.string().hex().length(24),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      accuracy: Joi.number(),
    }),
    isLate: Joi.boolean(),
  }).required(),
  attendanceStatus: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED', 'ON_LEAVE', 'SUSPENDED')
    .required(),
});

/**
 * Schema: Record check-in
 */
exports.recordCheckInSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  sessionDate: Joi.date().required(),
  checkInTime: Joi.date().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  accuracy: Joi.number(),
  checkInMethod: Joi.string()
    .valid('QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL')
    .required(),
  deviceId: Joi.string().hex().length(24),
});

/**
 * Schema: Record check-out
 */
exports.recordCheckOutSchema = Joi.object({
  sessionId: Joi.string().hex().length(24).required(),
  checkOutTime: Joi.date().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  accuracy: Joi.number(),
  checkOutMethod: Joi.string()
    .valid('QR_CODE', 'BIOMETRIC', 'GPS', 'MANUAL')
    .required(),
  deviceId: Joi.string().hex().length(24),
});

/**
 * Schema: Generate QR code
 */
exports.generateQRCodeSchema = Joi.object({
  qrCodeData: Joi.string().required(),
  qrType: Joi.string()
    .valid('SESSION_QR', 'DEVICE_QR', 'CLASS_QR', 'EVENT_QR', 'GENERAL_QR')
    .required(),
  associatedEntityType: Joi.string().valid('SESSION', 'DEVICE', 'CLASS', 'EVENT'),
  associatedEntityId: Joi.string().hex().length(24),
  validityMinutes: Joi.number().min(1),
  maxScans: Joi.number().min(1),
});

/**
 * Schema: Validate QR code
 */
exports.validateQRCodeSchema = Joi.object({
  qrCodeId: Joi.string().required(),
  scannedAt: Joi.date().required(),
  scannedByUserId: Joi.string().hex().length(24),
  deviceId: Joi.string().hex().length(24),
});

/**
 * Schema: Enroll biometric
 */
exports.enrollBiometricSchema = Joi.object({
  biometricType: Joi.string()
    .valid('FINGERPRINT', 'FACE_RECOGNITION', 'IRIS', 'VOICE', 'PALM')
    .required(),
  templateData: Joi.string().required(), // Base64 encoded
  templateFormat: Joi.string()
    .valid('ISO_19794_2', 'ISO_19794_5', 'ISO_19794_11', 'PROPRIETARY', 'OTHER'),
  captureQuality: Joi.number().min(0).max(100),
  capturedByDeviceId: Joi.string().hex().length(24),
});

/**
 * Schema: Verify biometric
 */
exports.verifyBiometricSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  biometricType: Joi.string()
    .valid('FINGERPRINT', 'FACE_RECOGNITION', 'IRIS', 'VOICE', 'PALM')
    .required(),
  capturedData: Joi.string().required(), // Base64 encoded
  deviceId: Joi.string().hex().length(24),
  purpose: Joi.string()
    .valid('ATTENDANCE', 'AUTHENTICATION', 'VERIFICATION'),
});

/**
 * Schema: List attendance sessions (query validation)
 */
exports.listAttendanceSchema = Joi.object({
  studentId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  attendanceStatus: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED', 'ON_LEAVE', 'SUSPENDED'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: List devices (query validation)
 */
exports.listDevicesSchema = Joi.object({
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED'),
  deviceType: Joi.string()
    .valid('MOBILE', 'TABLET', 'LAPTOP', 'DESKTOP', 'KIOSK'),
  osType: Joi.string()
    .valid('ANDROID', 'IOS', 'WINDOWS', 'WEB'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Get attendance report (query validation)
 */
exports.getReportSchema = Joi.object({
  dateFrom: Joi.date().required(),
  dateTo: Joi.date().required(),
  classId: Joi.string().hex().length(24),
  attendanceStatus: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED', 'ON_LEAVE', 'SUSPENDED'),
  format: Joi.string()
    .valid('CSV', 'PDF', 'EXCEL', 'JSON')
    .default('CSV'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
}).unknown(true);

/**
 * Schema: Sync attendance data
 */
exports.syncAttendanceDataSchema = Joi.object({
  deviceId: Joi.string().hex().length(24).required(),
  totalRecords: Joi.number().required(),
  newRecords: Joi.number(),
  updatedRecords: Joi.number(),
  syncTimestamp: Joi.date().required(),
  data: Joi.array().items(
    Joi.object({
      studentId: Joi.string().hex().length(24).required(),
      sessionDate: Joi.date().required(),
      attendanceStatus: Joi.string().required(),
    })
  ),
});
