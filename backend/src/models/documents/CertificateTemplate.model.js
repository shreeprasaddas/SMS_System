/**
 * CertificateTemplate Model
 * Templates for generating certificates and official documents
 */

const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  templateName: {
    type: String,
    required: true,
    trim: true,
  },
  templateCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'CUSTOM'],
  },
  description: {
    type: String,
    trim: true,
  },
  orientation: {
    type: String,
    enum: ['PORTRAIT', 'LANDSCAPE'],
    default: 'LANDSCAPE',
  },
  pageSize: {
    type: String,
    enum: ['A4', 'A3', 'LETTER', 'LEGAL'],
    default: 'A4',
  },
  header: {
    schoolName: String,
    schoolLogo: String, // URL
    schoolAddress: String,
  },
  body: {
    title: String,
    titleFont: {
      family: String,
      size: Number,
      color: String,
    },
    subtitle: String,
    content: String, // Template with placeholders like {studentName}, {date}, etc.
    contentFont: {
      family: String,
      size: Number,
      color: String,
    },
  },
  footer: {
    issueDate: Boolean,
    footerText: String,
    footerFont: {
      family: String,
      size: Number,
      color: String,
    },
  },
  signatures: [{
    position: String, // LEFT, CENTER, RIGHT
    name: String,
    title: String,
    imageUrl: String, // Signature image
  }],
  watermark: {
    enabled: Boolean,
    text: String,
    opacity: Number,
    position: String, // CENTER, TOP_LEFT, TOP_RIGHT
  },
  placeholders: [{
    name: String,
    description: String,
    defaultValue: String,
  }],
  backgroundColor: String,
  borderColor: String,
  borderWidth: Number,
  customCSS: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
certificateTemplateSchema.index({ schoolId: 1, templateCode: 1 }, { unique: true });
certificateTemplateSchema.index({ schoolId: 1, type: 1 });
certificateTemplateSchema.index({ schoolId: 1, isActive: 1 });

// Pre-save middleware
certificateTemplateSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
