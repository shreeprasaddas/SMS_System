/**
 * Stock Model
 * Represents consumable supplies and inventory stock
 */

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['STATIONERY', 'CLEANING', 'LABORATORY', 'SPORTS', 'CHEMICALS', 'FOOD', 'MEDICAL', 'MAINTENANCE', 'OTHER'],
  },
  description: {
    type: String,
    trim: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['PIECE', 'PACKET', 'BOX', 'CARTON', 'KG', 'LITER', 'METER', 'DOZEN', 'REAM'],
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  minimumStock: {
    type: Number,
    required: true,
    min: 1,
  },
  maximumStock: {
    type: Number,
    required: true,
    min: 1,
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: 1,
  },
  reorderQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  supplier: {
    type: String,
    trim: true,
  },
  supplierCode: {
    type: String,
    trim: true,
  },
  purchaseDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  batchNumber: {
    type: String,
    trim: true,
  },
  storageLocation: {
    type: String,
    required: true,
    trim: true,
  },
  stockHistory: [{
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['IN', 'OUT', 'ADJUSTMENT', 'DAMAGED', 'EXPIRED'],
    },
    quantity: Number,
    reason: String,
    reference: String, // PO, Requisition, etc.
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'],
    default: 'ACTIVE',
  },
  remarks: {
    type: String,
    trim: true,
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
stockSchema.index({ schoolId: 1, itemCode: 1 }, { unique: true });
stockSchema.index({ schoolId: 1, category: 1 });
stockSchema.index({ schoolId: 1, status: 1 });
stockSchema.index({ schoolId: 1, storageLocation: 1 });
stockSchema.index({ expiryDate: 1 }); // For expiry tracking
stockSchema.index({ schoolId: 1, currentStock: 1, minimumStock: 1 }); // For reorder alerts

// Pre-save middleware
stockSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Stock', stockSchema);
