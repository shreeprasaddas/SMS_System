/**
 * BackupLog Model
 * Represents database backup records
 */

const mongoose = require('mongoose');

const backupLogSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  backupName: {
    type: String,
    required: true,
    trim: true,
  },
  backupType: {
    type: String,
    enum: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'],
    required: true,
  },
  backupSource: {
    type: String,
    enum: ['DATABASE', 'FILES', 'DOCUMENTS', 'COMPLETE'],
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'VERIFIED'],
    default: 'PENDING',
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // in seconds
    min: 0,
  },
  backupSize: {
    type: Number, // in bytes
    min: 0,
  },
  dataSize: {
    type: Number, // in bytes
    min: 0,
  },
  compressionRatio: {
    type: Number,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  backupPath: {
    type: String,
    trim: true,
  },
  encryptionEnabled: {
    type: Boolean,
    default: true,
  },
  checksumVerified: {
    type: Boolean,
    default: false,
  },
  checksum: {
    type: String,
    trim: true,
  },
  recoveryTested: {
    type: Boolean,
    default: false,
  },
  recoveryTestDate: {
    type: Date,
  },
  recoveryTestResult: {
    type: String,
    enum: ['PASSED', 'FAILED', 'PARTIAL'],
  },
  recordsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  errorLog: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  retentionDays: {
    type: Number,
    default: 30,
    min: 1,
  },
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
backupLogSchema.index({ schoolId: 1, status: 1 });
backupLogSchema.index({ schoolId: 1, startTime: -1 });
backupLogSchema.index({ schoolId: 1, backupType: 1 });
backupLogSchema.index({ schoolId: 1, expiryDate: 1 });

module.exports = mongoose.model('BackupLog', backupLogSchema);
