/**
 * CircularLetter Model
 * Represents official circular letters and notices
 */

const mongoose = require('mongoose');

const circularLetterSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  circularNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['ACADEMIC', 'ADMINISTRATIVE', 'FINANCIAL', 'DISCIPLINARY', 'EVENT', 'HOLIDAY', 'POLICY', 'OTHER'],
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT',
  },
  distribution: {
    targetAudience: {
      type: String,
      enum: ['ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'STAFF', 'SPECIFIC_CLASSES'],
      default: 'ALL',
    },
    specificClasses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    }],
    specificUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  attachments: [{
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
  }],
  acknowledgmentRequired: {
    type: Boolean,
    default: false,
  },
  acknowledgments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acknowledgedAt: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  }],
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  publishedAt: {
    type: Date,
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
circularLetterSchema.index({ schoolId: 1, circularNumber: 1 }, { unique: true });
circularLetterSchema.index({ schoolId: 1, status: 1 });
circularLetterSchema.index({ schoolId: 1, category: 1 });
circularLetterSchema.index({ schoolId: 1, issueDate: -1 });
circularLetterSchema.index({ schoolId: 1, priority: 1 });

module.exports = mongoose.model('CircularLetter', circularLetterSchema);
