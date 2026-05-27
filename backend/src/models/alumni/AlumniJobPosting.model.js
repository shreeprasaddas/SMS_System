const mongoose = require('mongoose');
const { generateCode } = require('../../utils/codeGenerator');

const alumniJobPostingSchema = new mongoose.Schema(
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
    postedByAlumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
      required: true
    },
    jobTitle: {
      type: String,
      required: true,
      max: 200
    },
    company: {
      type: String,
      required: true,
      max: 200
    },
    jobDescription: {
      type: String,
      required: true,
      max: 5000
    },
    requiredQualifications: [String],
    preferredQualifications: [String],
    experienceLevel: {
      type: String,
      enum: ['FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'EXECUTIVE'],
      required: true
    },
    yearsOfExperienceRequired: {
      min: Number,
      max: Number
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'OTHER'],
      required: true
    },
    jobCategory: {
      type: String,
      enum: ['TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'ENGINEERING', 'SALES', 'MARKETING', 'HR', 'OPERATIONS', 'OTHER'],
      required: true
    },
    location: {
      city: String,
      state: String,
      country: String,
      isRemote: {
        type: Boolean,
        default: false
      }
    },
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR', 'GBP'],
        default: 'INR'
      },
      isPublic: {
        type: Boolean,
        default: false
      }
    },
    benefits: [String],
    skills: [String],
    applicationDeadline: {
      type: Date,
      required: true
    },
    applyLink: String,
    contactEmail: String,
    contactPhone: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'CLOSED', 'FILLED', 'EXPIRED'],
      default: 'ACTIVE'
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    totalShortlisted: {
      type: Number,
      default: 0
    },
    applicants: [
      {
        studentId: mongoose.Schema.Types.ObjectId,
        applicationDate: Date,
        applicationStatus: {
          type: String,
          enum: ['APPLIED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'SELECTED']
        },
        resume: String,
        coverLetter: String
      }
    ],
    postingDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    lastModifiedDate: Date,
    isVerified: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
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
alumniJobPostingSchema.index({ schoolId: 1, status: 1 });
alumniJobPostingSchema.index({ schoolId: 1, postedByAlumniId: 1 });
alumniJobPostingSchema.index({ schoolId: 1, jobCategory: 1 });
alumniJobPostingSchema.index({ schoolId: 1, applicationDeadline: 1 });

// Virtual for salary display
alumniJobPostingSchema.virtual('salaryDisplay').get(function () {
  if (!this.salaryRange || (!this.salaryRange.min && !this.salaryRange.max)) {
    return 'Not specified';
  }
  return `${this.salaryRange.currency} ${this.salaryRange.min || 0} - ${this.salaryRange.max || 'Negotiable'}`;
});

// Virtual for application count
alumniJobPostingSchema.virtual('applicationCount').get(function () {
  if (!this.applicants) return 0;
  return this.applicants.length;
});

// Pre-save middleware: Generate code
alumniJobPostingSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('JOP', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('AlumniJobPosting', alumniJobPostingSchema);
