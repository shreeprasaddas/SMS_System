/**
 * Notice & Circular Management Service
 * Business logic for notice and circular operations
 */

const Notice = require('../models/Notice.model');
const NoticeTemplate = require('../models/NoticeTemplate.model');
const NoticeAcknowledgment = require('../models/NoticeAcknowledgment.model');
const NoticeAttachment = require('../models/NoticeAttachment.model');
const CircularDistribution = require('../models/CircularDistribution.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create notice
 */
exports.createNotice = async (data, schoolId) => {
  try {
    const notice = await Notice.create({
      ...data,
      schoolId,
    });

    return notice;
  } catch (error) {
    throw new AppError('Failed to create notice', 400);
  }
};

/**
 * Get all notices with filters and pagination
 */
exports.getNotices = async (schoolId, filters = {}) => {
  try {
    const { circularType, status, priority, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (circularType) query.circularType = circularType;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;
    const [notices, total] = await Promise.all([
      Notice.find(query)
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notice.countDocuments(query),
    ]);

    return { notices, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve notices', 400);
  }
};

/**
 * Get notice by ID
 */
exports.getNoticeById = async (noticeId, schoolId) => {
  try {
    const notice = await Notice.findOne({ _id: noticeId, schoolId })
      .populate('issuedBy', 'firstName lastName role')
      .lean();

    if (!notice) throw new AppError('Notice not found', 404);
    return notice;
  } catch (error) {
    throw error;
  }
};

/**
 * Update notice
 */
exports.updateNotice = async (noticeId, schoolId, updateData) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: noticeId, schoolId },
      {
        $set: updateData,
        $push: {
          auditLog: {
            action: 'NOTICE_UPDATED',
            performedBy: updateData.performedBy,
            timestamp: new Date(),
            changes: updateData,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!notice) throw new AppError('Notice not found', 404);
    return notice;
  } catch (error) {
    throw error;
  }
};

/**
 * Publish notice
 */
exports.publishNotice = async (noticeId, schoolId, publishedBy) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: noticeId, schoolId },
      {
        $set: {
          status: 'PUBLISHED',
          'publishingDetails.publishedDate': new Date(),
          'publishingDetails.publishedBy': publishedBy,
        },
        $push: {
          auditLog: {
            action: 'NOTICE_PUBLISHED',
            performedBy: publishedBy,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!notice) throw new AppError('Notice not found', 404);
    return notice;
  } catch (error) {
    throw new AppError('Failed to publish notice', 400);
  }
};

/**
 * Create notice template
 */
exports.createTemplate = async (data, schoolId) => {
  try {
    const template = await NoticeTemplate.create({
      ...data,
      schoolId,
    });

    return template;
  } catch (error) {
    throw new AppError('Failed to create template', 400);
  }
};

/**
 * Get templates
 */
exports.getTemplates = async (schoolId, filters = {}) => {
  try {
    const { circularType, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (circularType) query.circularType = circularType;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      NoticeTemplate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NoticeTemplate.countDocuments(query),
    ]);

    return { templates, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve templates', 400);
  }
};

/**
 * Create acknowledgment for notice
 */
exports.createAcknowledgment = async (data, schoolId) => {
  try {
    const acknowledgment = await NoticeAcknowledgment.create({
      ...data,
      schoolId,
      status: 'ACKNOWLEDGED',
      acknowledgedDate: new Date(),
    });

    // Update notice acknowledgments array
    await Notice.findByIdAndUpdate(
      data.noticeId,
      {
        $push: {
          acknowledgments: {
            userId: data.userId,
            acknowledgedDate: new Date(),
          },
        },
      },
      { runValidators: true }
    );

    return acknowledgment;
  } catch (error) {
    throw new AppError('Failed to create acknowledgment', 400);
  }
};

/**
 * Get acknowledgments for notice
 */
exports.getAcknowledgments = async (noticeId, schoolId, filters = {}) => {
  try {
    const { status, page = 1, limit = 20 } = filters;
    const query = { noticeId, schoolId };

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [acknowledgments, total] = await Promise.all([
      NoticeAcknowledgment.find(query)
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NoticeAcknowledgment.countDocuments(query),
    ]);

    return { acknowledgments, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve acknowledgments', 400);
  }
};

/**
 * Upload attachment to notice
 */
exports.uploadAttachment = async (data, schoolId) => {
  try {
    const attachment = await NoticeAttachment.create({
      ...data,
      schoolId,
    });

    // Add attachment to notice
    await Notice.findByIdAndUpdate(
      data.noticeId,
      {
        $push: {
          attachments: {
            fileId: attachment._id,
            fileName: data.fileName,
            fileUrl: data.filePath,
            uploadDate: new Date(),
          },
        },
      },
      { runValidators: true }
    );

    return attachment;
  } catch (error) {
    throw new AppError('Failed to upload attachment', 400);
  }
};

/**
 * Get attachments for notice
 */
exports.getAttachments = async (noticeId, schoolId, filters = {}) => {
  try {
    const { page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const [attachments, total] = await Promise.all([
      NoticeAttachment.find({ noticeId, schoolId, status: 'ACTIVE' })
        .sort({ uploadedDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NoticeAttachment.countDocuments({ noticeId, schoolId, status: 'ACTIVE' }),
    ]);

    return { attachments, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve attachments', 400);
  }
};

/**
 * Create circular distribution
 */
exports.createDistribution = async (data, schoolId) => {
  try {
    const distribution = await CircularDistribution.create({
      ...data,
      schoolId,
    });

    return distribution;
  } catch (error) {
    throw new AppError('Failed to create distribution', 400);
  }
};

/**
 * Get distribution tracking
 */
exports.getDistributionTracking = async (noticeId, schoolId) => {
  try {
    const distribution = await CircularDistribution.findOne({
      noticeId,
      schoolId,
    })
      .populate('noticeId', 'title circularType')
      .lean();

    if (!distribution) throw new AppError('Distribution tracking not found', 404);
    return distribution;
  } catch (error) {
    throw error;
  }
};

/**
 * Get pending acknowledgments
 */
exports.getPendingAcknowledgments = async (schoolId, filters = {}) => {
  try {
    const { page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const [pending, total] = await Promise.all([
      NoticeAcknowledgment.find({
        schoolId,
        status: 'PENDING',
      })
        .populate('noticeId', 'title priority')
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NoticeAcknowledgment.countDocuments({
        schoolId,
        status: 'PENDING',
      }),
    ]);

    return { pending, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve pending acknowledgments', 400);
  }
};

/**
 * Get notice statistics
 */
exports.getNoticeStatistics = async (schoolId, filters = {}) => {
  try {
    const { circularType } = filters;
    const query = { schoolId };

    if (circularType) query.circularType = circularType;

    const [totalNotices, draftNotices, publishedNotices, archivedNotices] = await Promise.all([
      Notice.countDocuments(query),
      Notice.countDocuments({ ...query, status: 'DRAFT' }),
      Notice.countDocuments({ ...query, status: 'PUBLISHED' }),
      Notice.countDocuments({ ...query, status: 'ARCHIVED' }),
    ]);

    return {
      totalNotices,
      draftNotices,
      publishedNotices,
      archivedNotices,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve statistics', 400);
  }
};
