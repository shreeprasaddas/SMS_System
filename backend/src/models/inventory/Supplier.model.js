const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
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
    supplierName: {
      type: String,
      required: true
    },
    supplierType: {
      type: String,
      enum: ['INDIVIDUAL', 'ORGANIZATION', 'DISTRIBUTOR', 'VENDOR', 'CONTRACTOR'],
      required: true
    },
    contactPerson: String,
    email: {
      type: String,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    phone: String,
    alternatePhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    gstNumber: String,
    panNumber: String,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    },
    categories: [{
      categoryId: mongoose.Schema.Types.ObjectId,
      categoryName: String
    }],
    paymentTerms: {
      paymentMethod: {
        type: String,
        enum: ['CASH', 'CHEQUE', 'ONLINE', 'CREDIT', 'OTHER']
      },
      creditPeriodDays: {
        type: Number,
        default: 0
      },
      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    },
    performanceRating: {
      type: Number,
      min: 1,
      max: 5
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPurchased: {
      type: Number,
      default: 0,
      min: 0
    },
    lastPurchaseDate: Date,
    qualityCertifications: [String],
    documents: [{
      documentType: String,
      documentUrl: String,
      expiryDate: Date,
      uploadedOn: Date
    }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BLACKLISTED', 'ARCHIVED'],
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
supplierSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Supplier').countDocuments({ schoolId: this.schoolId });
    this.code = `SUPP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
supplierSchema.index({ schoolId: 1, status: 1 });
supplierSchema.index({ schoolId: 1, supplierType: 1 });
supplierSchema.index({ schoolId: 1, email: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
