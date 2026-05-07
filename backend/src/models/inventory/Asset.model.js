/**
 * Asset Model
 * Represents school assets (furniture, equipment, etc.)
 */

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  assetCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  assetName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['FURNITURE', 'ELECTRONICS', 'SPORTS_EQUIPMENT', 'LAB_EQUIPMENT', 'BOOKS', 'COMPUTERS', 'VEHICLES', 'INFRASTRUCTURE', 'OTHER'],
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
  totalValue: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
    default: 'EXCELLENT',
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyExpiry: {
    type: Date,
  },
  serialNumbers: [{
    type: String,
    trim: true,
  }],
  depreciation: {
    method: {
      type: String,
      enum: ['STRAIGHT_LINE', 'DECLINING_BALANCE'],
      default: 'STRAIGHT_LINE',
    },
    rate: {
      type: Number,
      min: 0,
      max: 100,
    },
    usefulLife: {
      type: Number, // in years
      min: 1,
    },
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DAMAGED', 'LOST', 'DISCARDED'],
    default: 'ACTIVE',
  },
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
assetSchema.index({ schoolId: 1, assetCode: 1 }, { unique: true });
assetSchema.index({ schoolId: 1, category: 1 });
assetSchema.index({ schoolId: 1, location: 1 });
assetSchema.index({ schoolId: 1, status: 1 });
assetSchema.index({ schoolId: 1, condition: 1 });

// Pre-save middleware to calculate total value
assetSchema.pre('save', function(next) {
  if (this.quantity && this.unitCost) {
    this.totalValue = this.quantity * this.unitCost;
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
