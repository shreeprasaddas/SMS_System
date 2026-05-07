/**
 * Parent Portal Service
 * Business logic for parent portal operations
 */

const ParentProfile = require('../models/ParentProfile.model');
const StudentProgressReport = require('../models/StudentProgressReport.model');
const ParentCommunication = require('../models/ParentCommunication.model');
const FeeStatement = require('../models/FeeStatement.model');
const ParentNotification = require('../models/ParentNotification.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Get parent profile
 */
exports.getParentProfile = async (userId, schoolId) => {
  try {
    const profile = await ParentProfile.findOne({ userId, schoolId }).lean();
    if (!profile) throw new AppError('Parent profile not found', 404);
    return profile;
  } catch (error) {
    throw error;
  }
};

/**
 * Update parent profile
 */
exports.updateParentProfile = async (userId, schoolId, updateData) => {
  try {
    const profile = await ParentProfile.findOneAndUpdate(
      { userId, schoolId },
      {
        $set: updateData,
        $push: {
          auditLog: {
            action: 'PROFILE_UPDATED',
            performedBy: userId,
            timestamp: new Date(),
            changes: updateData,
          },
        },
      },
      { new: true, runValidators: true }
    );
    return profile;
  } catch (error) {
    throw new AppError('Failed to update profile', 400);
  }
};

/**
 * Get all children for parent
 */
exports.getChildrenList = async (userId, schoolId) => {
  try {
    const profile = await ParentProfile.findOne({ userId, schoolId })
      .populate('children.studentId', 'firstName lastName rollNumber classId')
      .lean();

    if (!profile) throw new AppError('Parent profile not found', 404);
    return profile.children || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Get student progress reports
 */
exports.getStudentProgressReports = async (studentId, schoolId, filters = {}) => {
  try {
    const { academicYear, page = 1, limit = 20 } = filters;
    const query = { studentId, schoolId, status: 'PUBLISHED' };

    if (academicYear) query['reportingPeriod.academicYear'] = academicYear;

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      StudentProgressReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      StudentProgressReport.countDocuments(query),
    ]);

    return { reports, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve progress reports', 400);
  }
};

/**
 * Get fee statements for parent
 */
exports.getFeeStatements = async (parentId, schoolId, filters = {}) => {
  try {
    const { paymentStatus, academicYear, page = 1, limit = 20 } = filters;
    const query = { parentId, schoolId };

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (academicYear) query.academicYear = academicYear;

    const skip = (page - 1) * limit;
    const [statements, total] = await Promise.all([
      FeeStatement.find(query)
        .sort({ 'issuanceDetails.issueDate': -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      FeeStatement.countDocuments(query),
    ]);

    return { statements, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve fee statements', 400);
  }
};

/**
 * Get outstanding fees
 */
exports.getOutstandingFees = async (parentId, schoolId) => {
  try {
    const statements = await FeeStatement.find({
      parentId,
      schoolId,
      paymentStatus: { $in: ['UNPAID', 'PARTIAL', 'OVERDUE'] },
    }).lean();

    const totalOutstanding = statements.reduce((sum, stmt) => sum + (stmt.balanceAmount || 0), 0);
    const overdueCount = statements.filter((s) => s.paymentStatus === 'OVERDUE').length;

    return {
      totalOutstanding,
      overdueCount,
      statements,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve outstanding fees', 400);
  }
};

/**
 * Get parent communications
 */
exports.getParentCommunications = async (parentId, schoolId, filters = {}) => {
  try {
    const { status = 'ACTIVE', page = 1, limit = 20 } = filters;
    const query = { parentId, schoolId, status };

    const skip = (page - 1) * limit;
    const [communications, total] = await Promise.all([
      ParentCommunication.find(query)
        .populate('teacherId', 'firstName lastName email')
        .sort({ lastMessageDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ParentCommunication.countDocuments(query),
    ]);

    return { communications, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve communications', 400);
  }
};

/**
 * Send message to teacher
 */
exports.sendMessageToTeacher = async (parentId, schoolId, messageData) => {
  try {
    const communication = await ParentCommunication.findByIdAndUpdate(
      messageData.communicationId,
      {
        $push: {
          messageHistory: {
            messageId: new (require('mongoose')).Types.ObjectId(),
            sender: {
              senderId: parentId,
              senderRole: 'PARENT',
            },
            messageContent: messageData.message,
            timestamp: new Date(),
          },
        },
        $set: {
          lastMessageDate: new Date(),
          lastMessageSender: 'PARENT',
          $inc: { messageCount: 1 },
        },
      },
      { new: true, runValidators: true }
    );

    return communication;
  } catch (error) {
    throw new AppError('Failed to send message', 400);
  }
};

/**
 * Request teacher appointment
 */
exports.requestTeacherAppointment = async (parentId, schoolId, appointmentData) => {
  try {
    const communication = await ParentCommunication.findByIdAndUpdate(
      appointmentData.communicationId,
      {
        $set: {
          communicationType: 'APPOINTMENT_REQUEST',
          'appointmentDetails.isAppointmentRequested': true,
          'appointmentDetails.preferredDateTime': appointmentData.preferredDateTime,
          'appointmentDetails.purpose': appointmentData.purpose,
          'appointmentDetails.appointmentStatus': 'REQUESTED',
        },
      },
      { new: true, runValidators: true }
    );

    return communication;
  } catch (error) {
    throw new AppError('Failed to request appointment', 400);
  }
};

/**
 * Get unread notifications
 */
exports.getUnreadNotifications = async (parentId, schoolId, filters = {}) => {
  try {
    const { page = 1, limit = 20 } = filters;
    const query = { parentId, schoolId, isRead: false };

    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      ParentNotification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ParentNotification.countDocuments(query),
    ]);

    return { notifications, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve notifications', 400);
  }
};

/**
 * Mark notification as read
 */
exports.markNotificationAsRead = async (notificationId, parentId, schoolId) => {
  try {
    const notification = await ParentNotification.findOneAndUpdate(
      { _id: notificationId, parentId, schoolId },
      {
        $set: {
          isRead: true,
          readDate: new Date(),
          readByParentId: parentId,
        },
      },
      { new: true }
    );

    if (!notification) throw new AppError('Notification not found', 404);
    return notification;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all notifications
 */
exports.getAllNotifications = async (parentId, schoolId, filters = {}) => {
  try {
    const { page = 1, limit = 20, notificationType } = filters;
    const query = { parentId, schoolId, status: 'ACTIVE' };

    if (notificationType) query.notificationType = notificationType;

    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      ParentNotification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ParentNotification.countDocuments(query),
    ]);

    return { notifications, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve notifications', 400);
  }
};

/**
 * Get parent portal dashboard summary
 */
exports.getParentDashboardSummary = async (userId, schoolId) => {
  try {
    const profile = await ParentProfile.findOne({ userId, schoolId }).lean();
    if (!profile) throw new AppError('Parent profile not found', 404);

    const [
      unreadNotificationCount,
      outstandingFees,
      latestReport,
      activeChats,
      upcomingAppointments,
    ] = await Promise.all([
      ParentNotification.countDocuments({ parentId: profile._id, schoolId, isRead: false }),
      FeeStatement.countDocuments({
        parentId: profile._id,
        schoolId,
        paymentStatus: { $in: ['UNPAID', 'PARTIAL', 'OVERDUE'] },
      }),
      StudentProgressReport.findOne({
        parentId: profile._id,
        schoolId,
        status: 'PUBLISHED',
      })
        .sort({ createdAt: -1 })
        .lean(),
      ParentCommunication.countDocuments({
        parentId: profile._id,
        schoolId,
        status: 'ACTIVE',
      }),
      ParentCommunication.countDocuments({
        parentId: profile._id,
        schoolId,
        'appointmentDetails.appointmentStatus': 'CONFIRMED',
        'appointmentDetails.appointmentDateTime': { $gte: new Date() },
      }),
    ]);

    return {
      numberOfChildren: profile.numberOfChildren,
      unreadNotifications: unreadNotificationCount,
      outstandingFeesCount: outstandingFees,
      latestProgressReport: latestReport,
      activeConversations: activeChats,
      upcomingAppointments,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get notification count by type
 */
exports.getNotificationSummary = async (parentId, schoolId) => {
  try {
    const summary = await ParentNotification.aggregate([
      {
        $match: { parentId: new (require('mongoose')).Types.ObjectId(parentId), schoolId: new (require('mongoose')).Types.ObjectId(schoolId) },
      },
      {
        $group: {
          _id: '$notificationType',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
          },
        },
      },
    ]);

    return summary;
  } catch (error) {
    throw new AppError('Failed to retrieve notification summary', 400);
  }
};
