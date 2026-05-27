/**
 * User Model
 * Core user document schema for all system users
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Core Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    bloodGroup: {
      type: String,
      required: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Role and Organization
    role: {
      type: String,
      enum: [
        'ADMIN',
        'PRINCIPAL',
        'VICE_PRINCIPAL',
        'TEACHER',
        'STUDENT',
        'PARENT',
        'LIBRARIAN',
        'ACCOUNTANT',
        'TRANSPORT_MANAGER',
        'HOSTEL_MANAGER',
        'HR_MANAGER',
      ],
      required: [true, 'Role is required'],
    },
    schoolId: {
      type: String,
      required: [true, 'School ID is required'],
    },

    // Status and Verification
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    phoneVerificationToken: String,

    // Authentication
    lastLogin: Date,
    lastPasswordChange: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // MFA
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: String,
    backupCodes: [String],

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    discriminatorKey: 'userType', // For model inheritance
  }
);

// Indexes
userSchema.index({ schoolId: 1, email: 1 });
userSchema.index({ schoolId: 1, role: 1 });
userSchema.index({ schoolId: 1, status: 1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Methods
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
};

userSchema.methods.incLoginAttempts = function () {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.resetLoginAttempts();
  }

  // Increment login attempts
  this.loginAttempts += 1;

  // Lock account after 5 attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts >= maxAttempts) {
    this.lockUntil = new Date(Date.now() + lockTime);
  }

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
