const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    applicationCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: APP-{year}-{5-digit-count}'
    },
    admissionCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionCycle',
      required: true,
      index: true
    },
    applicationFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicationForm',
      required: true
    },
    applicantName: {
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      middleName: String,
      lastName: {
        type: String,
        required: true,
        trim: true
      }
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: true
    },
    category: {
      type: String,
      enum: ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD'],
      default: 'GENERAL',
      index: true
    },
    contactInformation: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      phone: {
        type: String,
        required: true
      },
      alternatePhone: String,
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      }
    },
    parentInformation: {
      fatherName: String,
      fatherOccupation: String,
      fatherPhone: String,
      motherName: String,
      motherOccupation: String,
      motherPhone: String,
      parentEmail: String,
      parentAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      }
    },
    academicInformation: {
      previousSchool: String,
      previousSchoolBoard: String,
      lastClassMarks: Number,
      lastClassPercentage: Number,
      lastClassGrade: String,
      qualifyingExam: String,
      qualifyingExamMarks: Number,
      qualifyingExamPercentage: Number,
      qualifyingExamRank: String
    },
    appliedClasses: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class',
          required: true
        },
        priority: {
          type: Number,
          enum: [1, 2, 3, 4, 5],
          comment: '1 = First choice, 5 = Last choice'
        },
        category: String,
        seatType: {
          type: String,
          enum: ['MERIT_BASED', 'RESERVED_OBC', 'RESERVED_SC', 'RESERVED_ST', 'RESERVED_MINORITY', 'RESERVED_PWD', 'MANAGEMENT_QUOTA']
        }
      }
    ],
    formDataSubmitted: mongoose.Schema.Types.Mixed,
    applicationDate: {
      type: Date,
      default: Date.now
    },
    applicationStatus: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN', 'ADMITTED'],
      default: 'DRAFT',
      index: true
    },
    applicationNotes: String,
    testRollNumber: String,
    testMarksObtained: Number,
    testDate: Date,
    meritRank: {
      type: Number,
      comment: 'Overall merit rank'
    },
    categoryRank: {
      type: Number,
      comment: 'Category-wise merit rank'
    },
    allottedClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },
    allottedCategory: String,
    admissionLetterGenerated: {
      type: Boolean,
      default: false
    },
    admissionLetterURL: String,
    admissionConfirmed: {
      type: Boolean,
      default: false
    },
    admissionConfirmedDate: Date,
    confirmationDetails: {
      feePaid: Boolean,
      feePaidDate: Date,
      feeReceiptNumber: String,
      uniformCollected: Boolean,
      documentsSubmitted: Boolean,
      onboardingCompleted: Boolean
    },
    rejectionReason: String,
    withdrawalReason: String,
    withdrawalDate: Date,
    appliedWith: {
      fatherName: String,
      motherName: String,
      email: String,
      phone: String
    },
    documents: [
      {
        documentType: String,
        fileName: String,
        fileURL: String,
        uploadedDate: Date,
        verificationStatus: {
          type: String,
          enum: ['PENDING', 'VERIFIED', 'REJECTED'],
          default: 'PENDING'
        }
      }
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE'
    },
    remarks: String,
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        changes: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: 'applications'
  }
);

// Indexes for multi-tenancy queries
applicationSchema.index({ schoolId: 1, applicationStatus: 1 });
applicationSchema.index({ schoolId: 1, admissionCycleId: 1 });
applicationSchema.index({ schoolId: 1, category: 1, applicationStatus: 1 });
applicationSchema.index({ schoolId: 1, applicationDate: 1 });
applicationSchema.index({ admissionCycleId: 1, meritRank: 1 });

// Pre-save middleware for code generation
applicationSchema.pre('save', async function (next) {
  if (!this.applicationCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments({
      schoolId: this.schoolId
    });
    this.applicationCode = `APP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
