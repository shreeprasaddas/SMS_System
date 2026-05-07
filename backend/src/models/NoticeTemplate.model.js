/**
 * Notice Template Model
 * Schema for reusable notice templates
 */

const mongoose = require('mongoose');

const noticeTemplateSchema = new mongoose.Schema(
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
    templateName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    templateContent: {
      type: String,
      required: true,
    },
    placeholders: [
      {
        placeholderName: String,
        description: String,
        dataType: String,
        defaultValue: String,
      },
    ],
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedDate: {
      type: Date,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
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
noticeTemplateSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('NOTPL', this.schoolId);
  }
  next();
});

// Virtual: days since last used
noticeTemplateSchema.virtual('daysSinceLastUsed').get(function () {
  if (!this.lastUsedDate) return null;
  return Math.ceil((new Date() - this.lastUsedDate) / (1000 * 60 * 60 * 24));
});

// Compound index
noticeTemplateSchema.index({ schoolId: 1, circularType: 1 });
noticeTemplateSchema.index({ schoolId: 1, status: 1 });

noticeTemplateSchema.set('toJSON', { virtuals: true });
noticeTemplateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NoticeTemplate', noticeTemplateSchema);
