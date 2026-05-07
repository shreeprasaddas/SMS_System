/**
 * Equipment Model
 * Represents laboratory, sports, and specialized equipment
 */

const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  equipmentCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  equipmentName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['LAB', 'SPORTS', 'COMPUTER', 'AUDIOVISUAL', 'MEDICAL', 'ART_CRAFT', 'MUSIC', 'OTHER'],
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  modelNumber: {
    type: String,
    trim: true,
  },
  serialNumber: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyExpiry: {
    type: Date,
  },
  lastCalibrationDate: {
    type: Date,
  },
  nextCalibrationDate: {
    type: Date,
  },
  calibrationFrequency: {
    type: String,
    enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY'],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL'],
    default: 'EXCELLENT',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'UNDER_REPAIR', 'DAMAGED', 'LOST', 'DISCARDED'],
    default: 'ACTIVE',
  },
  lastUsedDate: {
    type: Date,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  maintenanceLog: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetMaintenance',
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedDate: {
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
equipmentSchema.index({ schoolId: 1, equipmentCode: 1 }, { unique: true });
equipmentSchema.index({ schoolId: 1, type: 1 });
equipmentSchema.index({ schoolId: 1, department: 1 });
equipmentSchema.index({ schoolId: 1, location: 1 });
equipmentSchema.index({ schoolId: 1, status: 1 });
equipmentSchema.index({ schoolId: 1, condition: 1 });

// Pre-save middleware
equipmentSchema.pre('save', function(next) {
  if (this.quantity && this.unitCost) {
    this.totalCost = this.quantity * this.unitCost;
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);
