const mongoose = require('mongoose');
const { generateCode } = require('../../utils/codeGenerator');

const alumniDonationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      unique: true,
      sparse: true
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    donationAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR'
    },
    donationType: {
      type: String,
      enum: ['MONETARY', 'MATERIAL', 'SCHOLARSHIP', 'INFRASTRUCTURE', 'TECHNOLOGY', 'OTHER'],
      required: true
    },
    donationCategory: {
      type: String,
      enum: ['ANNUAL_FUND', 'SCHOLARSHIP', 'INFRASTRUCTURE', 'RESEARCH', 'SPORTS', 'EVENTS', 'OTHER'],
      required: true
    },
    description: {
      type: String,
      max: 1000
    },
    purposeOfDonation: {
      type: String,
      max: 500
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE', 'CARD', 'CRYPTOCURRENCY', 'OTHER'],
      required: true
    },
    transactionId: String,
    receiptNumber: String,
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringFrequency: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']
    },
    recurringEndDate: Date,
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donationStatus: {
      type: String,
      enum: ['PENDING', 'RECEIVED', 'PROCESSED', 'ACKNOWLEDGED', 'CANCELLED'],
      default: 'PENDING'
    },
    acknowledgmentDate: Date,
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateUrl: String,
    tax80GEligible: {
      type: Boolean,
      default: false
    },
    taxCertificateIssued: {
      type: Boolean,
      default: false
    },
    taxCertificateUrl: String,
    anonymousDonation: {
      type: Boolean,
      default: false
    },
    displayName: String,
    notes: {
      type: String,
      max: 1000
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now
        },
        changes: mongoose.Schema.Types.Mixed
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for multi-tenancy and filtering
alumniDonationSchema.index({ schoolId: 1, donationStatus: 1 });
alumniDonationSchema.index({ schoolId: 1, alumniId: 1 });
alumniDonationSchema.index({ schoolId: 1, donationDate: 1 });
alumniDonationSchema.index({ schoolId: 1, donationType: 1 });

// Virtual for donation display amount
alumniDonationSchema.virtual('displayAmount').get(function () {
  return `${this.currency} ${this.donationAmount.toFixed(2)}`;
});

// Pre-save middleware: Generate code
alumniDonationSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('ADN', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('AlumniDonation', alumniDonationSchema);
