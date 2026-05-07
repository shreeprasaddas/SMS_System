const mongoose = require('mongoose');

const inventoryCategorySchema = new mongoose.Schema(
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
    categoryName: {
      type: String,
      required: true
    },
    description: String,
    categoryType: {
      type: String,
      enum: ['ACADEMIC', 'FURNITURE', 'EQUIPMENT', 'SUPPLIES', 'TECHNOLOGY', 'SPORTS', 'MAINTENANCE', 'INFRASTRUCTURE', 'MISCELLANEOUS'],
      required: true
    },
    budgetAllocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryCategory'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
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
inventoryCategorySchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('InventoryCategory').countDocuments({ schoolId: this.schoolId });
    this.code = `CAT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
inventoryCategorySchema.index({ schoolId: 1, status: 1 });
inventoryCategorySchema.index({ schoolId: 1, categoryType: 1 });

module.exports = mongoose.model('InventoryCategory', inventoryCategorySchema);
