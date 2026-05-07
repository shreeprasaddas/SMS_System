/**
 * DocumentArchive Model
 * Archives and long-term storage of issued documents
 */

const mongoose = require('mongoose');

const documentArchiveSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  archiveNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentIssued',
    required: true,
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
  archiveDate: {
    type: Date,
    default: Date.now,
  },
  retentionPeriod: {
    years: Number,
    startDate: Date,
    endDate: Date,
  },
  storageLocation: {
    physical: {
      building: String,
      floor: String,
      room: String,
      rack: String,
      shelfNumber: String,
      boxNumber: String,
      position: String,
    },
    digital: {
      serverLocation: String,
      backupLocation: String,
      encryptionMethod: String,
      securityLevel: {
        type: String,
        enum: ['PUBLIC', 'RESTRICTED', 'CONFIDENTIAL'],
      },
    },
  },
  metadata: {
    originalFileName: String,
    fileSize: Number,
    fileFormat: String,
    fileHash: String, // For integrity verification
    uploadedDate: Date,
  },
  digitalization: {
    isDigitized: {
      type: Boolean,
      default: false,
    },
    digitizedFormat: String,
    digitizationDate: Date,
    digitizationQuality: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'ARCHIVAL'],
    },
    digitizedFileUrl: String,
    ocr: {
      performed: Boolean,
      ocrText: String,
      ocrAccuracy: Number, // 0-100
    },
  },
  accessLog: [{
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accessDate: Date,
    accessType: {
      type: String,
      enum: ['VIEW', 'DOWNLOAD', 'PRINT', 'EXPORT'],
    },
    ipAddress: String,
    purpose: String,
  }],
  preservationStatus: {
    condition: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DETERIORATED'],
      default: 'EXCELLENT',
    },
    lastPreservationCheck: Date,
    nextPreservationCheck: Date,
    preservationNotes: String,
  },
  migrationHistory: [{
    fromLocation: String,
    toLocation: String,
    migratedDate: Date,
    migratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
  }],
  disposalDetails: {
    status: {
      type: String,
      enum: ['ACTIVE', 'MARKED_FOR_DISPOSAL', 'DISPOSED'],
      default: 'ACTIVE',
    },
    disposalDate: Date,
    disposalMethod: String,
    disposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    disposalReason: String,
    disposalCertificate: String, // URL
  },
  backupDetails: {
    backupFrequency: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'],
    },
    lastBackupDate: Date,
    nextBackupDate: Date,
    backupLocations: [String],
    redundancyLevel: {
      type: String,
      enum: ['SINGLE', 'DUAL', 'TRIPLE'],
    },
  },
  indexing: {
    indexed: Boolean,
    indexTags: [String],
    searchableContent: String,
    indexedDate: Date,
  },
  compliance: {
    gdprCompliant: Boolean,
    legalHoldPlaced: Boolean,
    auditTrailAvailable: Boolean,
    certifications: [String], // ISO, etc.
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
documentArchiveSchema.index({ schoolId: 1, archiveNumber: 1 }, { unique: true });
documentArchiveSchema.index({ schoolId: 1, document: 1 });
documentArchiveSchema.index({ schoolId: 1, student: 1 });
documentArchiveSchema.index({ schoolId: 1, 'storageLocation.physical.boxNumber': 1 });
documentArchiveSchema.index({ archiveDate: 1 });
documentArchiveSchema.index({ 'retentionPeriod.endDate': 1 });
documentArchiveSchema.index({ 'disposalDetails.status': 1 });

// Pre-save middleware
documentArchiveSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('DocumentArchive', documentArchiveSchema);
