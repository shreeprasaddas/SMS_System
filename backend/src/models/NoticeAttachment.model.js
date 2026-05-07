/**
 * Notice Attachment Model
 * Schema for managing file attachments to notices
 */

const mongoose = require('mongoose');

const noticeAttachmentSchema = new mongoose.Schema(
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
    filePath: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    fileType: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedDate: {
      type: Date,
      default: () => new Date(),
    },
    documentType: {
      type: String,
      enum: ['PDF', 'IMAGE', 'VIDEO', 'DOCUMENT', 'SPREADSHEET', 'OTHER'],
      required: true,
    },
    virusScanned: {
      type: Boolean,
      default: false,
    },
    scanDate: {
      type: Date,
    },
    scanResult: {
      type: String,
      enum: ['CLEAN', 'INFECTED', 'SUSPICIOUS', 'UNKNOWN'],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    accessLevel: {
      type: String,
      enum: ['PUBLIC', 'RESTRICTED', 'CONFIDENTIAL'],
      default: 'RESTRICTED',
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
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
noticeAttachmentSchema.pre('save', async function (next) {
  if (!this.code) {
    const { generateCode } = require('../utils/codeGenerator');
    this.code = await generateCode('NATT', this.schoolId);
  }
  next();
});

// Virtual: is expired
noticeAttachmentSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual: days until expiry
noticeAttachmentSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  return Math.ceil((this.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
});

// Virtual: file size in MB
noticeAttachmentSchema.virtual('fileSizeInMB').get(function () {
  if (!this.fileSize) return 0;
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

// Compound index
noticeAttachmentSchema.index({ schoolId: 1, noticeId: 1 });
noticeAttachmentSchema.index({ noticeId: 1, status: 1 });

noticeAttachmentSchema.set('toJSON', { virtuals: true });
noticeAttachmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NoticeAttachment', noticeAttachmentSchema);
