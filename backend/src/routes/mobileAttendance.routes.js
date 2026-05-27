/**
 * Mobile Attendance Routes
 * RBAC-enforced endpoints for mobile attendance operations
 */

const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../utils/validation.helper');
const mobileAttendanceController = require('../controllers/mobileAttendance.controller');

// Middleware to attach schoolId from auth
/**
 * Device Management Routes
 */

// Register new device
router.post(
  '/devices',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  mobileAttendanceController.registerDevice
);

// Get all devices
router.get(
  '/devices',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.getDevices
);

// Get device by ID
router.get(
  '/devices/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.getDeviceById
);

// Get device health
router.get(
  '/devices/health/status',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  mobileAttendanceController.getDeviceHealth
);

// Update device status
router.patch(
  '/devices/:id/status',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Device = require('../models/MobileAttendanceDevice.model');
      const device = await Device.findByIdAndUpdate(
        req.params.id,
        { $set: { status: req.body.status } },
        { new: true }
      );
      return res.json({ success: true, data: device });
    } catch (error) {
      next(error);
    }
  }
);

// Deactivate device
router.delete(
  '/devices/:id/deactivate',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Device = require('../models/MobileAttendanceDevice.model');
      const device = await Device.findByIdAndUpdate(
        req.params.id,
        { $set: { status: 'DECOMMISSIONED' } },
        { new: true }
      );
      return res.json({ success: true, data: device, message: 'Device deactivated' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Attendance Session Routes
 */

// Mark attendance
router.post(
  '/sessions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.markAttendance
);

// Get student attendance
router.get(
  '/sessions/student/:studentId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']),
  mobileAttendanceController.getStudentAttendance
);

// Record check-in
router.post(
  '/check-in',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  mobileAttendanceController.recordCheckIn
);

// Record check-out
router.post(
  '/check-out',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  mobileAttendanceController.recordCheckOut
);

// Get attendance by class
router.get(
  '/sessions/class/:classId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const AttendanceSession = require('../models/AttendanceSession.model');
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      
      const [sessions, total] = await Promise.all([
        AttendanceSession.find({
          schoolId: req.user.schoolId,
          classId: req.params.classId,
        })
          .sort({ sessionDate: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        AttendanceSession.countDocuments({
          schoolId: req.user.schoolId,
          classId: req.params.classId,
        }),
      ]);

      return res.json({
        success: true,
        data: sessions,
        pagination: { page: Number(page), limit: Number(limit), total },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * QR Code Routes
 */

// Generate QR code
router.post(
  '/qr-codes',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.generateQRCode
);

// Validate/Scan QR code
router.post(
  '/qr-codes/validate',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  mobileAttendanceController.validateQRCode
);

// Get QR codes list
router.get(
  '/qr-codes',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const QRCode = require('../models/QRCode.model');
      const { page = 1, limit = 20, status } = req.query;
      const skip = (page - 1) * limit;
      const query = { schoolId: req.user.schoolId };

      if (status) query['validityDetails.status'] = status;

      const [codes, total] = await Promise.all([
        QRCode.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        QRCode.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: codes,
        pagination: { page: Number(page), limit: Number(limit), total },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get QR code by ID
router.get(
  '/qr-codes/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const QRCode = require('../models/QRCode.model');
      const qrCode = await QRCode.findOne({
        _id: req.params.id,
        schoolId: req.user.schoolId,
      }).lean();

      if (!qrCode) {
        return res.status(404).json({ success: false, message: 'QR code not found' });
      }

      return res.json({ success: true, data: qrCode });
    } catch (error) {
      next(error);
    }
  }
);

// Regenerate QR code
router.patch(
  '/qr-codes/:id/regenerate',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const QRCode = require('../models/QRCode.model');
      const { generateCode } = require('../utils/codeGenerator');

      const newQRCodeId = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const qrCode = await QRCode.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            qrCodeId: newQRCodeId,
            'validityDetails.generatedDate': new Date(),
          },
        },
        { new: true }
      );

      return res.json({ success: true, data: qrCode, message: 'QR code regenerated' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Biometric Routes
 */

// Enroll biometric
router.post(
  '/biometrics/enroll',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.enrollBiometric
);

// Verify biometric
router.post(
  '/biometrics/verify',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'SYSTEM']),
  mobileAttendanceController.verifyBiometric
);

// Get biometric records
router.get(
  '/biometrics',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const BiometricRecord = require('../models/BiometricRecord.model');
      const { page = 1, limit = 20, biometricType } = req.query;
      const skip = (page - 1) * limit;
      const query = { schoolId: req.user.schoolId };

      if (biometricType) query.biometricType = biometricType;

      const [records, total] = await Promise.all([
        BiometricRecord.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        BiometricRecord.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: records,
        pagination: { page: Number(page), limit: Number(limit), total },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get biometric status for user
router.get(
  '/biometrics/user/:userId/status',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const BiometricRecord = require('../models/BiometricRecord.model');
      const record = await BiometricRecord.findOne({
        userId: req.params.userId,
        schoolId: req.user.schoolId,
      }).lean();

      if (!record) {
        return res.json({
          success: true,
          data: { enrolled: false },
        });
      }

      return res.json({
        success: true,
        data: {
          enrolled: true,
          biometricType: record.biometricType,
          status: record.status,
          enrollmentDate: record.registrationDetails.registeredDate,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Reports & Analytics Routes
 */

// Get attendance statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.getStatistics
);

// Export attendance report
router.get(
  '/reports/export',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  mobileAttendanceController.exportReport
);

// Get mobile logs
router.get(
  '/logs',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  mobileAttendanceController.getMobileLogs
);

/**
 * Data Sync Routes
 */

// Sync attendance data from device
router.post(
  '/sync',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM']),
  mobileAttendanceController.syncData
);

/**
 * Dashboard/Summary Routes
 */

// Get attendance dashboard
router.get(
  '/dashboard',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const AttendanceSession = require('../models/AttendanceSession.model');
      const MobileAttendanceDevice = require('../models/MobileAttendanceDevice.model');

      const [totalSessions, totalDevices, totalBiometrics] = await Promise.all([
        AttendanceSession.countDocuments({ schoolId: req.user.schoolId }),
        MobileAttendanceDevice.countDocuments({ schoolId: req.user.schoolId }),
        BiometricRecord.countDocuments({ schoolId: req.user.schoolId }),
      ]);

      return res.json({
        success: true,
        data: {
          totalSessions,
          totalDevices,
          totalBiometrics,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
