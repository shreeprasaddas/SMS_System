/**
 * Parent Portal Controller
 * Request handlers for parent portal operations
 */

const parentPortalService = require('../services/parentPortal.service');
const { validateRequest } = require('../utils/validation.helper');
const { ResponseHelper } = require('../utils/response.helper');
const {
  updateParentProfileSchema,
  getProgressReportsSchema,
  getFeeStatementsSchema,
  sendMessageSchema,
  requestAppointmentSchema,
  markNotificationAsReadSchema,
  getCommunicationsSchema,
  getNotificationsSchema,
  getUnreadNotificationsSchema,
  addChildAssociationSchema,
  updateCommunicationPreferencesSchema,
  initiateCommunicationSchema,
} = require('../validations/parentPortal.validation');

/**
 * Get parent profile
 * GET /parent-portal/profile
 */
exports.getParentProfile = async (req, res, next) => {
  try {
    const profile = await parentPortalService.getParentProfile(req.user._id, req.user.schoolId);
    return ResponseHelper.success(res, profile, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update parent profile
 * PUT /parent-portal/profile
 */
exports.updateParentProfile = async (req, res, next) => {
  try {
    await validateRequest(req.body, updateParentProfileSchema);
    const profile = await parentPortalService.updateParentProfile(
      req.user._id,
      req.user.schoolId,
      req.body
    );
    return ResponseHelper.success(res, profile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get children list
 * GET /parent-portal/children
 */
exports.getChildrenList = async (req, res, next) => {
  try {
    const children = await parentPortalService.getChildrenList(req.user._id, req.user.schoolId);
    return ResponseHelper.success(res, children, 'Children list retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Add child association
 * POST /parent-portal/children
 */
exports.addChildAssociation = async (req, res, next) => {
  try {
    await validateRequest(req.body, addChildAssociationSchema);
    const ParentProfile = require('../models/ParentProfile.model');

    const profile = await ParentProfile.findOneAndUpdate(
      { userId: req.user._id, schoolId: req.user.schoolId },
      {
        $push: {
          children: {
            studentId: req.body.studentId,
            relationshipType: req.body.relationshipType,
            enrollmentDate: new Date(),
            isActive: true,
          },
        },
      },
      { new: true }
    );

    return ResponseHelper.success(res, profile.children, 'Child added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get student progress reports
 * GET /parent-portal/progress-reports/:studentId
 */
exports.getStudentProgressReports = async (req, res, next) => {
  try {
    await validateRequest(req.query, getProgressReportsSchema);
    const result = await parentPortalService.getStudentProgressReports(
      req.params.studentId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.reports,
      result.total,
      result.page,
      result.limit,
      'Progress reports retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get fee statements
 * GET /parent-portal/fees
 */
exports.getFeeStatements = async (req, res, next) => {
  try {
    await validateRequest(req.query, getFeeStatementsSchema);
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const result = await parentPortalService.getFeeStatements(
      profile._id,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.statements,
      result.total,
      result.page,
      result.limit,
      'Fee statements retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get outstanding fees
 * GET /parent-portal/fees/outstanding
 */
exports.getOutstandingFees = async (req, res, next) => {
  try {
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const fees = await parentPortalService.getOutstandingFees(profile._id, req.user.schoolId);
    return ResponseHelper.success(res, fees, 'Outstanding fees retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get parent communications
 * GET /parent-portal/communications
 */
exports.getParentCommunications = async (req, res, next) => {
  try {
    await validateRequest(req.query, getCommunicationsSchema);
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const result = await parentPortalService.getParentCommunications(
      profile._id,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.communications,
      result.total,
      result.page,
      result.limit,
      'Communications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Send message to teacher
 * POST /parent-portal/communications/:communicationId/messages
 */
exports.sendMessageToTeacher = async (req, res, next) => {
  try {
    await validateRequest(req.body, sendMessageSchema);
    const communication = await parentPortalService.sendMessageToTeacher(
      req.user._id,
      req.user.schoolId,
      {
        ...req.body,
        communicationId: req.params.communicationId,
      }
    );
    return ResponseHelper.success(res, communication, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Request teacher appointment
 * POST /parent-portal/communications/:communicationId/appointment
 */
exports.requestTeacherAppointment = async (req, res, next) => {
  try {
    await validateRequest(req.body, requestAppointmentSchema);
    const communication = await parentPortalService.requestTeacherAppointment(
      req.user._id,
      req.user.schoolId,
      {
        ...req.body,
        communicationId: req.params.communicationId,
      }
    );
    return ResponseHelper.success(res, communication, 'Appointment request sent successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications
 * GET /parent-portal/notifications/unread
 */
exports.getUnreadNotifications = async (req, res, next) => {
  try {
    await validateRequest(req.query, getUnreadNotificationsSchema);
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const result = await parentPortalService.getUnreadNotifications(
      profile._id,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.notifications,
      result.total,
      result.page,
      result.limit,
      'Unread notifications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all notifications
 * GET /parent-portal/notifications
 */
exports.getAllNotifications = async (req, res, next) => {
  try {
    await validateRequest(req.query, getNotificationsSchema);
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const result = await parentPortalService.getAllNotifications(
      profile._id,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.notifications,
      result.total,
      result.page,
      result.limit,
      'Notifications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PATCH /parent-portal/notifications/:notificationId/read
 */
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const notification = await parentPortalService.markNotificationAsRead(
      req.params.notificationId,
      profile._id,
      req.user.schoolId
    );
    return ResponseHelper.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Get parent dashboard
 * GET /parent-portal/dashboard
 */
exports.getParentDashboard = async (req, res, next) => {
  try {
    const dashboard = await parentPortalService.getParentDashboardSummary(
      req.user._id,
      req.user.schoolId
    );
    return ResponseHelper.success(res, dashboard, 'Dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification summary
 * GET /parent-portal/notifications/summary
 */
exports.getNotificationSummary = async (req, res, next) => {
  try {
    const ParentProfile = require('../models/ParentProfile.model');
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const summary = await parentPortalService.getNotificationSummary(profile._id, req.user.schoolId);
    return ResponseHelper.success(res, summary, 'Notification summary retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate communication with teacher
 * POST /parent-portal/communications
 */
exports.initiateCommunication = async (req, res, next) => {
  try {
    await validateRequest(req.body, initiateCommunicationSchema);
    const ParentProfile = require('../models/ParentProfile.model');
    const ParentCommunication = require('../models/ParentCommunication.model');
    
    const profile = await ParentProfile.findOne({
      userId: req.user._id,
      schoolId: req.user.schoolId,
    }).lean();

    const communication = await ParentCommunication.create({
      ...req.body,
      parentId: profile._id,
      schoolId: req.user.schoolId,
      status: 'ACTIVE',
      messageHistory: [
        {
          messageId: new (require('mongoose')).Types.ObjectId(),
          sender: {
            senderId: profile._id,
            senderRole: 'PARENT',
          },
          messageContent: req.body.messageContent,
          timestamp: new Date(),
        },
      ],
      messageCount: 1,
      lastMessageDate: new Date(),
      lastMessageSender: 'PARENT',
    });

    return ResponseHelper.created(res, communication, 'Communication initiated successfully');
  } catch (error) {
    next(error);
  }
};
