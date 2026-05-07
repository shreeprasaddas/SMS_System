const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    notificationCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: NOTIF-{year}-{5-digit-count}'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: String,
    userRole: String,
    title: {
      type: String,
      required: true,
      min: 3,
      max: 200
    },
    message: {
      type: String,
      required: true,
      min: 1,
      max: 5000
    },
    description: String,
    notificationType: {
      type: String,
      enum: [
        'ANNOUNCEMENT',
        'ADMISSION',
        'EXAM',
        'ATTENDANCE',
        'ASSIGNMENT',
        'GRADE',
        'FEE',
        'TRANSPORT',
        'HOSTEL',
        'LEAVE',
        'EVENT',
        'ALERT',
        'SYSTEM',
        'OTHER'
      ],
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
      default: 'NORMAL'
    },
    sourceEntityType: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'CLASS', 'EXAM', 'ASSIGNMENT', 'ANNOUNCEMENT', 'EVENT', 'SYSTEM'],
      comment: 'Type of entity that triggered this notification'
    },
    sourceEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      comment: 'ID of the entity that triggered this notification'
    },
    relatedData: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'READ', 'ARCHIVED', 'DELETED'],
      default: 'PENDING',
      index: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date,
    readDeviceInfo: String,
    communicationChannels: [
      {
        type: String,
        enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
        default: 'IN_APP'
      }
    ],
    channelStatus: [
      {
        channel: {
          type: String,
          enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION']
        },
        status: {
          type: String,
          enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED'],
          default: 'PENDING'
        },
        sentAt: Date,
        failureReason: String
      }
    ],
    actionUrl: String,
    actionData: mongoose.Schema.Types.Mixed,
    icon: String,
    backgroundColor: String,
    expiresAt: {
      type: Date,
      comment: 'Notification auto-expires after this date'
    },
    isStarred: {
      type: Boolean,
      default: false
    },
    tags: [String],
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        changes: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    updatedBy: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
);

// Indexes for multi-tenancy queries
notificationSchema.index({ schoolId: 1, userId: 1, status: 1 });
notificationSchema.index({ schoolId: 1, userId: 1, isRead: 1 });
notificationSchema.index({ schoolId: 1, notificationType: 1 });
notificationSchema.index({ schoolId: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Pre-save middleware for code generation
notificationSchema.pre('save', async function (next) {
  if (!this.notificationCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Notification').countDocuments({
      schoolId: this.schoolId
    });
    this.notificationCode = `NOTIF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
