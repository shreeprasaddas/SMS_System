const mongoose = require('mongoose');

const staffCertificationSchema = new mongoose.Schema(
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
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      indexed: true,
    },
    employeeName: String,
    employeeDesignation: String,
    certificationName: {
      type: String,
      required: true,
    },
    certificationType: {
      type: String,
      enum: ['ACADEMIC_DEGREE', 'PROFESSIONAL_CERTIFICATION', 'SKILL_CERTIFICATION', 'LANGUAGE_PROFICIENCY', 'TECHNICAL_CERTIFICATION', 'SOFT_SKILLS', 'SPECIALIZED_TRAINING'],
      required: true,
      indexed: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    issuingBody: {
      type: String,
      required: true,
    },
    issuingCountry: String,
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      indexed: true,
    },
    validityStatus: {
      type: String,
      enum: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'RENEWED'],
      indexed: true,
    },
    certificationDetails: {
      scope: String,
      creditsObtained: Number,
      creditsRequired: Number,
      scorePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      gradeObtained: String,
    },
    verificationDetails: {
      verificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'UNVERIFIED'],
      },
      verificationDate: Date,
      verifiedBy: mongoose.Schema.Types.ObjectId,
      verificationRemarks: String,
      documentProofUrl: String,
    },
    relevanceToRole: {
      relevanceLevel: {
        type: String,
        enum: ['HIGHLY_RELEVANT', 'RELEVANT', 'SOMEWHAT_RELEVANT', 'NOT_RELEVANT'],
      },
      applicableSubjects: [String],
      applicableRoles: [String],
      skills: [String],
    },
    continuingEducation: {
      professionalDevelopmentPoints: Number,
      creditPoints: Number,
      renewalRequired: Boolean,
      renewalFrequency: String,
      nextRenewalDue: Date,
    },
    certificateDocument: {
      documentUrl: String,
      documentName: String,
      uploadDate: Date,
      uploadedBy: mongoose.Schema.Types.ObjectId,
    },
    renewalHistory: [
      {
        renewalDate: Date,
        renewalNumber: String,
        renewalIssuer: String,
        renewalExpiryDate: Date,
      },
    ],
    institutionDetails: {
      institutionName: String,
      institutionWebsite: String,
      institutionContact: String,
      institutionAccreditation: String,
    },
    keyCompetencies: [
      {
        competency: String,
        level: {
          type: String,
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
        },
        applicationDate: Date,
      },
    ],
    careerImpact: {
      salaryIncrementEligible: Boolean,
      promotionEligible: Boolean,
      specialistPositionEligible: Boolean,
      additionalResponsibilities: String,
      mentorshipOpportunities: String,
    },
    recordStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'SUSPENDED'],
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

staffCertificationSchema.index({ schoolId: 1, employeeId: 1 });
staffCertificationSchema.index({ schoolId: 1, certificationType: 1 });
staffCertificationSchema.index({ schoolId: 1, validityStatus: 1 });
staffCertificationSchema.index({ code: 1, schoolId: 1 });

staffCertificationSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  return Math.ceil((this.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
});

staffCertificationSchema.virtual('isExpiringSoon').get(function () {
  const daysLeft = this.daysUntilExpiry;
  if (!daysLeft) return false;
  return daysLeft <= 90 && daysLeft > 0;
});

staffCertificationSchema.virtual('certificationAge').get(function () {
  return Math.floor((Date.now() - this.issueDate) / (1000 * 60 * 60 * 24));
});

staffCertificationSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('StaffCertification').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `CERT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('StaffCertification', staffCertificationSchema);
