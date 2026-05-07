const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communication.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * Announcement Management Routes
 */

// Create announcement
router.post(
  '/announcements',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER']),
  communicationController.createAnnouncement
);

// Get all announcements
router.get(
  '/announcements',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF']),
  communicationController.getAllAnnouncements
);

// Publish announcement
router.put(
  '/announcements/:announcementId/publish',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER']),
  communicationController.publishAnnouncement
);

// Delete announcement
router.delete(
  '/announcements/:announcementId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER']),
  communicationController.deleteAnnouncement
);

/**
 * Message Management Routes
 */

// Send message
router.post(
  '/messages',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.sendMessage
);

// Get user messages
router.get(
  '/messages',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.getUserMessages
);

// Mark message as read
router.put(
  '/messages/:messageId/read',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.markMessageAsRead
);

// Delete message
router.delete(
  '/messages/:messageId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.deleteMessage
);

/**
 * Notification Management Routes
 */

// Create notification
router.post(
  '/notifications',
  authorize(['ADMIN', 'PRINCIPAL', 'SYSTEM', 'COMMUNICATION_MANAGER']),
  communicationController.createNotification
);

// Get user notifications
router.get(
  '/notifications',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.getUserNotifications
);

// Mark notification as read
router.put(
  '/notifications/:notificationId/read',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.markNotificationAsRead
);

/**
 * Message Template Management Routes
 */

// Create message template
router.post(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER']),
  communicationController.createMessageTemplate
);

// Get message templates
router.get(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'STAFF']),
  communicationController.getMessageTemplates
);

/**
 * Communication Preferences Routes
 */

// Get communication preferences
router.get(
  '/preferences',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.getCommunicationPreferences
);

// Update communication preferences
router.put(
  '/preferences',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'COMMUNICATION_MANAGER']),
  communicationController.updateCommunicationPreferences
);

/**
 * Communication Statistics Route
 */

// Get communication statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER']),
  communicationController.getCommunicationStatistics
);

module.exports = router;
