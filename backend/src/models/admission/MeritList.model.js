const mongoose = require('mongoose');

const meritListSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    meritListCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: ML-{year}-{5-digit-count}'
    },
    admissionCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionCycle',
      required: true,
      index: true
    },
    meritListName: {
      type: String,
      required: true,
      trim: true
    },
    meritListType: {
      type: String,
      enum: ['OVERALL', 'CATEGORY_WISE', 'CLASS_WISE', 'TEST_BASED', 'INTERVIEW_BASED'],
      default: 'OVERALL',
      index: true
    },
    forClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },
    forCategory: {
      type: String,
      enum: ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITY', 'PWD', 'ALL'],
      default: 'ALL'
    },
    publishedDate: {
      type: Date,
      default: Date.now
    },
    publishedBy: mongoose.Schema.Types.ObjectId,
    listReleaseDate: Date,
    responseDeadline: Date,
    admissionDeadline: Date,
    applicationsConsidered: Number,
    applicationsShortlisted: Number,
    applicationsRejected: Number,
    candidates: [
      {
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Application',
          required: true
        },
        applicantName: {
          type: String,
          required: true
        },
        rollNumber: String,
        meritRank: {
          type: Number,
          required: true,
          index: true
        },
        categoryRank: Number,
        classRank: Number,
        totalMarks: Number,
        percentage: Number,
        score: Number,
        testMarks: Number,
        interviewMarks: Number,
        category: String,
        gender: String,
        appliedClass: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        },
        allottedClass: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        },
        allottedCategory: String,
        allottedSeatType: {
          type: String,
          enum: ['MERIT_BASED', 'RESERVED_OBC', 'RESERVED_SC', 'RESERVED_ST', 'RESERVED_MINORITY', 'RESERVED_PWD', 'MANAGEMENT_QUOTA']
        },
        status: {
          type: String,
          enum: ['SHORTLISTED', 'REJECTED', 'WAITLISTED', 'OFFERED', 'ACCEPTED', 'DECLINED', 'ADMITTED'],
          default: 'SHORTLISTED'
        },
        counsellingDate: Date,
        admissionOfferDate: Date,
        admissionOfferAcceptanceDeadline: Date,
        acceptedDate: Date,
        declinedDate: Date,
        admittedDate: Date,
        admissionStatus: {
          type: String,
          enum: ['PENDING', 'OFFERED', 'ACCEPTED', 'DECLINED', 'ADMITTED', 'REJECTED'],
          default: 'PENDING'
        },
        remarks: String
      }
    ],
    meritCriteria: {
      weightage: {
        academicMarks: {
          type: Number,
          default: 50,
          comment: 'Percentage'
        },
        testMarks: {
          type: Number,
          default: 30,
          comment: 'Percentage'
        },
        interviewMarks: {
          type: Number,
          default: 20,
          comment: 'Percentage'
        }
      },
      cutoffMarks: Number,
      tieBreaker: {
        type: String,
        enum: ['HIGHER_TEST_MARKS', 'GENDER_BASED', 'OLDER_FIRST', 'APPLICATION_DATE'],
        default: 'HIGHER_TEST_MARKS'
      }
    },
    reservationPolicy: {
      obcReservation: Number,
      scReservation: Number,
      stReservation: Number,
      minorityReservation: Number,
      pwdReservation: Number
    },
    roundNumber: {
      type: Number,
      default: 1,
      comment: 'Round 1, 2, 3, etc. for multiple merit lists'
    },
    isProvisional: {
      type: Boolean,
      default: true,
      comment: 'Final or Provisional list'
    },
    isFinal: {
      type: Boolean,
      default: false
    },
    finalizedDate: Date,
      finalizedBy: mongoose.Schema.Types.ObjectId,
    appealPeriodOpen: {
      type: Boolean,
      default: true
    },
    appealDeadline: Date,
    appealsReceived: Number,
    appealsApproved: Number,
    appealsRejected: Number,
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'APPEAL_OPEN', 'FINAL', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    statistics: {
      totalCandidates: Number,
      totalOffered: Number,
      totalAccepted: Number,
      totalDeclined: Number,
      totalAdmitted: Number,
      acceptanceRate: Number,
      admissionRate: Number
    },
    generatedFrom: {
      generationDate: Date,
      generationMethod: String,
      generatedBy: mongoose.Schema.Types.ObjectId,
      filters: mongoose.Schema.Types.Mixed
    },
    attachments: [
      {
        attachmentType: String,
        fileURL: String,
        fileName: String,
        uploadedDate: Date
      }
    ],
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
    collection: 'merit_lists'
  }
);

// Indexes for multi-tenancy queries
meritListSchema.index({ schoolId: 1, status: 1 });
meritListSchema.index({ schoolId: 1, admissionCycleId: 1 });
meritListSchema.index({ schoolId: 1, meritListType: 1, forClass: 1 });
meritListSchema.index({ schoolId: 1, publishedDate: 1 });

// Pre-save middleware for code generation
meritListSchema.pre('save', async function (next) {
  if (!this.meritListCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('MeritList').countDocuments({
      schoolId: this.schoolId
    });
    this.meritListCode = `ML-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('MeritList', meritListSchema);
