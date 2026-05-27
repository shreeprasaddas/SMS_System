/**
 * ParentNotification Model
 * All notifications sent to parents (grades, attendance, fees, events, etc.)
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const parentNotificationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentProfile',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    notificationSourceId: mongoose.Schema.Types.ObjectId, // Grade, Fee, Event ID etc.
    notificationType: {
      type: String,
      enum: [
        'GRADE_UPDATE',
        'ATTENDANCE_ALERT',
        'FEE_REMINDER',
        'EVENT_ANNOUNCEMENT',
        'TEACHER_MESSAGE',
        'SUSPENSION',
        'ACHIEVEMENT',
        'BEHAVIORAL_UPDATE',
        'EXAM_SCHEDULE',
        'RESULT_PUBLISHED',
        'HOLIDAY_ANNOUNCEMENT',
        'GENERAL_ANNOUNCEMENT',
        'TRANSPORT_ALERT',
        'HOSTEL_UPDATE',
        'LIBRARY_ALERT',
        'SYSTEM_UPDATE',
      ],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    richContent: {
      htmlContent: String,
      mediaUrls: [String],
    },
    details: mongoose.Schema.Types.Mixed,
    relatedEntities: {
      teacherId: mongoose.Schema.Types.ObjectId,
      eventId: mongoose.Schema.Types.ObjectId,
      classId: mongoose.Schema.Types.ObjectId,
      subjectId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readDate: Date,
    readByParentId: mongoose.Schema.Types.ObjectId,
    clickedDate: Date,
    actionDetails: {
      actionUrl: String,
      actionButton: String,
      deepLink: String,
    },
    deliveryDetails: {
      deliveryMethods: [
        {
          method: {
            type: String,
            enum: ['EMAIL', 'SMS', 'IN_APP', 'PUSH_NOTIFICATION'],
          },
          isEnabled: Boolean,
          sentDate: Date,
          status: {
            type: String,
            enum: ['PENDING', 'SENT', 'FAILED', 'BOUNCED'],
          },
          failureReason: String,
          deliveryId: String,
        },
      ],
      preferenceApplied: Boolean,
      preferenceSettings: String,
    },
    schedulingDetails: {
      scheduledSendTime: Date,
      actualSendTime: Date,
      isScheduled: Boolean,
      timezone: String,
    },
    contentLanguage: {
      type: String,
      default: 'en',
    },
    expiry: {
      expiryDate: Date,
      expiryInDays: Number,
      autoArchiveAfterExpiry: Boolean,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    engagementTracking: {
      viewCount: {
        type: Number,
        default: 0,
      },
      clickCount: {
        type: Number,
        default: 0,
      },
      shareCount: {
        type: Number,
        default: 0,
      },
      sharedWith: [
        {
          sharedByParentId: mongoose.Schema.Types.ObjectId,
          sharedDate: Date,
          shareMethod: String,
        },
      ],
      interactionLog: [
        {
          actionType: {
            type: String,
            enum: ['VIEW', 'CLICK', 'SHARE', 'DOWNLOAD'],
          },
          actionTimestamp: Date,
          actionDetails: String,
        },
      ],
    },
    responseRequired: {
      isResponseRequired: Boolean,
      responseDeadline: Date,
      responseReceived: Boolean,
      responseContent: String,
      respondedDate: Date,
    },
    tags: [String],
    category: {
      type: String,
      enum: ['ACADEMIC', 'BEHAVIORAL', 'FINANCIAL', 'EVENT', 'HEALTH', 'TRANSPORT', 'ADMINISTRATIVE', 'OTHER'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'DELETED', 'SPAM'],
      default: 'ACTIVE',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware for code generation
parentNotificationSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('PNOT', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
parentNotificationSchema.index({ schoolId: 1, parentId: 1 });
parentNotificationSchema.index({ schoolId: 1, notificationType: 1 });
parentNotificationSchema.index({ schoolId: 1, isRead: 1 });
parentNotificationSchema.index({ code: 1, schoolId: 1 });
parentNotificationSchema.index({ createdAt: -1, schoolId: 1 });

// Virtual: Is expired
parentNotificationSchema.virtual('isExpired').get(function () {
  if (!this.expiry?.expiryDate) return false;
  return new Date() > this.expiry.expiryDate;
});

// Virtual: Days until expiry
parentNotificationSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiry?.expiryDate) return null;
  const now = new Date();
  const timeDiff = this.expiry.expiryDate - now;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Engagement rate
parentNotificationSchema.virtual('engagementRate').get(function () {
  const engagement = this.engagementTracking;
  const interactions = (engagement?.viewCount || 0) + (engagement?.clickCount || 0);
  return interactions > 0 ? 'HIGH' : (engagement?.viewCount > 0 ? 'MEDIUM' : 'LOW');
});

// Virtual: Time since creation
parentNotificationSchema.virtual('hoursOld').get(function () {
  if (!this.createdAt) return 0;
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return Math.floor(timeDiff / (1000 * 60 * 60));
});

// Virtual: Delivery status summary
parentNotificationSchema.virtual('deliveryStatusSummary').get(function () {
  const methods = this.deliveryDetails?.deliveryMethods || [];
  const sent = methods.filter((m) => m.status === 'SENT').length;
  const failed = methods.filter((m) => m.status === 'FAILED').length;
  return { total: methods.length, sent, failed };
});

module.exports = mongoose.model('ParentNotification', parentNotificationSchema);
