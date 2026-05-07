/**
 * Notice Model
 * Schema for storing school notices and circulars
 */

const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    circularType: {
      type: String,
      enum: [
        'NOTICE',
        'CIRCULAR',
        'ANNOUNCEMENT',
        'URGENT',
        'HOLIDAY',
        'EVENT',
        'ADMISSION',
        'ACADEMIC',
        'ADMINISTRATIVE',
        'TRANSPORTATION',
        'HOSTEL',
      ],
      required: true,
      index: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueDate: {
      type: Date,
      default: () => new Date(),
    },
    effectiveDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    recipients: {
      type: [
        {
          recipientType: {
            type: String,
            enum: ['ALL', 'ROLE_BASED', 'CLASS_BASED', 'INDIVIDUAL'],
          },
          roleId: mongoose.Schema.Types.ObjectId,
          classId: mongoose.Schema.Types.ObjectId,
          userId: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },
    attachments: [
      {
        fileId: String,
        fileName: String,
        fileUrl: String,
        uploadDate: { type: Date, default: () => new Date() },
      },
    ],
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'],
      default: 'DRAFT',
      index: true,
    },
    acknowledgmentRequired: {
      type: Boolean,
      default: false,
    },
    acknowledgments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        acknowledgedDate: Date,
        remarks: String,
      },
    ],
    viewingTracker: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        viewedDate: Date,
        viewedAt: Date,
      },
    ],
    publishingDetails: {
      publishedDate: Date,
      publishedBy: mongoose.Schema.Types.ObjectId,
      revisedCount: { type: Number, default: 0 },
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
noticeSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('NOTICE', this.schoolId);
  }
  next();
});

// Virtual: days until expiry
noticeSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  const now = new Date();
  return Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));
});

// Virtual: is expired
noticeSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual: acknowledgment percentage
noticeSchema.virtual('acknowledgmentPercentage').get(function () {
  if (!this.recipients || this.recipients.length === 0) return 0;
  const totalRequired = this.recipients.length;
  const acknowledged = this.acknowledgments.length;
  return Math.round((acknowledged / totalRequired) * 100);
});

// Compound index
noticeSchema.index({ schoolId: 1, circularType: 1 });
noticeSchema.index({ schoolId: 1, status: 1 });
noticeSchema.index({ code: 1, schoolId: 1 });

noticeSchema.set('toJSON', { virtuals: true });
noticeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notice', noticeSchema);
