const mongoose = require('mongoose');

const admissionCycleSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    cycleCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      comment: 'Format: ACL-{year}-{5-digit-count}'
    },
    cycleName: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      required: true,
      comment: 'e.g., 2024-2025'
    },
    classesOffering: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class',
          required: true
        },
        totalSeats: {
          type: Number,
          required: true,
          min: 1
        },
        reservedSeatsOBC: {
          type: Number,
          default: 0
        },
        reservedSeatsSC: {
          type: Number,
          default: 0
        },
        reservedSeatsST: {
          type: Number,
          default: 0
        },
        reservedSeatsMinority: {
          type: Number,
          default: 0
        },
        reservedSeatsPWD: {
          type: Number,
          default: 0
        },
        meritBasedSeats: {
          type: Number,
          required: true
        },
        feeAmount: {
          type: Number,
          required: true
        },
        cutoffMarks: {
          type: Number,
          comment: 'Minimum marks for eligibility'
        }
      }
    ],
    eligibilityCriteria: {
      minimumAge: Number,
      maximumAge: Number,
      minimumMarks: Number,
      qualifyingExams: [String],
      boardAffiliation: [String],
      specialRequirements: String
    },
    applicationStartDate: {
      type: Date,
      required: true
    },
    applicationEndDate: {
      type: Date,
      required: true
    },
    documentSubmissionDeadline: Date,
    admissionTestDate: Date,
    meritListPublishDate: Date,
    admissionFeeSubmissionDeadline: Date,
    admissionStartDate: Date,
    admissionEndDate: Date,
    status: {
      type: String,
      enum: ['DRAFT', 'ANNOUNCED', 'ONGOING', 'CLOSED', 'COMPLETED', 'CANCELLED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    description: String,
    admissionMode: {
      type: String,
      enum: ['MERIT_BASED', 'ENTRANCE_TEST', 'MANAGEMENT_QUOTA', 'COMBINED'],
      default: 'MERIT_BASED'
    },
    prospectusURL: String,
    applicationsReceived: {
      type: Number,
      default: 0
    },
    applicationsProcessed: {
      type: Number,
      default: 0
    },
    admissionsGiven: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
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
    collection: 'admission_cycles'
  }
);

// Index for multi-tenancy queries
admissionCycleSchema.index({ schoolId: 1, status: 1 });
admissionCycleSchema.index({ schoolId: 1, academicYear: 1 });
admissionCycleSchema.index({ schoolId: 1, isActive: 1 });

// Pre-save middleware for code generation
admissionCycleSchema.pre('save', async function (next) {
  if (!this.cycleCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('AdmissionCycle').countDocuments({
      schoolId: this.schoolId
    });
    this.cycleCode = `ACL-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('AdmissionCycle', admissionCycleSchema);
