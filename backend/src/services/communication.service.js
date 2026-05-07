const Announcement = require('../models/communication/Announcement.model');
const Message = require('../models/communication/Message.model');
const Notification = require('../models/communication/Notification.model');
const MessageTemplate = require('../models/communication/MessageTemplate.model');
const CommunicationPreference = require('../models/communication/CommunicationPreference.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create announcement
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createAnnouncement = async (schoolId, data, userId) => {
  const announcement = await Announcement.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return announcement;
};

/**
 * Get all announcements
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{announcements: Array, total: number}>}
 */
exports.getAllAnnouncements = async (schoolId, filters) => {
  const { status, category, priority, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (category) filterObj.category = category;
  if (priority) filterObj.priority = priority;

  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    Announcement.find(filterObj)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    Announcement.countDocuments(filterObj)
  ]);

  return { announcements, total };
};

/**
 * Publish announcement
 * @param {string} schoolId
 * @param {string} announcementId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.publishAnnouncement = async (schoolId, announcementId, userId) => {
  const announcement = await Announcement.findOneAndUpdate(
    { _id: announcementId, schoolId },
    {
      $set: {
        status: 'PUBLISHED',
        publishedDate: new Date(),
        updatedBy: userId
      }
    },
    { new: true }
  );

  if (!announcement) throw new AppError('Announcement not found', 404);

  return announcement;
};

/**
 * Send message
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.sendMessage = async (schoolId, data, userId) => {
  const message = await Message.create({
    ...data,
    schoolId,
    senderId: userId,
    status: 'SENT',
    createdBy: userId
  });
  return message;
};

/**
 * Get messages for user
 * @param {string} schoolId
 * @param {string} userId
 * @param {Object} filters
 * @returns {Promise<{messages: Array, total: number}>}
 */
exports.getUserMessages = async (schoolId, userId, filters) => {
  const { status, messageType, page = 1, limit = 20 } = filters;

  const filterObj = {
    schoolId,
    $or: [
      { senderId: userId },
      { 'recipients.userId': userId }
    ]
  };

  if (status) filterObj.status = status;
  if (messageType) filterObj.messageType = messageType;

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find(filterObj)
      .populate('senderId', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    Message.countDocuments(filterObj)
  ]);

  return { messages, total };
};

/**
 * Mark message as read
 * @param {string} schoolId
 * @param {string} messageId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.markMessageAsRead = async (schoolId, messageId, userId) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, schoolId, 'recipients.userId': userId },
    {
      $set: {
        'recipients.$.deliveryStatus': 'READ',
        'recipients.$.readAt': new Date()
      }
    },
    { new: true }
  );

  if (!message) throw new AppError('Message not found', 404);

  return message;
};

/**
 * Create notification
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createNotification = async (schoolId, data, userId) => {
  const notification = await Notification.create({
    ...data,
    schoolId,
    status: 'SENT',
    createdBy: userId
  });
  return notification;
};

/**
 * Get user notifications
 * @param {string} schoolId
 * @param {string} userId
 * @param {Object} filters
 * @returns {Promise<{notifications: Array, total: number}>}
 */
exports.getUserNotifications = async (schoolId, userId, filters) => {
  const { status, notificationType, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId, userId };
  if (status) filterObj.status = status;
  if (notificationType) filterObj.notificationType = notificationType;

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(filterObj)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    Notification.countDocuments(filterObj)
  ]);

  return { notifications, total };
};

/**
 * Mark notification as read
 * @param {string} schoolId
 * @param {string} notificationId
 * @returns {Promise<Object>}
 */
exports.markNotificationAsRead = async (schoolId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, schoolId },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
        status: 'READ'
      }
    },
    { new: true }
  );

  if (!notification) throw new AppError('Notification not found', 404);

  return notification;
};

/**
 * Create message template
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createMessageTemplate = async (schoolId, data, userId) => {
  const template = await MessageTemplate.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return template;
};

/**
 * Get message templates
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{templates: Array, total: number}>}
 */
exports.getMessageTemplates = async (schoolId, filters) => {
  const { templateType, category, status, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (templateType) filterObj.templateType = templateType;
  if (category) filterObj.category = category;
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [templates, total] = await Promise.all([
    MessageTemplate.find(filterObj)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    MessageTemplate.countDocuments(filterObj)
  ]);

  return { templates, total };
};

/**
 * Get communication preferences
 * @param {string} schoolId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.getCommunicationPreferences = async (schoolId, userId) => {
  let preferences = await CommunicationPreference.findOne({
    schoolId,
    userId
  });

  if (!preferences) {
    preferences = await CommunicationPreference.create({
      schoolId,
      userId
    });
  }

  return preferences;
};

/**
 * Update communication preferences
 * @param {string} schoolId
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateCommunicationPreferences = async (schoolId, userId, updateData) => {
  const preferences = await CommunicationPreference.findOneAndUpdate(
    { schoolId, userId },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  return preferences;
};

/**
 * Get communication statistics
 * @param {string} schoolId
 * @returns {Promise<Object>}
 */
exports.getCommunicationStatistics = async (schoolId) => {
  const totalAnnouncements = await Announcement.countDocuments({
    schoolId
  });

  const publishedAnnouncements = await Announcement.countDocuments({
    schoolId,
    status: 'PUBLISHED'
  });

  const totalMessages = await Message.countDocuments({
    schoolId
  });

  const totalNotifications = await Notification.countDocuments({
    schoolId
  });

  const unreadNotifications = await Notification.countDocuments({
    schoolId,
    isRead: false
  });

  const activeTemplates = await MessageTemplate.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  return {
    totalAnnouncements,
    publishedAnnouncements,
    draftAnnouncements: totalAnnouncements - publishedAnnouncements,
    totalMessages,
    totalNotifications,
    unreadNotifications,
    activeTemplates
  };
};

/**
 * Delete announcement
 * @param {string} schoolId
 * @param {string} announcementId
 * @returns {Promise<Object>}
 */
exports.deleteAnnouncement = async (schoolId, announcementId) => {
  const announcement = await Announcement.findOneAndDelete({
    _id: announcementId,
    schoolId
  });

  if (!announcement) throw new AppError('Announcement not found', 404);

  return { success: true, message: 'Announcement deleted successfully' };
};

/**
 * Delete message
 * @param {string} schoolId
 * @param {string} messageId
 * @returns {Promise<Object>}
 */
exports.deleteMessage = async (schoolId, messageId) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, schoolId },
    {
      $set: {
        'softDelete.isDeleted': true,
        'softDelete.deletedAt': new Date()
      }
    },
    { new: true }
  );

  if (!message) throw new AppError('Message not found', 404);

  return message;
};

module.exports = exports;
