/**
 * Parent Portal Routes
 * RBAC-enforced endpoints for parent portal operations
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const parentPortalController = require('../controllers/parentPortal.controller');

// Middleware to attach schoolId from auth
router.use(authenticate);

/**
 * Parent Profile Routes
 */

// Get parent profile
router.get(
  '/profile',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getParentProfile
);

// Update parent profile
router.put(
  '/profile',
  authorize(['PARENT']),
  parentPortalController.updateParentProfile
);

// Update communication preferences
router.patch(
  '/profile/preferences',
  authorize(['PARENT']),
  async (req, res, next) => {
    try {
      const ParentProfile = require('../models/ParentProfile.model');
      const profile = await ParentProfile.findOneAndUpdate(
        { userId: req.user._id, schoolId: req.user.schoolId },
        {
          $set: {
            communicationPreferences: req.body,
          },
        },
        { new: true }
      );
      return res.json({ success: true, data: profile.communicationPreferences });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Children Management Routes
 */

// Get children list
router.get(
  '/children',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getChildrenList
);

// Add child association
router.post(
  '/children',
  authorize(['PARENT']),
  parentPortalController.addChildAssociation
);

// Remove child association
router.delete(
  '/children/:studentId',
  authorize(['PARENT']),
  async (req, res, next) => {
    try {
      const ParentProfile = require('../models/ParentProfile.model');
      const profile = await ParentProfile.findOneAndUpdate(
        { userId: req.user._id, schoolId: req.user.schoolId },
        {
          $pull: {
            children: { studentId: req.params.studentId },
          },
        },
        { new: true }
      );
      return res.json({ success: true, data: profile.children, message: 'Child removed' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Progress Reports Routes
 */

// Get student progress reports
router.get(
  '/progress-reports/:studentId',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL', 'TEACHER']),
  parentPortalController.getStudentProgressReports
);

// View specific progress report
router.get(
  '/progress-reports/:reportId/view',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      const StudentProgressReport = require('../models/StudentProgressReport.model');
      const report = await StudentProgressReport.findById(req.params.reportId).lean();

      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      // Update viewed status
      await StudentProgressReport.findByIdAndUpdate(
        req.params.reportId,
        {
          $set: {
            'parentViewingDetails.hasBeenViewed': true,
            'parentViewingDetails.viewedDate': new Date(),
          },
        }
      );

      return res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
);

// Download progress report
router.get(
  '/progress-reports/:reportId/download',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      const StudentProgressReport = require('../models/StudentProgressReport.model');
      await StudentProgressReport.findByIdAndUpdate(
        req.params.reportId,
        {
          $inc: { 'parentViewingDetails.downloadCount': 1 },
          $set: { 'parentViewingDetails.lastDownloadDate': new Date() },
        }
      );

      return res.json({ success: true, message: 'Report prepared for download' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Fee Management Routes
 */

// Get fee statements
router.get(
  '/fees',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getFeeStatements
);

// Get outstanding fees
router.get(
  '/fees/outstanding',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getOutstandingFees
);

// Get fee statement details
router.get(
  '/fees/:feeStatementId',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      const FeeStatement = require('../models/FeeStatement.model');
      const statement = await FeeStatement.findById(req.params.feeStatementId).lean();

      if (!statement) {
        return res.status(404).json({ success: false, message: 'Fee statement not found' });
      }

      await FeeStatement.findByIdAndUpdate(
        req.params.feeStatementId,
        {
          $inc: { 'parentViewingDetails.downloadCount': 1 },
          $set: { 'parentViewingDetails.lastDownloadDate': new Date() },
        }
      );

      return res.json({ success: true, data: statement });
    } catch (error) {
      next(error);
    }
  }
);

// Download fee receipt
router.get(
  '/fees/:feeStatementId/receipt',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      return res.json({ success: true, message: 'Receipt prepared for download' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Communication Routes
 */

// Initiate communication with teacher
router.post(
  '/communications',
  authorize(['PARENT']),
  parentPortalController.initiateCommunication
);

// Get parent communications
router.get(
  '/communications',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL', 'TEACHER']),
  parentPortalController.getParentCommunications
);

// Get communication details
router.get(
  '/communications/:communicationId',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL', 'TEACHER']),
  async (req, res, next) => {
    try {
      const ParentCommunication = require('../models/ParentCommunication.model');
      const communication = await ParentCommunication.findById(req.params.communicationId)
        .populate('teacherId', 'firstName lastName email')
        .lean();

      if (!communication) {
        return res.status(404).json({ success: false, message: 'Communication not found' });
      }

      return res.json({ success: true, data: communication });
    } catch (error) {
      next(error);
    }
  }
);

// Send message to teacher
router.post(
  '/communications/:communicationId/messages',
  authorize(['PARENT']),
  parentPortalController.sendMessageToTeacher
);

// Request teacher appointment
router.post(
  '/communications/:communicationId/appointment',
  authorize(['PARENT']),
  parentPortalController.requestTeacherAppointment
);

// Archive communication
router.patch(
  '/communications/:communicationId/archive',
  authorize(['PARENT']),
  async (req, res, next) => {
    try {
      const ParentCommunication = require('../models/ParentCommunication.model');
      const communication = await ParentCommunication.findByIdAndUpdate(
        req.params.communicationId,
        { $set: { status: 'ARCHIVED' } },
        { new: true }
      );

      return res.json({ success: true, data: communication, message: 'Communication archived' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Notification Routes
 */

// Get unread notifications
router.get(
  '/notifications/unread',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getUnreadNotifications
);

// Get all notifications
router.get(
  '/notifications',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getAllNotifications
);

// Get notification summary
router.get(
  '/notifications/summary',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getNotificationSummary
);

// Mark notification as read
router.patch(
  '/notifications/:notificationId/read',
  authorize(['PARENT']),
  parentPortalController.markNotificationAsRead
);

// Archive notification
router.patch(
  '/notifications/:notificationId/archive',
  authorize(['PARENT']),
  async (req, res, next) => {
    try {
      const ParentNotification = require('../models/ParentNotification.model');
      const notification = await ParentNotification.findByIdAndUpdate(
        req.params.notificationId,
        { $set: { status: 'ARCHIVED' } },
        { new: true }
      );

      return res.json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  }
);

// Mark all notifications as read
router.patch(
  '/notifications/all/read',
  authorize(['PARENT']),
  async (req, res, next) => {
    try {
      const ParentProfile = require('../models/ParentProfile.model');
      const ParentNotification = require('../models/ParentNotification.model');

      const profile = await ParentProfile.findOne({
        userId: req.user._id,
        schoolId: req.user.schoolId,
      }).lean();

      await ParentNotification.updateMany(
        { parentId: profile._id, schoolId: req.user.schoolId, isRead: false },
        {
          $set: {
            isRead: true,
            readDate: new Date(),
            readByParentId: profile._id,
          },
        }
      );

      return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Dashboard & Summary Routes
 */

// Get parent dashboard
router.get(
  '/dashboard',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  parentPortalController.getParentDashboard
);

// Get student performance summary
router.get(
  '/dashboard/performance/:studentId',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      const StudentProgressReport = require('../models/StudentProgressReport.model');

      const latestReport = await StudentProgressReport.findOne({
        studentId: req.params.studentId,
        status: 'PUBLISHED',
      })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({ success: true, data: latestReport || {} });
    } catch (error) {
      next(error);
    }
  }
);

// Get attendance overview for student
router.get(
  '/dashboard/attendance/:studentId',
  authorize(['PARENT', 'ADMIN', 'PRINCIPAL']),
  async (req, res, next) => {
    try {
      const AttendanceSession = require('../models/AttendanceSession.model');

      const [totalSessions, presentCount, absentCount] = await Promise.all([
        AttendanceSession.countDocuments({
          studentId: req.params.studentId,
          schoolId: req.user.schoolId,
        }),
        AttendanceSession.countDocuments({
          studentId: req.params.studentId,
          schoolId: req.user.schoolId,
          attendanceStatus: 'PRESENT',
        }),
        AttendanceSession.countDocuments({
          studentId: req.params.studentId,
          schoolId: req.user.schoolId,
          attendanceStatus: 'ABSENT',
        }),
      ]);

      const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

      return res.json({
        success: true,
        data: { totalSessions, presentCount, absentCount, percentage },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
