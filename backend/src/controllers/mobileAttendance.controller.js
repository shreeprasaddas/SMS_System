/**
 * Mobile Attendance Controller
 * Request handlers for mobile attendance operations
 */

const mobileAttendanceService = require('../services/mobileAttendance.service');
const { validateRequest } = require('../utils/validation.helper');
const { ResponseHelper } = require('../utils/response.helper');
const {
  registerDeviceSchema,
  markAttendanceSchema,
  recordCheckInSchema,
  recordCheckOutSchema,
  generateQRCodeSchema,
  validateQRCodeSchema,
  enrollBiometricSchema,
  verifyBiometricSchema,
  listAttendanceSchema,
  listDevicesSchema,
  getReportSchema,
  syncAttendanceDataSchema,
} = require('../validations/mobileAttendance.validation');

/**
 * Register mobile device
 * POST /mobile-attendance/devices
 */
exports.registerDevice = async (req, res, next) => {
  try {
    await validateRequest(req.body, registerDeviceSchema);
    const device = await mobileAttendanceService.registerDevice(
      req.body,
      req.user.schoolId,
      req.user._id
    );
    return ResponseHelper.created(res, device, 'Device registered successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all devices
 * GET /mobile-attendance/devices
 */
exports.getDevices = async (req, res, next) => {
  try {
    await validateRequest(req.query, listDevicesSchema);
    const result = await mobileAttendanceService.getAllDevices(req.user.schoolId, req.query);
    return ResponseHelper.paginated(res, result.devices, result.total, result.page, result.limit, 'Devices retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get device by ID
 * GET /mobile-attendance/devices/:id
 */
exports.getDeviceById = async (req, res, next) => {
  try {
    const Device = require('../models/MobileAttendanceDevice.model');
    const device = await Device.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
    }).lean();
    
    if (!device) {
      return ResponseHelper.error(res, 'Device not found', 404);
    }
    
    return ResponseHelper.success(res, device, 'Device retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark attendance
 * POST /mobile-attendance/sessions
 */
exports.markAttendance = async (req, res, next) => {
  try {
    await validateRequest(req.body, markAttendanceSchema);
    const session = await mobileAttendanceService.markAttendance(
      req.body,
      req.user.schoolId,
      req.user._id
    );
    return ResponseHelper.created(res, session, 'Attendance marked successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get student attendance
 * GET /mobile-attendance/sessions/student/:studentId
 */
exports.getStudentAttendance = async (req, res, next) => {
  try {
    await validateRequest(req.query, listAttendanceSchema);
    const result = await mobileAttendanceService.getStudentAttendance(
      req.params.studentId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(res, result.sessions, result.total, result.page, result.limit, 'Attendance retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record check-in
 * POST /mobile-attendance/check-in
 */
exports.recordCheckIn = async (req, res, next) => {
  try {
    await validateRequest(req.body, recordCheckInSchema);
    const AttendanceSession = require('../models/AttendanceSession.model');
    
    const session = await AttendanceSession.create({
      ...req.body,
      schoolId: req.user.schoolId,
      checkInDetails: {
        ...req.body.checkInDetails,
        checkInBy: { userId: req.user._id },
      },
    });
    
    return ResponseHelper.created(res, session, 'Check-in recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record check-out
 * POST /mobile-attendance/check-out
 */
exports.recordCheckOut = async (req, res, next) => {
  try {
    await validateRequest(req.body, recordCheckOutSchema);
    const AttendanceSession = require('../models/AttendanceSession.model');
    
    const session = await AttendanceSession.findByIdAndUpdate(
      req.body.sessionId,
      {
        $set: {
          checkOutDetails: {
            checkOutTime: req.body.checkOutTime,
            checkOutMethod: req.body.checkOutMethod,
            checkOutDeviceId: req.body.deviceId,
            location: {
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              accuracy: req.body.accuracy,
            },
          },
        },
      },
      { new: true }
    );
    
    return ResponseHelper.success(res, session, 'Check-out recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Generate QR code
 * POST /mobile-attendance/qr-codes
 */
exports.generateQRCode = async (req, res, next) => {
  try {
    await validateRequest(req.body, generateQRCodeSchema);
    const qrCode = await mobileAttendanceService.generateQRCode(
      req.body,
      req.user.schoolId,
      req.user._id
    );
    return ResponseHelper.created(res, qrCode, 'QR code generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Validate QR code
 * POST /mobile-attendance/qr-codes/validate
 */
exports.validateQRCode = async (req, res, next) => {
  try {
    await validateRequest(req.body, validateQRCodeSchema);
    const result = await mobileAttendanceService.scanQRCode(
      req.body.qrCodeId,
      req.user.schoolId,
      req.body.deviceId,
      req.user._id
    );
    return ResponseHelper.success(res, result, 'QR code validated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Enroll biometric
 * POST /mobile-attendance/biometrics/enroll
 */
exports.enrollBiometric = async (req, res, next) => {
  try {
    await validateRequest(req.body, enrollBiometricSchema);
    const biometric = await mobileAttendanceService.enrollBiometric(
      req.body,
      req.user._id,
      req.user.schoolId
    );
    return ResponseHelper.created(res, biometric, 'Biometric enrolled successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Verify biometric
 * POST /mobile-attendance/biometrics/verify
 */
exports.verifyBiometric = async (req, res, next) => {
  try {
    await validateRequest(req.body, verifyBiometricSchema);
    const result = await mobileAttendanceService.verifyBiometric(
      req.body.userId,
      req.body.capturedData,
      req.user.schoolId,
      req.body.deviceId
    );
    return ResponseHelper.success(res, result, 'Biometric verified successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get attendance statistics
 * GET /mobile-attendance/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await mobileAttendanceService.getAttendanceStats(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Sync attendance data
 * POST /mobile-attendance/sync
 */
exports.syncData = async (req, res, next) => {
  try {
    await validateRequest(req.body, syncAttendanceDataSchema);
    const result = await mobileAttendanceService.syncAttendanceData(
      req.body.deviceId,
      req.user.schoolId,
      req.body
    );
    return ResponseHelper.success(res, result, 'Data synced successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get device health
 * GET /mobile-attendance/devices/health
 */
exports.getDeviceHealth = async (req, res, next) => {
  try {
    const health = await mobileAttendanceService.getDeviceHealth(req.user.schoolId);
    return ResponseHelper.success(res, health, 'Device health retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Export attendance report
 * GET /mobile-attendance/reports/export
 */
exports.exportReport = async (req, res, next) => {
  try {
    await validateRequest(req.query, getReportSchema);
    const report = await mobileAttendanceService.exportAttendanceReport(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.success(res, report, 'Report exported successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get mobile logs
 * GET /mobile-attendance/logs
 */
exports.getMobileLogs = async (req, res, next) => {
  try {
    const result = await mobileAttendanceService.getMobileLogs(
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(res, result.logs, result.total, result.page, result.limit, 'Logs retrieved successfully');
  } catch (error) {
    next(error);
  }
};
