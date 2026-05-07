/**
 * Mobile Attendance Service
 * Business logic for mobile attendance operations
 */

const MobileAttendanceDevice = require('../models/MobileAttendanceDevice.model');
const AttendanceSession = require('../models/AttendanceSession.model');
const QRCode = require('../models/QRCode.model');
const BiometricRecord = require('../models/BiometricRecord.model');
const MobileAttendanceLog = require('../models/MobileAttendanceLog.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Register mobile device
 */
exports.registerDevice = async (data, schoolId, userId) => {
  try {
    const device = await MobileAttendanceDevice.create({
      ...data,
      schoolId,
      'registrationDetails.registeredByUserId': userId,
      'registrationDetails.registeredDate': new Date(),
    });

    await MobileAttendanceLog.create({
      schoolId,
      logType: 'DEVICE_REGISTERED',
      actionDescription: `Device registered: ${data.deviceName}`,
      performedByUserId: userId,
      resourceType: 'DEVICE',
      resourceId: device._id,
      status: 'LOGGED',
    });

    return device;
  } catch (error) {
    throw new AppError('Failed to register device', 400);
  }
};

/**
 * Get all registered devices
 */
exports.getAllDevices = async (schoolId, filters = {}) => {
  try {
    const { status, deviceType, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (status) query.status = status;
    if (deviceType) query.deviceType = deviceType;

    const skip = (page - 1) * limit;
    const [devices, total] = await Promise.all([
      MobileAttendanceDevice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MobileAttendanceDevice.countDocuments(query),
    ]);

    return { devices, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve devices', 400);
  }
};

/**
 * Mark attendance via mobile
 */
exports.markAttendance = async (data, schoolId, userId) => {
  try {
    const session = await AttendanceSession.create({
      ...data,
      schoolId,
      'checkInDetails.checkInBy.userId': userId,
    });

    // Log the attendance marking
    await MobileAttendanceLog.create({
      schoolId,
      logType: 'ATTENDANCE_MARKED',
      actionDescription: `Attendance marked for student ${data.studentId}`,
      performedByUserId: userId,
      performedByDevice: data.checkInDetails?.checkInDeviceId,
      resourceType: 'ATTENDANCE_SESSION',
      resourceId: session._id,
      resourceDetails: {
        studentId: data.studentId,
        sessionDate: data.sessionDate,
        attendanceStatus: data.attendanceStatus,
      },
      operationDetails: {
        operationType: 'CREATE',
        operationStatus: 'SUCCESS',
      },
      status: 'LOGGED',
    });

    return session;
  } catch (error) {
    throw new AppError('Failed to mark attendance', 400);
  }
};

/**
 * Get attendance sessions for student
 */
exports.getStudentAttendance = async (studentId, schoolId, filters = {}) => {
  try {
    const { status, dateFrom, dateTo, page = 1, limit = 20 } = filters;
    const query = { schoolId, studentId };

    if (status) query.attendanceStatus = status;
    if (dateFrom || dateTo) {
      query.sessionDate = {};
      if (dateFrom) query.sessionDate.$gte = new Date(dateFrom);
      if (dateTo) query.sessionDate.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      AttendanceSession.find(query)
        .sort({ sessionDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AttendanceSession.countDocuments(query),
    ]);

    return { sessions, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve attendance', 400);
  }
};

/**
 * Generate QR code for attendance
 */
exports.generateQRCode = async (data, schoolId, userId) => {
  try {
    const qrCode = await QRCode.create({
      ...data,
      schoolId,
      'generatedBy.userId': userId,
      'generatedBy.generationDate': new Date(),
    });

    await MobileAttendanceLog.create({
      schoolId,
      logType: 'QR_GENERATED',
      actionDescription: `QR code generated for ${data.qrType}`,
      performedByUserId: userId,
      resourceType: 'QR_CODE',
      resourceId: qrCode._id,
      status: 'LOGGED',
    });

    return qrCode;
  } catch (error) {
    throw new AppError('Failed to generate QR code', 400);
  }
};

/**
 * Scan QR code and mark attendance
 */
exports.scanQRCode = async (qrCodeId, schoolId, deviceId, userId) => {
  try {
    const qrCode = await QRCode.findOne({ qrCodeId, schoolId }).lean();
    if (!qrCode) throw new AppError('QR code not found', 404);

    if (!qrCode.validityDetails?.isValid) throw new AppError('QR code is invalid or expired', 400);

    // Update QR code usage
    await QRCode.findByIdAndUpdate(
      qrCode._id,
      {
        $inc: { 'usageDetails.currentScans': 1 },
        $set: { 'usageDetails.lastScannedDate': new Date() },
        $push: {
          'usageDetails.usageLog': {
            scanTime: new Date(),
            scannedBy: userId,
            deviceId,
            status: 'SUCCESS',
          },
        },
      }
    );

    // Log the scan
    await MobileAttendanceLog.create({
      schoolId,
      logType: 'QR_SCANNED',
      actionDescription: `QR code scanned successfully`,
      performedByUserId: userId,
      performedByDevice: deviceId,
      resourceType: 'QR_CODE',
      resourceId: qrCode._id,
      operationDetails: {
        operationType: 'SCAN',
        operationStatus: 'SUCCESS',
      },
      status: 'LOGGED',
    });

    return { success: true, qrCode };
  } catch (error) {
    throw error;
  }
};

/**
 * Enroll biometric
 */
exports.enrollBiometric = async (data, userId, schoolId) => {
  try {
    const biometric = await BiometricRecord.create({
      ...data,
      userId,
      schoolId,
      'registrationDetails.registeredByUserId': userId,
      'registrationDetails.registeredDate': new Date(),
    });

    await MobileAttendanceLog.create({
      schoolId,
      logType: 'BIOMETRIC_ENROLLED',
      actionDescription: `Biometric enrolled for user ${userId}`,
      performedByUserId: userId,
      resourceType: 'BIOMETRIC_RECORD',
      resourceId: biometric._id,
      biometricDetails: {
        biometricType: data.biometricType,
      },
      status: 'LOGGED',
    });

    return biometric;
  } catch (error) {
    throw new AppError('Failed to enroll biometric', 400);
  }
};

/**
 * Verify biometric for attendance
 */
exports.verifyBiometric = async (userId, biometricData, schoolId, deviceId) => {
  try {
    const record = await BiometricRecord.findOne({ userId, schoolId }).lean();
    if (!record) throw new AppError('Biometric record not found', 404);

    // Simulate biometric matching
    const isMatched = true; // In real scenario, compare with templates
    const matchScore = 95;

    // Log verification
    await MobileAttendanceLog.create({
      schoolId,
      logType: 'BIOMETRIC_VERIFIED',
      actionDescription: `Biometric verified for user ${userId}`,
      performedByDevice: deviceId,
      resourceType: 'BIOMETRIC_RECORD',
      resourceId: record._id,
      biometricDetails: {
        biometricType: record.biometricType,
        matchPercentage: matchScore,
      },
      operationDetails: {
        operationType: 'VERIFY',
        operationStatus: isMatched ? 'SUCCESS' : 'FAILED',
      },
      status: 'LOGGED',
    });

    // Update biometric statistics
    await BiometricRecord.findByIdAndUpdate(record._id, {
      $inc: { 'statistics.totalVerificationAttempts': 1, ...(isMatched ? { 'statistics.successfulVerifications': 1 } : {}) },
      $set: { 'statistics.lastVerificationDate': new Date() },
    });

    return { isMatched, matchScore };
  } catch (error) {
    throw error;
  }
};

/**
 * Sync attendance data from device
 */
exports.syncAttendanceData = async (deviceId, schoolId, syncData) => {
  try {
    // Update device sync status
    await MobileAttendanceDevice.findByIdAndUpdate(
      deviceId,
      {
        $set: { 'usageStatistics.lastUsedDate': new Date() },
        $inc: { 'usageStatistics.usageCount': 1 },
      }
    );

    // Log sync operation
    await MobileAttendanceLog.create({
      schoolId,
      logType: 'DEVICE_SYNCED',
      actionDescription: `Device sync completed`,
      performedByDevice: deviceId,
      resourceType: 'DEVICE',
      resourceId: deviceId,
      syncDetails: {
        totalRecords: syncData?.totalRecords || 0,
        newRecords: syncData?.newRecords || 0,
      },
      operationDetails: {
        operationType: 'SYNC',
        operationStatus: 'SUCCESS',
      },
      status: 'LOGGED',
    });

    return { success: true, syncedRecords: syncData };
  } catch (error) {
    throw new AppError('Failed to sync data', 400);
  }
};

/**
 * Get attendance statistics
 */
exports.getAttendanceStats = async (schoolId, filters = {}) => {
  try {
    const { dateFrom, dateTo, classId } = filters;
    const query = { schoolId };

    if (dateFrom || dateTo) {
      query.sessionDate = {};
      if (dateFrom) query.sessionDate.$gte = new Date(dateFrom);
      if (dateTo) query.sessionDate.$lte = new Date(dateTo);
    }
    if (classId) query.classId = classId;

    const [totalSessions, presentCount, absentCount, lateCount] = await Promise.all([
      AttendanceSession.countDocuments(query),
      AttendanceSession.countDocuments({ ...query, attendanceStatus: 'PRESENT' }),
      AttendanceSession.countDocuments({ ...query, attendanceStatus: 'ABSENT' }),
      AttendanceSession.countDocuments({ ...query, attendanceStatus: 'LATE' }),
    ]);

    return {
      totalSessions,
      presentCount,
      absentCount,
      lateCount,
      presentPercentage: totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0,
      absentPercentage: totalSessions > 0 ? Math.round((absentCount / totalSessions) * 100) : 0,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve statistics', 400);
  }
};

/**
 * Get mobile attendance logs
 */
exports.getMobileLogs = async (schoolId, filters = {}) => {
  try {
    const { logType, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (logType) query.logType = logType;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      MobileAttendanceLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MobileAttendanceLog.countDocuments(query),
    ]);

    return { logs, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve logs', 400);
  }
};

/**
 * Get device health metrics
 */
exports.getDeviceHealth = async (schoolId) => {
  try {
    const devices = await MobileAttendanceDevice.find({ schoolId }).lean();
    
    const healthMetrics = devices.map((device) => ({
      deviceId: device._id,
      deviceName: device.deviceName,
      status: device.status,
      healthScore: (device.usageStatistics?.usageCount - device.usageStatistics?.errorCount) / (device.usageStatistics?.usageCount || 1) * 100,
      lastUsed: device.usageStatistics?.lastUsedDate,
      errorRate: device.usageStatistics?.errorCount / (device.usageStatistics?.usageCount || 1),
    }));

    return healthMetrics;
  } catch (error) {
    throw new AppError('Failed to retrieve device health', 400);
  }
};

/**
 * Export attendance report
 */
exports.exportAttendanceReport = async (schoolId, filters = {}) => {
  try {
    const { dateFrom, dateTo, format = 'CSV' } = filters;
    const query = { schoolId };

    if (dateFrom || dateTo) {
      query.sessionDate = {};
      if (dateFrom) query.sessionDate.$gte = new Date(dateFrom);
      if (dateTo) query.sessionDate.$lte = new Date(dateTo);
    }

    const sessions = await AttendanceSession.find(query).lean();

    await MobileAttendanceLog.create({
      schoolId,
      logType: 'DATA_EXPORTED',
      actionDescription: `Attendance report exported in ${format} format`,
      resourceType: 'ATTENDANCE_SESSION',
      operationDetails: {
        operationType: 'EXPORT',
        operationStatus: 'SUCCESS',
        recordsProcessed: sessions.length,
      },
      status: 'LOGGED',
    });

    return { recordsCount: sessions.length, format };
  } catch (error) {
    throw new AppError('Failed to export report', 400);
  }
};
