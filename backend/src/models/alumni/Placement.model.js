const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    // Multi-tenancy: Always required
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolInfo',
      required: true
    },

    // Foreign keys
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },

    // Unique identifier
    placementCode: {
      type: String,
      required: true,
      unique: true
    },

    // Placement details
    placementYear: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['PLACED', 'NOT_PLACED', 'PURSUING_FURTHER_STUDIES', 'SELF_EMPLOYED', 'UNKNOWN'],
      default: 'UNKNOWN'
    },

    // Company details
    company: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      industry: {
        type: String,
        enum: [
          'IT',
          'FINANCE',
          'HEALTHCARE',
          'EDUCATION',
          'MANUFACTURING',
          'RETAIL',
          'TELECOMMUNICATIONS',
          'ENERGY',
          'GOVERNMENT',
          'NGO',
          'STARTUP',
          'LOGISTICS',
          'REAL_ESTATE',
          'HOSPITALITY',
          'AGRICULTURE',
          'OTHER'
        ]
      },
      location: {
        city: String,
        state: String,
        country: String
      }
    },

    // Job details
    position: {
      type: String,
      required: true,
      trim: true
    },

    jobType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'PROJECT_BASED'],
      default: 'FULL_TIME'
    },

    salary: {
      amount: Number,
      currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR', 'GBP', 'OTHER'],
        default: 'INR'
      },
      frequency: {
        type: String,
        enum: ['ANNUAL', 'MONTHLY', 'HOURLY'],
        default: 'ANNUAL'
      }
    },

    // Employment dates
    joiningDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    // Employment period details
    duration: {
      // Calculated in months
      type: Number
    },

    // Classification
    placementType: {
      type: String,
      enum: ['ON_CAMPUS', 'OFF_CAMPUS', 'DIRECT_PLACEMENT', 'POOL_CAMPUS'],
      default: 'OFF_CAMPUS'
    },

    // Career progression tracking
    isCurrentJob: {
      type: Boolean,
      default: true
    },

    // Performance and feedback
    performanceRating: {
      type: Number,
      min: 1,
      max: 5
    },

    companyFeedback: {
      type: String,
      trim: true
    },

    // Skills utilized
    skillsUtilized: [
      {
        skill: String,
        proficiency: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
        }
      }
    ],

    // Job responsibilities
    responsibilities: [String],

    // Promotion history
    promotions: [
      {
        newPosition: String,
        promotionDate: Date,
        salary: Number
      }
    ],

    // Reason for job change (if not current)
    reasonForChange: {
      type: String,
      enum: [
        'CAREER_GROWTH',
        'BETTER_SALARY',
        'RELOCATION',
        'COMPANY_CLOSURE',
        'WORK_ENVIRONMENT',
        'FURTHER_STUDIES',
        'PERSONAL_REASONS',
        'OTHER'
      ]
    },

    // Contact at company (for recruitment referrals)
    referralContact: {
      name: String,
      designation: String,
      email: String,
      phone: String
    },

    // Placement officer details (who facilitated)
    placedByOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false
    },

    verificationDetails: {
      verifiedBy: mongoose.Schema.Types.ObjectId,
      verificationDate: Date,
      verificationMethod: String,
      certificate: String
    },

    // Documents
    offerLetter: {
      fileName: String,
      fileUrl: String,
      uploadDate: Date
    },

    appointmentLetter: {
      fileName: String,
      fileUrl: String,
      uploadDate: Date
    },

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
placementSchema.index({ schoolId: 1, status: 1 });
placementSchema.index({ placementCode: 1 }, { unique: true });
placementSchema.index({ alumniId: 1, schoolId: 1 });
placementSchema.index({ studentId: 1, schoolId: 1 });
placementSchema.index({ placementYear: 1, schoolId: 1 });
placementSchema.index({ 'company.industry': 1, schoolId: 1 });
placementSchema.index({ joiningDate: 1, schoolId: 1 });
placementSchema.index({ status: 1, isCurrentJob: 1, schoolId: 1 });

// Virtual for calculating employment duration
placementSchema.virtual('employmentMonths').get(function () {
  if (!this.joiningDate) return 0;
  const end = this.endDate || new Date();
  const months =
    (end.getFullYear() - this.joiningDate.getFullYear()) * 12 +
    (end.getMonth() - this.joiningDate.getMonth());
  return Math.max(0, months);
});

// Pre-save middleware
placementSchema.pre('save', async function (next) {
  // Auto-generate placementCode if not provided
  if (!this.placementCode) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Placement').countDocuments({
      schoolId: this.schoolId,
      placementYear: this.placementYear
    });
    this.placementCode = `PLM-${this.placementYear}-${String(count + 1).padStart(5, '0')}`;
  }

  // Calculate duration in months
  if (this.joiningDate) {
    const end = this.endDate || new Date();
    this.duration =
      (end.getFullYear() - this.joiningDate.getFullYear()) * 12 +
      (end.getMonth() - this.joiningDate.getMonth());
  }

  next();
});

module.exports = mongoose.model('Placement', placementSchema);
