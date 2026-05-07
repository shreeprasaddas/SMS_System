/**
 * ParentCommunication Model
 * Messages and interactions between parents and teachers
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const parentCommunicationSchema = new mongoose.Schema(
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    subject: {
      type: String,
      required: true,
    },
    communicationType: {
      type: String,
      enum: ['TEXT_MESSAGE', 'EMAIL', 'APPOINTMENT_REQUEST', 'FEEDBACK', 'COMPLAINT', 'GENERAL_INQUIRY'],
      required: true,
    },
    messageHistory: [
      {
        messageId: mongoose.Schema.Types.ObjectId,
        sender: {
          senderId: mongoose.Schema.Types.ObjectId,
          senderName: String,
          senderRole: {
            type: String,
            enum: ['PARENT', 'TEACHER', 'ADMIN'],
          },
        },
        messageContent: {
          type: String,
          required: true,
        },
        attachments: [
          {
            fileName: String,
            fileUrl: String,
            fileSize: Number,
            uploadDate: Date,
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        readDate: Date,
      },
    ],
    appointmentDetails: {
      isAppointmentRequested: Boolean,
      preferredDateTime: Date,
      appointmentDateTime: Date,
      venue: String,
      meetingLink: String, // For virtual meetings
      appointmentType: {
        type: String,
        enum: ['IN_PERSON', 'VIRTUAL', 'PHONE'],
      },
      purpose: String,
      duration: Number, // in minutes
      appointmentStatus: {
        type: String,
        enum: ['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      },
      notes: String,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      index: true,
    },
    category: {
      type: String,
      enum: ['ACADEMIC', 'BEHAVIORAL', 'HEALTH', 'FINANCIAL', 'GENERAL', 'OTHER'],
    },
    resolution: {
      isResolved: Boolean,
      resolvedDate: Date,
      resolutionNotes: String,
      resolvedByUserId: mongoose.Schema.Types.ObjectId,
    },
    responseDetails: {
      firstResponseDate: Date,
      lastResponseDate: Date,
      responseTimeHours: Number,
    },
    feedback: {
      parentSatisfactionRating: Number, // 1-5
      parentFeedbackComment: String,
      teacherFeedback: String,
    },
    lastMessageDate: Date,
    lastMessageSender: String,
    messageCount: {
      type: Number,
      default: 0,
    },
    unreadMessageCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'RESOLVED', 'CLOSED'],
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
parentCommunicationSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('PCOM', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
parentCommunicationSchema.index({ schoolId, parentId: 1 });
parentCommunicationSchema.index({ schoolId, teacherId: 1 });
parentCommunicationSchema.index({ schoolId, status: 1 });
parentCommunicationSchema.index({ code: 1, schoolId: 1 });

// Virtual: Is appointment scheduled
parentCommunicationSchema.virtual('isAppointmentScheduled').get(function () {
  return this.appointmentDetails?.appointmentStatus === 'CONFIRMED';
});

// Virtual: Response time category
parentCommunicationSchema.virtual('responseTimeCategory').get(function () {
  const hours = this.responseDetails?.responseTimeHours;
  if (!hours) return 'NOT_RESPONDED';
  if (hours <= 4) return 'QUICK';
  if (hours <= 24) return 'PROMPT';
  if (hours <= 72) return 'DELAYED';
  return 'VERY_DELAYED';
});

// Virtual: Days since last message
parentCommunicationSchema.virtual('daysSinceLastMessage').get(function () {
  if (!this.lastMessageDate) return null;
  const now = new Date();
  const timeDiff = now - this.lastMessageDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

// Virtual: Unread status
parentCommunicationSchema.virtual('hasUnreadMessages').get(function () {
  return this.unreadMessageCount > 0;
});

module.exports = mongoose.model('ParentCommunication', parentCommunicationSchema);
