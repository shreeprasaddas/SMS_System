const mongoose = require('mongoose');

const trainingProviderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      indexed: true,
    },
    providerName: {
      type: String,
      required: true,
      indexed: true,
    },
    providerType: {
      type: String,
      enum: ['GOVERNMENT_AGENCY', 'PRIVATE_INSTITUTION', 'NGO', 'UNIVERSITY', 'ONLINE_PLATFORM', 'CONSULTANT', 'PROFESSIONAL_BODY', 'INTERNAL'],
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    contactDetails: {
      primaryContactPerson: {
        name: String,
        designation: String,
        email: String,
        phone: String,
      },
      secondaryContactPerson: {
        name: String,
        designation: String,
        email: String,
        phone: String,
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      website: String,
      socialMediaLinks: [String],
    },
    specializations: {
      type: [String],
      enum: ['SUBJECT_EXPERTISE', 'PEDAGOGICAL_SKILLS', 'TECHNOLOGY', 'LEADERSHIP', 'SOFT_SKILLS', 'HEALTH_SAFETY', 'COMPLIANCE', 'LANGUAGE', 'ARTS', 'SPORTS'],
    },
    certifications: {
      isGovernmentRecognized: Boolean,
      governmentAffiliation: String,
      accreditationBodies: [String],
      accreditationCertificateUrl: String,
      accreditationExpiryDate: Date,
    },
    experienceDetails: {
      yearsInBusiness: Number,
      totalTrainingsConducted: {
        type: Number,
        default: 0,
      },
      totalParticipantsTrainedGlobally: {
        type: Number,
        default: 0,
      },
      industriesServed: [String],
    },
    coursesCatalog: [
      {
        courseId: String,
        courseName: String,
        courseType: String,
        description: String,
        duration: String,
        targetAudience: [String],
        costPerParticipant: Number,
        minParticipants: Number,
        maxParticipants: Number,
        courseOutline: [String],
        certificationProvided: Boolean,
      },
    ],
    facilitators: [
      {
        facilitatorId: String,
        facilitatorName: String,
        qualification: String,
        expertise: [String],
        yearsOfExperience: Number,
        previousTrainings: Number,
      },
    ],
    pricing: {
      baseCostPerParticipant: Number,
      bulkDiscountPercentage: Number,
      discountMinimumParticipants: Number,
      travelExpenseCoverage: {
        type: String,
        enum: ['PROVIDER_COVERS', 'SCHOOL_COVERS', 'SHARED', 'NOT_APPLICABLE'],
      },
      accommodationProvided: Boolean,
      materialsCostIncluded: Boolean,
      certificateCostIncluded: Boolean,
    },
    paymentTerms: {
      paymentMethod: [String],
      advancePercentageRequired: {
        type: Number,
        min: 0,
        max: 100,
      },
      paymentSchedule: String,
      invoiceFormat: String,
      bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String,
      },
    },
    trainingHistory: [
      {
        trainingConductedDate: Date,
        trainingName: String,
        participantCount: Number,
        participantList: [String],
        feedbackScore: Number,
        completionStatus: String,
        certificatesIssued: Number,
      },
    ],
    performanceRating: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
      },
      totalRatings: Number,
      feedbackComments: [
        {
          raterName: String,
          rating: Number,
          comment: String,
          date: Date,
        },
      ],
      qualityScore: String,
    },
    compliance: {
      insuranceProvided: Boolean,
      insuranceCertificateUrl: String,
      insuranceExpiryDate: Date,
      backgroundCheckCompleted: Boolean,
      backgroundCheckDate: Date,
      backgroundCheckResult: String,
      gdprCompliant: Boolean,
      dataProtectionPolicy: String,
    },
    partnershipStatus: {
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED'],
        indexed: true,
      },
      partnershipStartDate: Date,
      partnershipEndDate: Date,
      renewalDate: Date,
      renewalRequired: Boolean,
      reasonForInactivity: String,
    },
    documents: [
      {
        documentName: String,
        documentType: {
          type: String,
          enum: ['CERTIFICATE', 'AGREEMENT', 'ACCREDITATION', 'INSURANCE', 'PROPOSAL', 'FEEDBACK_FORM'],
        },
        documentUrl: String,
        uploadDate: Date,
        expiryDate: Date,
      },
    ],
    supportOffered: {
      onlineSupport: Boolean,
      offlineSessions: Boolean,
      hybridOptions: Boolean,
      postTrainingSupport: Boolean,
      supportDuration: String,
      documentationProvided: Boolean,
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

trainingProviderSchema.index({ schoolId: 1, providerType: 1 });
trainingProviderSchema.index({ schoolId: 1, 'partnershipStatus.status': 1 });
trainingProviderSchema.index({ code: 1, schoolId: 1 });

trainingProviderSchema.virtual('partnershipYears').get(function () {
  if (this.partnershipStatus.partnershipStartDate) {
    return Math.floor((Date.now() - this.partnershipStatus.partnershipStartDate) / (1000 * 60 * 60 * 24 * 365));
  }
  return 0;
});

trainingProviderSchema.virtual('isAccreditated').get(function () {
  if (!this.certifications.accreditationBodies || this.certifications.accreditationBodies.length === 0) {
    return false;
  }
  if (this.certifications.accreditationExpiryDate) {
    return this.certifications.accreditationExpiryDate > Date.now();
  }
  return true;
});

trainingProviderSchema.virtual('providerReliability').get(function () {
  if (this.performanceRating.averageRating >= 4.5) return 'HIGHLY_RELIABLE';
  if (this.performanceRating.averageRating >= 4.0) return 'RELIABLE';
  if (this.performanceRating.averageRating >= 3.0) return 'ACCEPTABLE';
  return 'NEEDS_IMPROVEMENT';
});

trainingProviderSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('TrainingProvider').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `TP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('TrainingProvider', trainingProviderSchema);
