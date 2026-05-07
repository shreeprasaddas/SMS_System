const mongoose = require('mongoose');

const employeeTrainingSchema = new mongoose.Schema(
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
    employeeType: {
      type: String,
      enum: ['TEACHER', 'STAFF', 'PRINCIPAL', 'ADMIN'],
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfessionalDevelopmentProgram',
      required: true,
      indexed: true,
    },
    programName: String,
    programType: String,
    programCategory: String,
    enrollmentDate: {
      type: Date,
      required: true,
      indexed: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ['REGISTERED', 'CONFIRMED', 'ATTENDED', 'COMPLETED', 'WITHDRAWN', 'CANCELLED'],
      indexed: true,
    },
    attendance: {
      sessionsAttended: {
        type: Number,
        default: 0,
      },
      totalSessions: {
        type: Number,
        default: 0,
      },
      attendancePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      attendanceRecords: [
        {
          sessionDate: Date,
          present: Boolean,
          remarks: String,
        },
      ],
    },
    performance: {
      assessmentScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      assessmentStatus: {
        type: String,
        enum: ['NOT_ASSESSED', 'PASSED', 'FAILED', 'PENDING'],
      },
      assessmentDate: Date,
      assessmentRemarks: String,
      assignmentSubmitted: Boolean,
      assignmentScore: Number,
      projectSubmitted: Boolean,
      projectScore: Number,
    },
    learningOutcomes: [
      {
        outcome: String,
        achieved: Boolean,
        evidence: String,
      },
    ],
    feedback: {
      employeeFeedback: String,
      employeeRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      facilitorFeedback: String,
      facilitatorRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedbackDate: Date,
    },
    certification: {
      certificateEarned: Boolean,
      certificateNumber: String,
      certificateDate: Date,
      certificateIssuingAuthority: String,
      certificateValidityStart: Date,
      certificateValidityEnd: Date,
    },
    skillsGained: [
      {
        skillName: String,
        proficiencyLevel: {
          type: String,
          enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
        },
      },
    ],
    applicationPlans: [
      {
        skill: String,
        applicationArea: String,
        timeframe: String,
        supportNeeded: String,
      },
    ],
    followUpSupport: {
      coachingRequired: Boolean,
      coachingSchedule: [
        {
          date: Date,
          topic: String,
          coach: String,
          status: String,
        },
      ],
      mentorAssigned: String,
      supportingResources: [String],
    },
    costDetails: {
      costPerParticipant: Number,
      costSharedBySchool: Number,
      costPaidByEmployee: Number,
      paymentStatus: {
        type: String,
        enum: ['PENDING', 'PARTIAL', 'COMPLETED'],
      },
    },
    impactAssessment: {
      assessmentConductedDate: Date,
      classroomApplication: String,
      studentLearningImprovement: String,
      otherBenefits: String,
      recommendedFollowUpAction: String,
    },
    completionDetails: {
      completionDate: Date,
      completedByUser: mongoose.Schema.Types.ObjectId,
      certificateIssued: Boolean,
      certificateIssuanceDate: Date,
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

employeeTrainingSchema.index({ schoolId: 1, employeeId: 1 });
employeeTrainingSchema.index({ schoolId: 1, programId: 1 });
employeeTrainingSchema.index({ schoolId: 1, enrollmentStatus: 1 });
employeeTrainingSchema.index({ code: 1, schoolId: 1 });

employeeTrainingSchema.virtual('trainingStatus').get(function () {
  if (this.performance.assessmentStatus === 'PASSED') return 'SUCCESSFULLY_COMPLETED';
  if (this.performance.assessmentStatus === 'FAILED') return 'INCOMPLETE';
  if (this.enrollmentStatus === 'ATTENDED' || this.enrollmentStatus === 'COMPLETED') return 'IN_PROGRESS';
  return this.enrollmentStatus;
});

employeeTrainingSchema.virtual('completionPercentage').get(function () {
  if (this.attendance.totalSessions === 0) return 0;
  return Math.round((this.attendance.sessionsAttended / this.attendance.totalSessions) * 100);
});

employeeTrainingSchema.virtual('daysInTraining').get(function () {
  if (this.enrollmentDate) {
    return Math.floor((Date.now() - this.enrollmentDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

employeeTrainingSchema.pre('save', async function (next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('EmployeeTraining').countDocuments({
      schoolId: this.schoolId,
    });
    this.code = `ET-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('EmployeeTraining', employeeTrainingSchema);
