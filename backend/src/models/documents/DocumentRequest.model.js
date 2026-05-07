/**
 * DocumentRequest Model
 * Tracks requests for documents/certificates
 */

const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  requestNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  requestType: {
    type: String,
    required: true,
    enum: ['DUPLICATE', 'ADDITIONAL_COPY', 'AMENDMENT', 'VERIFICATION', 'TRANSCRIPT', 'CHARACTER_REFERENCE'],
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'requestedByType',
    required: true,
  },
  requestedByType: {
    type: String,
    required: true,
    enum: ['Student', 'Parent', 'User'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'DIPLOMA', 'MARKSHEET', 'CONDUCT_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'PROVISIONAL_CERTIFICATE', 'CUSTOM'],
  },
  originalDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentIssued',
  },
  purpose: {
    type: String,
    trim: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  requiredByDate: {
    type: Date,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  numberOfCopies: {
    type: Number,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'PROCESSING', 'READY', 'DISPATCHED', 'DELIVERED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING',
  },
  amendmentDetails: {
    originalData: {},
    amendedData: {},
    reason: String,
    approvalRequired: Boolean,
  },
  processingDetails: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    startDate: Date,
    expectedCompletionDate: Date,
    actualCompletionDate: Date,
    comments: String,
  },
  deliveryDetails: {
    mode: {
      type: String,
      enum: ['DIRECT_COLLECTION', 'COURIER', 'EMAIL', 'POSTAL'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    courierDetails: {
      name: String,
      trackingNumber: String,
      estimatedDeliveryDate: Date,
      actualDeliveryDate: Date,
    },
    recipientDetails: {
      name: String,
      phone: String,
      email: String,
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deliveryDate: Date,
    recipientSignature: String, // URL or base64
    acknowledgmentReceived: Boolean,
  },
  charges: {
    processingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    courierCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'PARTIAL', 'WAIVED'],
      default: 'PENDING',
    },
    paymentMode: String,
    transactionId: String,
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: Date,
  }],
  auditLog: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedDate: Date,
    remarks: String,
  }],
  isUrgent: {
    type: Boolean,
    default: false,
  },
  remarks: {
    type: String,
    trim: true,
  },
  rejectionReason: {
    type: String,
    trim: true,
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
documentRequestSchema.index({ schoolId: 1, requestNumber: 1 }, { unique: true });
documentRequestSchema.index({ schoolId: 1, student: 1 });
documentRequestSchema.index({ schoolId: 1, status: 1 });
documentRequestSchema.index({ schoolId: 1, requestType: 1 });
documentRequestSchema.index({ requestDate: 1 });
documentRequestSchema.index({ requiredByDate: 1 });

// Pre-save middleware to calculate total charges
documentRequestSchema.pre('save', function(next) {
  if (this.charges) {
    this.charges.total = (this.charges.processingFee || 0) + (this.charges.courierCharge || 0);
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('DocumentRequest', documentRequestSchema);
