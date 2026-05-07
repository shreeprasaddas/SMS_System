const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    messageCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: MSG-{year}-{5-digit-count}'
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderName: String,
    senderRole: String,
    recipientType: {
      type: String,
      enum: ['INDIVIDUAL', 'GROUP', 'CLASS', 'ROLE', 'BROADCAST'],
      required: true
    },
    recipients: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        userRole: String,
        deliveryStatus: {
          type: String,
          enum: ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'],
          default: 'PENDING'
        },
        sentAt: Date,
        deliveredAt: Date,
        readAt: Date,
        readDeviceInfo: String
      }
    ],
    subject: {
      type: String,
      required: true,
      min: 3,
      max: 200
    },
    content: {
      type: String,
      required: true,
      min: 1
    },
    htmlContent: String,
    messageType: {
      type: String,
      enum: ['DIRECT', 'CONVERSATION', 'BROADCAST', 'SYSTEM_ALERT'],
      default: 'DIRECT'
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL'
    },
    category: {
      type: String,
      enum: ['ACADEMIC', 'ADMINISTRATIVE', 'PERSONAL', 'EMERGENCY', 'GENERAL', 'DISCIPLINARY'],
      default: 'GENERAL'
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    attachments: [
      {
        fileName: String,
        fileURL: String,
        fileType: String,
        fileSize: Number,
        uploadedDate: {
          type: Date,
          default: Date.now
        }
      }
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'SENT', 'ARCHIVED', 'DELETED'],
      default: 'DRAFT',
      index: true
    },
    scheduledSendTime: Date,
    readReceipts: {
      totalRecipients: Number,
      readCount: {
        type: Number,
        default: 0
      },
      deliveredCount: {
        type: Number,
        default: 0
      },
      failedCount: {
        type: Number,
        default: 0
      }
    },
    communicationChannels: [
      {
        type: String,
        enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
        default: 'IN_APP'
      }
    ],
    tags: [String],
    isStarred: {
      type: Boolean,
      default: false
    },
    isImportant: {
      type: Boolean,
      default: false
    },
    softDelete: {
      isDeleted: {
        type: Boolean,
        default: false
      },
      deletedBy: mongoose.Schema.Types.ObjectId,
      deletedAt: Date
    },
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
    collection: 'messages'
  }
);

// Indexes for multi-tenancy queries
messageSchema.index({ schoolId: 1, status: 1 });
messageSchema.index({ schoolId: 1, senderId: 1 });
messageSchema.index({ schoolId: 1, 'recipients.userId': 1 });
messageSchema.index({ schoolId: 1, priority: 1 });
messageSchema.index({ schoolId: 1, conversationId: 1 });

// Pre-save middleware for code generation
messageSchema.pre('save', async function (next) {
  if (!this.messageCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Message').countDocuments({
      schoolId: this.schoolId
    });
    this.messageCode = `MSG-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
