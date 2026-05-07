const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    motto: String,
    establishedYear: Number,
    schoolType: {
      type: String,
      enum: ['PRIMARY', 'SECONDARY', 'SENIOR_SECONDARY', 'SENIOR_SECONDARY_WITH_VOCATIONAL', 'KINDERGARTEN', 'PRE_PRIMARY'],
      required: true,
    },
    affiliation: {
      board: {
        type: String,
        enum: ['CBSE', 'ICSE', 'STATE', 'ISC', 'IB', 'IGCSE', 'CUSTOM'],
        required: true,
      },
      affiliationNumber: String,
      affiliationDate: Date,
    },
    contactDetails: {
      principalName: String,
      principalPhone: String,
      principalEmail: String,
      adminPhone: String,
      adminEmail: String,
      website: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    infrastructure: {
      classroomsCount: Number,
      labsCount: Number,
      libraryPresent: Boolean,
      auditoriumPresent: Boolean,
      sportsFacilities: [String],
      computerLabsCount: Number,
      scienceLabsCount: Number,
    },
    operationalDetails: {
      academicYear: String,
      established: Date,
      recognition: {
        recognized: Boolean,
        recognitionNumber: String,
        recognitionDate: Date,
      },
    },
    academicSettings: {
      workingDays: {
        type: Number,
        default: 240,
      },
      sessionStart: Date,
      sessionEnd: Date,
      classesOffered: {
        type: [String],
        default: [],
      },
    },
    admissionSettings: {
      academicYearPattern: {
        type: String,
        enum: ['JANUARY_DECEMBER', 'APRIL_MARCH', 'JUNE_MAY'],
        default: 'APRIL_MARCH',
      },
      admissionStartDate: Date,
      admissionEndDate: Date,
      classesToOffer: [String],
    },
    staffConfiguration: {
      totalTeachers: Number,
      totalAdminStaff: Number,
      totalNonTeachingStaff: Number,
      deskCount: Number,
    },
    feesConfiguration: {
      currency: {
        type: String,
        default: 'INR',
      },
      feeStructure: [
        {
          className: String,
          feeCategory: String,
          amount: Number,
        },
      ],
      paymentMethods: [
        {
          method: {
            type: String,
            enum: ['CASH', 'CHECK', 'BANK_TRANSFER', 'ONLINE', 'RAZORPAY', 'STRIPE'],
          },
          enabled: Boolean,
        },
      ],
    },
    systemSettings: {
      languagePreference: {
        type: String,
        default: 'en',
      },
      timeZone: {
        type: String,
        default: 'Asia/Kolkata',
      },
      dateFormat: {
        type: String,
        default: 'DD/MM/YYYY',
      },
      schoolLogo: String,
      schoolBanner: String,
      reportHeaderLogo: String,
      certificateLogo: String,
      theme: {
        primaryColor: String,
        secondaryColor: String,
      },
    },
    communicationSettings: {
      smsProvider: {
        type: String,
        enum: ['TWILIO', 'AWS_SNS', 'LOCAL_PROVIDER', 'NONE'],
      },
      emailProvider: {
        type: String,
        enum: ['SENDGRID', 'MAILGUN', 'NODEMAILER', 'CUSTOM'],
      },
      enableSMS: Boolean,
      enableEmail: Boolean,
      enableWhatsApp: Boolean,
    },
    biometricSettings: {
      enabled: Boolean,
      provider: {
        type: String,
        enum: ['ICLOCK', 'ZKTECO', 'HIKVISION', 'CUSTOM'],
      },
      deviceLocation: String,
      syncFrequency: String,
    },
    integrations: {
      videoConferencing: {
        enabled: Boolean,
        provider: {
          type: String,
          enum: ['ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS'],
        },
      },
      erp: {
        connected: Boolean,
        provider: String,
        connectionDetails: mongoose.Schema.Types.Mixed,
      },
      paymentGateway: {
        enabled: Boolean,
        provider: {
          type: String,
          enum: ['RAZORPAY', 'STRIPE', 'PAYPAL'],
        },
      },
    },
    subscriptionDetails: {
      plan: {
        type: String,
        enum: ['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'],
        default: 'BASIC',
      },
      subscriptionStartDate: Date,
      subscriptionEndDate: Date,
      maxUsers: Number,
      maxStorage: Number,
      usedStorage: {
        type: Number,
        default: 0,
      },
      features: [String],
      autoRenewal: {
        type: Boolean,
        default: true,
      },
    },
    statistics: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalTeachers: {
        type: Number,
        default: 0,
      },
      totalClasses: {
        type: Number,
        default: 0,
      },
      totalSubjects: {
        type: Number,
        default: 0,
      },
      lastUpdated: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'],
      default: 'ACTIVE',
      indexed: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schoolSchema.index({ code: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ createdAt: -1 });

schoolSchema.virtual('isActive').get(function () {
  return this.status === 'ACTIVE';
});

schoolSchema.virtual('daysToSubscriptionExpiry').get(function () {
  if (!this.subscriptionDetails.subscriptionEndDate) return null;
  const today = new Date();
  const days = Math.floor((this.subscriptionDetails.subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
});

schoolSchema.virtual('storageUsagePercentage').get(function () {
  if (!this.subscriptionDetails.maxStorage) return 0;
  return Math.round((this.subscriptionDetails.usedStorage / this.subscriptionDetails.maxStorage) * 100);
});

schoolSchema.pre('save', async function (next) {
  if (!this.code) {
    const count = await mongoose.model('School').countDocuments();
    this.code = `SCH-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('School', schoolSchema);
