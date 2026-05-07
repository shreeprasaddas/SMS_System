/**
 * ParentProfile Model
 * Parent account information, student associations, and communication preferences
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const parentProfileSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentType: {
      type: String,
      enum: ['MOTHER', 'FATHER', 'GUARDIAN', 'STEPPARENT', 'OTHER'],
      required: true,
    },
    children: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        relationshipType: {
          type: String,
          enum: ['BIOLOGICAL', 'STEP', 'GUARDIAN', 'ADOPTIVE'],
        },
        enrollmentDate: Date,
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    contactInfo: {
      phoneNumber: {
        type: String,
        required: true,
      },
      alternatePhone: String,
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    workInfo: {
      occupation: String,
      company: String,
      designation: String,
      workPhone: String,
      workEmail: String,
    },
    communicationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      inAppNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      notificationFrequency: {
        type: String,
        enum: ['IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST'],
        default: 'IMMEDIATE',
      },
      preferredLanguage: {
        type: String,
        default: 'en',
      },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
      email: String,
    },
    profilePhoto: {
      url: String,
      fileName: String,
      uploadDate: Date,
    },
    permissions: {
      canViewGrades: {
        type: Boolean,
        default: true,
      },
      canViewAttendance: {
        type: Boolean,
        default: true,
      },
      canViewFees: {
        type: Boolean,
        default: true,
      },
      canCommunicate: {
        type: Boolean,
        default: true,
      },
      canViewEvents: {
        type: Boolean,
        default: true,
      },
      canDownloadReports: {
        type: Boolean,
        default: true,
      },
    },
    activityTracking: {
      lastLoginDate: Date,
      lastLoginIP: String,
      totalLogins: {
        type: Number,
        default: 0,
      },
      lastActivityDate: Date,
    },
    verificationDetails: {
      emailVerified: {
        type: Boolean,
        default: false,
      },
      emailVerificationDate: Date,
      phoneVerified: {
        type: Boolean,
        default: false,
      },
      phoneVerificationDate: Date,
      identityVerified: {
        type: Boolean,
        default: false,
      },
      identityVerificationDate: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DEACTIVATED'],
      default: 'ACTIVE',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
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

// Pre-save middleware for code generation
parentProfileSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('PPROF', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
parentProfileSchema.index({ schoolId, userId: 1 });
parentProfileSchema.index({ schoolId, status: 1 });
parentProfileSchema.index({ code: 1, schoolId: 1 });
parentProfileSchema.index({ 'children.studentId': 1, schoolId: 1 });

// Virtual: Number of children
parentProfileSchema.virtual('numberOfChildren').get(function () {
  return (this.children || []).filter((c) => c.isActive).length;
});

// Virtual: All enrolled students
parentProfileSchema.virtual('enrolledStudents').get(function () {
  return (this.children || []).filter((c) => c.isActive).map((c) => c.studentId);
});

// Virtual: Email preference status
parentProfileSchema.virtual('emailPreferenceStatus').get(function () {
  return this.communicationPreferences?.emailNotifications ? 'ENABLED' : 'DISABLED';
});

// Virtual: Days since last login
parentProfileSchema.virtual('daysSinceLastLogin').get(function () {
  if (!this.activityTracking?.lastLoginDate) return null;
  const now = new Date();
  const timeDiff = now - this.activityTracking.lastLoginDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('ParentProfile', parentProfileSchema);
