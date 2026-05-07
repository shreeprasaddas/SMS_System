/**
 * DocumentIssued Model
 * Represents issued certificates and official documents
 */

const mongoose = require('mongoose');

const documentIssuedSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'PROVISIONAL_CERTIFICATE', 'CUSTOM'],
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CertificateTemplate',
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  validityDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  documentData: {
    // Dynamic object with template placeholders filled
    // e.g., { studentName: "John Doe", grade: "A+", date: "2026-05-04" }
    type: mongoose.Schema.Schema.Types.Mixed,
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  registrationNumber: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  fileFormat: {
    type: String,
    enum: ['PDF', 'DOCX', 'IMAGE', 'HTML'],
    default: 'PDF',
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ISSUED', 'REVOKED', 'EXPIRED'],
    default: 'DRAFT',
  },
  approvalDetails: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
    rejectionReason: String,
    comments: String,
  },
  signatureDetails: [{
    signatory: String,
    title: String,
    signatureImageUrl: String,
    signedDate: Date,
  }],
  distributionDetails: {
    isDistributed: {
      type: Boolean,
      default: false,
    },
    distributedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    distributedDate: Date,
    distributionMode: {
      type: String,
      enum: ['DIRECT', 'EMAIL', 'COURIER', 'COLLECTED'],
    },
    recipientDetails: {
      name: String,
      email: String,
      phone: String,
    },
    acknowledgmentReceived: Boolean,
    acknowledgedDate: Date,
  },
  auditLog: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedDate: Date,
    details: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  remarks: {
    type: String,
    trim: true,
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
documentIssuedSchema.index({ schoolId: 1, documentNumber: 1 }, { unique: true });
documentIssuedSchema.index({ schoolId: 1, student: 1 });
documentIssuedSchema.index({ schoolId: 1, documentType: 1 });
documentIssuedSchema.index({ schoolId: 1, status: 1 });
documentIssuedSchema.index({ schoolId: 1, class: 1 });
documentIssuedSchema.index({ issueDate: 1 });
documentIssuedSchema.index({ expiryDate: 1 });

// Pre-save middleware
documentIssuedSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('DocumentIssued', documentIssuedSchema);
