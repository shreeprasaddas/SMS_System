const mongoose = require('mongoose');

const libraryMemberSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    membershipType: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'STAFF', 'PARENT'],
      required: true
    },
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    maxBooksAllowed: {
      type: Number,
      required: true,
      min: 1,
      default: 5
    },
    currentBooksIssued: {
      type: Number,
      default: 0,
      min: 0
    },
    totalFineAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    membershipStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'INACTIVE'],
      default: 'ACTIVE',
      index: true
    },
    suspensionReason: String,
    suspensionStartDate: Date,
    suspensionEndDate: Date,
    issueHistory: {
      totalBooksIssued: {
        type: Number,
        default: 0
      },
      totalBooksReturned: {
        type: Number,
        default: 0
      },
      totalBooksOverdue: {
        type: Number,
        default: 0
      },
      totalBooksLost: {
        type: Number,
        default: 0
      }
    },
    registeredByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
libraryMemberSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LibraryMember').countDocuments({ schoolId: this.schoolId });
    this.code = `LIBMEM-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
libraryMemberSchema.index({ schoolId: 1, userId: 1 });
libraryMemberSchema.index({ schoolId: 1, membershipStatus: 1 });
libraryMemberSchema.index({ schoolId: 1, expiryDate: 1 });

module.exports = mongoose.model('LibraryMember', libraryMemberSchema);
