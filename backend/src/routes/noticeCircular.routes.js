/**
 * Notice & Circular Management Routes
 * RBAC-enforced endpoints for notice and circular operations
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const noticeCircularController = require('../controllers/noticeCircular.controller');

// Middleware
router.use(authenticate);

/**
 * Notice Management Routes
 */

// Create notice
router.post(
  '/notices',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.createNotice
);

// Get all notices
router.get(
  '/notices',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getNotices
);

// Get notice by ID
router.get(
  '/notices/:noticeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getNoticeById
);

// Update notice
router.put(
  '/notices/:noticeId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.updateNotice
);

// Publish notice
router.post(
  '/notices/:noticeId/publish',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.publishNotice
);

// Archive notice
router.patch(
  '/notices/:noticeId/archive',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Notice = require('../models/Notice.model');
      const notice = await Notice.findByIdAndUpdate(
        req.params.noticeId,
        { status: 'ARCHIVED' },
        { new: true }
      );
      return res.json({ success: true, data: notice });
    } catch (error) {
      next(error);
    }
  }
);

// Cancel notice
router.patch(
  '/notices/:noticeId/cancel',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Notice = require('../models/Notice.model');
      const notice = await Notice.findByIdAndUpdate(
        req.params.noticeId,
        { status: 'CANCELLED' },
        { new: true }
      );
      return res.json({ success: true, data: notice });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Template Management Routes
 */

// Create template
router.post(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.createTemplate
);

// Get templates
router.get(
  '/templates',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'SYSTEM']),
  noticeCircularController.getTemplates
);

// Get template by ID
router.get(
  '/templates/:templateId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const NoticeTemplate = require('../models/NoticeTemplate.model');
      const template = await NoticeTemplate.findById(req.params.templateId).lean();

      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      return res.json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }
);

// Update template
router.put(
  '/templates/:templateId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const NoticeTemplate = require('../models/NoticeTemplate.model');
      const template = await NoticeTemplate.findByIdAndUpdate(
        req.params.templateId,
        { ...req.body, updatedByUserId: req.user._id },
        { new: true, runValidators: true }
      );

      return res.json({ success: true, data: template, message: 'Template updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Acknowledgment Routes
 */

// Create acknowledgment
router.post(
  '/acknowledgments',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SYSTEM']),
  noticeCircularController.createAcknowledgment
);

// Get acknowledgments for specific notice
router.get(
  '/notices/:noticeId/acknowledgments',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'SYSTEM']),
  noticeCircularController.getAcknowledgments
);

// Get pending acknowledgments
router.get(
  '/acknowledgments/pending',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getPendingAcknowledgments
);

// Mark acknowledgment as overdue
router.patch(
  '/acknowledgments/:acknowledmentId/overdue',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const NoticeAcknowledgment = require('../models/NoticeAcknowledgment.model');
      const ack = await NoticeAcknowledgment.findByIdAndUpdate(
        req.params.acknowledmentId,
        { status: 'OVERDUE' },
        { new: true }
      );

      return res.json({ success: true, data: ack });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Attachment Routes
 */

// Upload attachment
router.post(
  '/notices/:noticeId/attachments',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'TEACHER', 'SYSTEM']),
  noticeCircularController.uploadAttachment
);

// Get attachments for notice
router.get(
  '/notices/:noticeId/attachments',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getAttachments
);

// Download attachment
router.get(
  '/attachments/:attachmentId/download',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const NoticeAttachment = require('../models/NoticeAttachment.model');
      const attachment = await NoticeAttachment.findByIdAndUpdate(
        req.params.attachmentId,
        { $inc: { downloadCount: 1 } },
        { new: true }
      );

      return res.json({ success: true, data: attachment, message: 'Attachment ready for download' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete attachment
router.delete(
  '/attachments/:attachmentId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const NoticeAttachment = require('../models/NoticeAttachment.model');
      await NoticeAttachment.findByIdAndUpdate(
        req.params.attachmentId,
        { status: 'DELETED' }
      );

      return res.json({ success: true, message: 'Attachment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Distribution Routes
 */

// Create distribution
router.post(
  '/distribution',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.createDistribution
);

// Get distribution tracking
router.get(
  '/distribution/:noticeId',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getDistributionTracking
);

// Update distribution status
router.patch(
  '/distribution/:noticeId/status',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const CircularDistribution = require('../models/CircularDistribution.model');
      const distribution = await CircularDistribution.findOneAndUpdate(
        { noticeId: req.params.noticeId },
        { distributionStatus: req.body.status },
        { new: true }
      );

      return res.json({ success: true, data: distribution });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Analytics & Statistics Routes
 */

// Get notice statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  noticeCircularController.getNoticeStatistics
);

// Get notices by type
router.get(
  '/type/:circularType',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Notice = require('../models/Notice.model');
      const notices = await Notice.find({
        schoolId: req.user.schoolId,
        circularType: req.params.circularType,
        status: 'PUBLISHED',
      })
        .sort({ issueDate: -1 })
        .lean();

      return res.json({ success: true, data: notices });
    } catch (error) {
      next(error);
    }
  }
);

// Get urgent notices
router.get(
  '/urgent',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Notice = require('../models/Notice.model');
      const notices = await Notice.find({
        schoolId: req.user.schoolId,
        priority: 'URGENT',
        status: 'PUBLISHED',
      })
        .sort({ issueDate: -1 })
        .limit(10)
        .lean();

      return res.json({ success: true, data: notices });
    } catch (error) {
      next(error);
    }
  }
);

// Search notices
router.get(
  '/search/:keyword',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'COMMUNICATION_MANAGER', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Notice = require('../models/Notice.model');
      const notices = await Notice.find({
        schoolId: req.user.schoolId,
        $or: [
          { title: { $regex: req.params.keyword, $options: 'i' } },
          { description: { $regex: req.params.keyword, $options: 'i' } },
        ],
      })
        .sort({ issueDate: -1 })
        .limit(20)
        .lean();

      return res.json({ success: true, data: notices });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
