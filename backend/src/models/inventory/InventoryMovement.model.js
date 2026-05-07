const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema(
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
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true
    },
    itemName: String,
    movementType: {
      type: String,
      enum: ['IN', 'OUT', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'DAMAGED', 'LOST'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    movementDate: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    referenceDocument: {
      type: String,
      enum: ['PURCHASE_ORDER', 'INDENT', 'REQUISITION', 'ISSUE_SLIP', 'RETURN_SLIP', 'ADJUSTMENT_NOTE', 'OTHER']
    },
    referenceNumber: String,
    relatedTo: {
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId,
      entityName: String
    },
    fromLocation: {
      storageName: String,
      shelf: String,
      bin: String
    },
    toLocation: {
      storageName: String,
      shelf: String,
      bin: String
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
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
inventoryMovementSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('InventoryMovement').countDocuments({ schoolId: this.schoolId });
    this.code = `MOVE-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  // Calculate total value
  this.totalValue = this.quantity * (this.unitCost || 0);
  next();
});

// Indexes
inventoryMovementSchema.index({ schoolId: 1, movementType: 1, movementDate: 1 });
inventoryMovementSchema.index({ schoolId: 1, inventoryId: 1 });
inventoryMovementSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
