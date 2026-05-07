const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    announcementCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: ANN-{year}-{5-digit-count}'
    },
    title: {
      type: String,
      required: true,
      min: 5,
      max: 200
    },
    description: {
      type: String,
      required: true,
      min: 10,
      max: 5000
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['ACADEMIC', 'EVENT', 'HOLIDAY', 'URGENT', 'NOTICE', 'ACHIEVEMENT', 'RULE_CHANGE', 'FEES', 'GENERAL'],
      default: 'GENERAL',
      index: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },
    targetAudience: {
      type: String,
      enum: ['ALL', 'STUDENTS', 'PARENTS', 'TEACHERS', 'STAFF', 'SPECIFIC_CLASS', 'SPECIFIC_GROUP'],
      required: true
    },
    targetClassIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
      }
    ],
    targetUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    targetRoles: [
      {
        type: String,
        enum: ['STUDENT', 'PARENT', 'TEACHER', 'STAFF', 'ADMIN', 'PRINCIPAL']
      }
    ],
    publishedDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByName: String,
    createdByRole: String,
    attachments: [
      {
        fileName: String,
        fileURL: String,
        fileType: String,
        uploadedDate: {
          type: Date,
          default: Date.now
        }
      }
    ],
    views: {
      totalViews: {
        type: Number,
        default: 0
      },
      viewedBy: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          viewedAt: Date,
          viewCount: Number
        }
      ]
    },
    communicationChannels: {
      type: [
        {
          type: String,
          enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH_NOTIFICATION']
        }
      ],
      default: ['IN_APP']
    },
    emailConfig: {
      sendEmail: {
        type: Boolean,
        default: false
      },
      emailSubject: String,
      emailTemplate: String
    },
    smsConfig: {
      sendSMS: {
        type: Boolean,
        default: false
      },
      smsTemplate: String
    },
    notificationConfig: {
      sendNotification: {
        type: Boolean,
        default: true
      },
      notificationTitle: String,
      notificationBody: String
    },
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        comment: String,
        commentedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
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
    collection: 'announcements'
  }
);

// Indexes for multi-tenancy queries
announcementSchema.index({ schoolId: 1, status: 1 });
announcementSchema.index({ schoolId: 1, category: 1 });
announcementSchema.index({ schoolId: 1, targetAudience: 1 });
announcementSchema.index({ schoolId: 1, priority: 1 });

// Pre-save middleware for code generation
announcementSchema.pre('save', async function (next) {
  if (!this.announcementCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Announcement').countDocuments({
      schoolId: this.schoolId
    });
    this.announcementCode = `ANN-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Announcement', announcementSchema);
