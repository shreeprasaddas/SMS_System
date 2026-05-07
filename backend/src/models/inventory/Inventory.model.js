const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    itemName: {
      type: String,
      required: true
    },
    itemDescription: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryCategory',
      required: true
    },
    categoryName: String,
    itemCode: {
      type: String,
      unique: true,
      sparse: true
    },
    unitOfMeasure: {
      type: String,
      enum: ['PIECE', 'KG', 'LITER', 'METER', 'BOX', 'PACK', 'BUNDLE', 'SET', 'OTHER'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    minimumThreshold: {
      type: Number,
      default: 0,
      min: 0
    },
    maximumThreshold: {
      type: Number,
      default: 0,
      min: 0
    },
    reorderLevel: {
      type: Number,
      default: 0,
      min: 0
    },
    unitCost: {
      type: Number,
      default: 0,
      min: 0
    },
    totalValue: {
      type: Number,
      default: 0,
      min: 0
    },
    location: {
      storageName: String,
      shelf: String,
      bin: String,
      coordinates: String
    },
    supplier: {
      supplierId: mongoose.Schema.Types.ObjectId,
      supplierName: String
    },
    dateOfPurchase: Date,
    warrantyExpiryDate: Date,
    maintenanceSchedule: [{
      description: String,
      frequencyMonths: Number,
      lastMaintenanceDate: Date,
      nextMaintenanceDate: Date
    }],
    usageStatus: {
      type: String,
      enum: ['IN_USE', 'SPARE', 'DAMAGED', 'OBSOLETE', 'UNDER_MAINTENANCE'],
      default: 'IN_USE',
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    attachments: [{
      url: String,
      fileName: String,
      uploadedOn: Date
    }],
    remarks: String,
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
inventorySchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Inventory').countDocuments({ schoolId: this.schoolId });
    this.code = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  // Calculate total value
  this.totalValue = this.quantity * (this.unitCost || 0);
  next();
});

// Indexes
inventorySchema.index({ schoolId: 1, status: 1 });
inventorySchema.index({ schoolId: 1, categoryId: 1 });
inventorySchema.index({ schoolId: 1, usageStatus: 1 });
inventorySchema.index({ schoolId: 1, quantity: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
