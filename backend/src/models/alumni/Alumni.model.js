const mongoose = require('mongoose');
const { generateCode } = require('../../utils/codeGenerator');

const alumniSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    firstName: {
      type: String,
      required: true,
      max: 100
    },
    lastName: {
      type: String,
      required: true,
      max: 100
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/
    },
    phoneNumber: {
      type: String,
      max: 20
    },
    alternatePhone: {
      type: String,
      max: 20
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER']
    },
    currentAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    highestQualification: {
      type: String,
      enum: ['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'],
      max: 100
    },
    collegeName: {
      type: String,
      max: 200
    },
    graduationYear: Number,
    classYear: {
      type: String,
      required: true
    },
    currentCompany: {
      type: String,
      max: 200
    },
    currentDesignation: {
      type: String,
      max: 100
    },
    industry: {
      type: String,
      enum: ['TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'ENGINEERING', 'BUSINESS', 'GOVERNMENT', 'SELF_EMPLOYED', 'STUDENT', 'RETIRED', 'OTHER'],
      max: 100
    },
    linkedInProfile: String,
    achievements: [
      {
        title: String,
        description: String,
        date: Date,
        category: {
          type: String,
          enum: ['AWARD', 'PROMOTION', 'CERTIFICATION', 'PUBLICATION', 'OTHER']
        }
      }
    ],
    profileImageUrl: String,
    bio: {
      type: String,
      max: 1000
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DECEASED', 'UNVERIFIED'],
      default: 'UNVERIFIED'
    },
    lastLoginDate: Date,
    subscribedToNewsletter: {
      type: Boolean,
      default: false
    },
    interests: [String],
    socials: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String
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
alumniSchema.index({ schoolId, status: 1 });
alumniSchema.index({ schoolId, classYear: 1 });
alumniSchema.index({ schoolId, email: 1 });
alumniSchema.index({ schoolId, currentCompany: 1 });

// Virtual for full name
alumniSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware: Generate code
alumniSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('ALM', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Alumni', alumniSchema);
