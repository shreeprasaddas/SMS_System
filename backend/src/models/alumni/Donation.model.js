const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Foreign key
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },

    // Unique identifier
    donationCode: {
      type: String,
      required: true,
      unique: true
    },

    // Donor details (can be non-alumni as well)
    donorName: {
      type: String,
      required: true,
      trim: true
    },

    donorEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    donorPhone: {
      type: String,
      trim: true
    },

    // Donation details
    donationAmount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'OTHER'],
      default: 'INR'
    },

    donationDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    // Donation method
    donationType: {
      type: String,
      enum: ['CASH', 'CHECK', 'ONLINE', 'BANK_TRANSFER', 'CARD', 'CRYPTOCURRENCY', 'IN_KIND'],
      required: true
    },

    // Payment gateway details
    paymentGateway: {
      gatewayName: String,
      transactionId: String,
      transactionDate: Date
    },

    // Check details (if applicable)
    checkDetails: {
      checkNumber: String,
      bankName: String,
      chequeDate: Date
    },

    // Bank transfer details (if applicable)
    bankTransferDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      transactionReference: String,
      transferDate: Date
    },

    // In-kind donation details
    inKindDetails: {
      itemDescription: String,
      itemValue: Number,
      itemCondition: {
        type: String,
        enum: ['NEW', 'GOOD', 'FAIR', 'USED']
      },
      itemCategory: {
        type: String,
        enum: [
          'BOOKS',
          'SPORTS_EQUIPMENT',
          'LABORATORY_EQUIPMENT',
          'COMPUTERS',
          'FURNITURE',
          'PLAYGROUND_EQUIPMENT',
          'MUSICAL_INSTRUMENTS',
          'MEDICAL_EQUIPMENT',
          'OTHER'
        ]
      }
    },

    // Purpose of donation
    donationPurpose: {
      type: String,
      enum: [
        'SCHOLARSHIP',
        'INFRASTRUCTURE',
        'SPORTS',
        'LIBRARY',
        'LABORATORY',
        'TECHNOLOGY',
        'HEALTHCARE',
        'EVENTS',
        'RESEARCH',
        'GENERAL_FUND',
        'DISASTER_RELIEF',
        'STUDENT_WELFARE',
        'TEACHER_WELFARE',
        'OTHER'
      ],
      required: true
    },

    purposeDescription: {
      type: String,
      trim: true
    },

    // Specific beneficiary (if applicable)
    donatedFor: {
      studentId: mongoose.Schema.Types.ObjectId,
      projectName: String,
      departmentName: String
    },

    // Donation visibility
    isAnonymous: {
      type: Boolean,
      default: false
    },

    // Public recognition
    allowPublicRecognition: {
      type: Boolean,
      default: true
    },

    // Tax details
    taxReceiptRequired: {
      type: Boolean,
      default: false
    },

    taxReceiptDetails: {
      receiptNumber: String,
      receiptAmount: Number,
      receiptDate: Date,
      receiptFile: String,
      issuedBy: mongoose.Schema.Types.ObjectId
    },

    // Donation status
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'RECEIVED', 'ACKNOWLEDGED', 'UTILIZED', 'CANCELLED', 'REFUNDED'],
      default: 'PENDING'
    },

    // Verification details
    verificationDetails: {
      verifiedBy: mongoose.Schema.Types.ObjectId,
      verificationDate: Date,
      verificationNotes: String
    },

    // Acknowledgment
    acknowledgmentSent: {
      type: Boolean,
      default: false
    },

    acknowledgmentDate: Date,

    acknowledgmentMethod: {
      type: String,
      enum: ['EMAIL', 'LETTER', 'PHONE', 'SMS', 'PERSONAL_VISIT'],
      default: 'EMAIL'
    },

    // Documentation
    donationDocuments: [
      {
        documentName: String,
        documentType: {
          type: String,
          enum: ['OFFER_LETTER', 'RECEIPT', 'CERTIFICATE', 'PROOF_OF_PAYMENT', 'OTHER']
        },
        fileUrl: String,
        uploadDate: Date
      }
    ],

    // Certificate
    certificateOfAppreciation: {
      issued: {
        type: Boolean,
        default: false
      },
      certificateNumber: String,
      certificateDate: Date,
      certificateFile: String
    },

    // Impact tracking
    impactStatement: {
      statement: String,
      impactDate: Date,
      beneficiariesCount: Number,
      outcomes: [String]
    },

    // Recurring donation
    isRecurringDonation: {
      type: Boolean,
      default: false
    },

    recurringDetails: {
      frequency: {
        type: String,
        enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']
      },
      totalDonationsPlanned: Number,
      donationsCompleted: {
        type: Number,
        default: 0
      },
      nextDonationDate: Date,
      endDate: Date
    },

    // Donation campaign
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationCampaign'
    },

    // Notes and comments
    internalNotes: String,

    // Audit trail
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

// Indexes for frequently queried fields
donationSchema.index({ schoolId: 1, status: 1 });
donationSchema.index({ donationCode: 1 }, { unique: true });
donationSchema.index({ alumniId: 1, schoolId: 1 });
donationSchema.index({ donationDate: 1, schoolId: 1 });
donationSchema.index({ donationPurpose: 1, schoolId: 1 });
donationSchema.index({ status: 1, donationDate: 1, schoolId: 1 });
donationSchema.index({ isRecurringDonation: 1, schoolId: 1 });

// Virtual for total donation value (including recurring)
donationSchema.virtual('totalDonationValue').get(function () {
  if (!this.isRecurringDonation) {
    return this.donationAmount;
  }
  return this.donationAmount * this.recurringDetails.donationsCompleted;
});

// Pre-save middleware
donationSchema.pre('save', async function (next) {
  // Auto-generate donationCode if not provided
  if (!this.donationCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Donation').countDocuments({
      schoolId: this.schoolId
    });
    this.donationCode = `DON-${currentYear}-${String(count + 1).padStart(5, '0')}`;
  }

  // Set nextDonationDate for recurring donations
  if (this.isRecurringDonation && this.recurringDetails && !this.recurringDetails.nextDonationDate) {
    const nextDate = new Date(this.donationDate);
    switch (this.recurringDetails.frequency) {
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'SEMI_ANNUAL':
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case 'ANNUAL':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    this.recurringDetails.nextDonationDate = nextDate;
  }

  next();
});

module.exports = mongoose.model('Donation', donationSchema);
