const mongoose = require('mongoose');

const procurementOrderSchema = new mongoose.Schema(
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
    poNumber: {
      type: String,
      required: true,
      unique: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    supplierName: String,
    orderDate: {
      type: Date,
      required: true
    },
    expectedDeliveryDate: {
      type: Date,
      required: true
    },
    actualDeliveryDate: Date,
    items: [{
      inventoryId: mongoose.Schema.Types.ObjectId,
      itemName: String,
      categoryId: mongoose.Schema.Types.ObjectId,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitOfMeasure: String,
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      totalPrice: {
        type: Number,
        min: 0
      },
      description: String,
      specifications: String
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    grossTotal: {
      type: Number,
      min: 0
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    finalAmount: {
      type: Number,
      min: 0
    },
    paymentTerms: {
      paymentMethod: String,
      creditPeriodDays: Number,
      installments: [{
        installmentNumber: Number,
        dueDate: Date,
        amount: Number,
        status: {
          type: String,
          enum: ['PENDING', 'PAID', 'OVERDUE'],
          default: 'PENDING'
        }
      }]
    },
    orderStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'CONFIRMED', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'CANCELLED', 'RETURNED'],
      default: 'DRAFT',
      index: true
    },
    receivedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    pendingQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    deliveryAddress: {
      locationName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    approvalRemarks: String,
    invoiceNumber: String,
    invoiceDate: Date,
    notes: String,
    attachments: [{
      url: String,
      fileName: String,
      uploadedOn: Date
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
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
procurementOrderSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('ProcurementOrder').countDocuments({ schoolId: this.schoolId });
    this.code = `PO-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  
  // Calculate item total prices and update totals
  this.totalAmount = 0;
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
      this.totalAmount += item.totalPrice;
    });
  }
  
  // Calculate tax and discount
  this.taxAmount = (this.totalAmount * (this.taxPercentage || 0)) / 100;
  this.discountAmount = (this.totalAmount * (this.discountPercentage || 0)) / 100;
  this.grossTotal = this.totalAmount + this.taxAmount - this.discountAmount;
  this.finalAmount = this.grossTotal + (this.shippingCharge || 0);
  
  next();
});

// Indexes
procurementOrderSchema.index({ schoolId: 1, orderStatus: 1 });
procurementOrderSchema.index({ schoolId: 1, supplierId: 1 });
procurementOrderSchema.index({ schoolId: 1, approvalStatus: 1 });

module.exports = mongoose.model('ProcurementOrder', procurementOrderSchema);
