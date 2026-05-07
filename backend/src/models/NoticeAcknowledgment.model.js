/**
 * Notice Acknowledgment Model
 * Schema for tracking notice acknowledgments
 */

const mongoose = require('mongoose');

const noticeAcknowledgmentSchema = new mongoose.Schema(
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
    noticeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notice',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    acknowledgedDate: {
      type: Date,
    },
    acknowledgedTime: {
      type: String,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
    },
    signature: {
      fileId: String,
      fileUrl: String,
      uploadDate: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACKNOWLEDGED', 'OVERDUE'],
      default: 'PENDING',
      index: true,
    },
    sendReminders: {
      type: Boolean,
      default: false,
    },
    reminders: [
      {
        sentDate: Date,
        sentVia: {
          type: String,
          enum: ['EMAIL', 'SMS', 'IN_APP', 'PUSH'],
        },
      },
    ],
    escalationDetails: {
      escalatedToParent: Boolean,
      escalatedDate: Date,
      escalationReason: String,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: () => new Date() },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate code
noticeAcknowledgmentSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('NACK', this.schoolId);
  }
  next();
});

// Virtual: days overdue
noticeAcknowledgmentSchema.virtual('daysOverdue').get(function () {
  if (this.status !== 'OVERDUE' || !this.createdAt) return 0;
  return Math.ceil((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual: is escalated
noticeAcknowledgmentSchema.virtual('isEscalated').get(function () {
  return this.escalationDetails?.escalatedToParent || false;
});

// Compound index
noticeAcknowledgmentSchema.index({ schoolId: 1, noticeId: 1 });
noticeAcknowledgmentSchema.index({ schoolId: 1, userId: 1 });
noticeAcknowledgmentSchema.index({ noticeId: 1, status: 1 });

noticeAcknowledgmentSchema.set('toJSON', { virtuals: true });
noticeAcknowledgmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NoticeAcknowledgment', noticeAcknowledgmentSchema);
