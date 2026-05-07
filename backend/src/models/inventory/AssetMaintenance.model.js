/**
 * AssetMaintenance Model
 * Tracks maintenance and repair activities for assets
 */

const mongoose = require('mongoose');

const assetMaintenanceSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  maintenanceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  assetType: {
    type: String,
    required: true,
    enum: ['ASSET', 'EQUIPMENT'],
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assetType === "ASSET" ? "Asset" : "Equipment"',
    required: true,
  },
  maintenanceType: {
    type: String,
    required: true,
    enum: ['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'CALIBRATION'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  completionDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'],
    default: 'SCHEDULED',
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  vendor: {
    vendorName: {
      type: String,
      trim: true,
    },
    vendorContact: {
      type: String,
      trim: true,
    },
    vendorEmail: {
      type: String,
      trim: true,
    },
  },
  cost: {
    parts: {
      type: Number,
      min: 0,
      default: 0,
    },
    labor: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  workDetails: {
    issueDescription: {
      type: String,
      trim: true,
    },
    workPerformed: {
      type: String,
      trim: true,
    },
    partsReplaced: [{
      type: String,
      trim: true,
    }],
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  condition: {
    before: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL'],
    },
    after: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL'],
    },
  },
  attachments: [{
    type: String, // URL
  }],
  nextMaintenanceDate: {
    type: Date,
  },
  nextMaintenanceType: {
    type: String,
    enum: ['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'CALIBRATION'],
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
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedDate: {
    type: Date,
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
assetMaintenanceSchema.index({ schoolId: 1, maintenanceCode: 1 }, { unique: true });
assetMaintenanceSchema.index({ schoolId: 1, asset: 1 });
assetMaintenanceSchema.index({ schoolId: 1, status: 1 });
assetMaintenanceSchema.index({ schoolId: 1, maintenanceType: 1 });
assetMaintenanceSchema.index({ startDate: 1, status: 1 });
assetMaintenanceSchema.index({ nextMaintenanceDate: 1 });

// Pre-save middleware to calculate total cost
assetMaintenanceSchema.pre('save', function(next) {
  if (this.cost) {
    this.cost.total = (this.cost.parts || 0) + (this.cost.labor || 0);
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('AssetMaintenance', assetMaintenanceSchema);
