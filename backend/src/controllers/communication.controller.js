const communicationService = require('../services/communication.service');
const { ResponseHelper } = require('../utils/responseHelper');
const communicationValidation = require('../validations/communication.validation');
const { AppError } = require('../utils/errorHelper');

/**
 * Create announcement
 * @route POST /api/v1/communication/announcements
 * @access ADMIN, PRINCIPAL
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.createAnnouncementSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const announcement = await communicationService.createAnnouncement(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, announcement, 'Announcement created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all announcements
 * @route GET /api/v1/communication/announcements
 * @access ALL_ROLES
 */
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.announcementFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { announcements, total } = await communicationService.getAllAnnouncements(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      announcements,
      total,
      value.page,
      value.limit,
      'Announcements fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Publish announcement
 * @route PUT /api/v1/communication/announcements/:announcementId/publish
 * @access ADMIN, PRINCIPAL
 */
exports.publishAnnouncement = async (req, res, next) => {
  try {
    const announcement = await communicationService.publishAnnouncement(
      req.user.schoolId,
      req.params.announcementId,
      req.user._id
    );

    return ResponseHelper.success(res, announcement, 'Announcement published successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Send message
 * @route POST /api/v1/communication/messages
 * @access ALL_ROLES
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.sendMessageSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const message = await communicationService.sendMessage(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, message, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user messages
 * @route GET /api/v1/communication/messages
 * @access ALL_ROLES
 */
exports.getUserMessages = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.messageFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { messages, total } = await communicationService.getUserMessages(
      req.user.schoolId,
      req.user._id,
      value
    );

    return ResponseHelper.paginated(
      res,
      messages,
      total,
      value.page,
      value.limit,
      'Messages fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark message as read
 * @route PUT /api/v1/communication/messages/:messageId/read
 * @access ALL_ROLES
 */
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const message = await communicationService.markMessageAsRead(
      req.user.schoolId,
      req.params.messageId,
      req.user._id
    );

    return ResponseHelper.success(res, message, 'Message marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Create notification
 * @route POST /api/v1/communication/notifications
 * @access ADMIN, PRINCIPAL
 */
exports.createNotification = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.createNotificationSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const notification = await communicationService.createNotification(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, notification, 'Notification created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user notifications
 * @route GET /api/v1/communication/notifications
 * @access ALL_ROLES
 */
exports.getUserNotifications = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.notificationFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { notifications, total } = await communicationService.getUserNotifications(
      req.user.schoolId,
      req.user._id,
      value
    );

    return ResponseHelper.paginated(
      res,
      notifications,
      total,
      value.page,
      value.limit,
      'Notifications fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * @route PUT /api/v1/communication/notifications/:notificationId/read
 * @access ALL_ROLES
 */
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await communicationService.markNotificationAsRead(
      req.user.schoolId,
      req.params.notificationId
    );

    return ResponseHelper.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Create message template
 * @route POST /api/v1/communication/templates
 * @access ADMIN, PRINCIPAL
 */
exports.createMessageTemplate = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.createMessageTemplateSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const template = await communicationService.createMessageTemplate(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, template, 'Message template created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get message templates
 * @route GET /api/v1/communication/templates
 * @access ALL_ROLES
 */
exports.getMessageTemplates = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.templateFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { templates, total } = await communicationService.getMessageTemplates(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      templates,
      total,
      value.page,
      value.limit,
      'Message templates fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get communication preferences
 * @route GET /api/v1/communication/preferences
 * @access ALL_ROLES
 */
exports.getCommunicationPreferences = async (req, res, next) => {
  try {
    const preferences = await communicationService.getCommunicationPreferences(
      req.user.schoolId,
      req.user._id
    );

    return ResponseHelper.success(res, preferences, 'Communication preferences fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update communication preferences
 * @route PUT /api/v1/communication/preferences
 * @access ALL_ROLES
 */
exports.updateCommunicationPreferences = async (req, res, next) => {
  try {
    const { error, value } = communicationValidation.updateCommunicationPreferencesSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const preferences = await communicationService.updateCommunicationPreferences(
      req.user.schoolId,
      req.user._id,
      value
    );

    return ResponseHelper.success(res, preferences, 'Communication preferences updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get communication statistics
 * @route GET /api/v1/communication/statistics
 * @access ADMIN, PRINCIPAL
 */
exports.getCommunicationStatistics = async (req, res, next) => {
  try {
    const statistics = await communicationService.getCommunicationStatistics(
      req.user.schoolId
    );

    return ResponseHelper.success(res, statistics, 'Communication statistics fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete announcement
 * @route DELETE /api/v1/communication/announcements/:announcementId
 * @access ADMIN, PRINCIPAL
 */
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const result = await communicationService.deleteAnnouncement(
      req.user.schoolId,
      req.params.announcementId
    );

    return ResponseHelper.success(res, result, 'Announcement deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message
 * @route DELETE /api/v1/communication/messages/:messageId
 * @access ALL_ROLES
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await communicationService.deleteMessage(
      req.user.schoolId,
      req.params.messageId
    );

    return ResponseHelper.success(res, message, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
