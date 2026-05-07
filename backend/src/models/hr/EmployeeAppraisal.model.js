/**
 * EmployeeAppraisal Model
 * Performance appraisal and evaluation records
 */

const mongoose = require('mongoose');

const employeeAppraisalSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appraisalPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      _id: false,
    },
    appraisalType: {
      type: String,
      enum: ['ANNUAL', 'HALF_YEARLY', 'QUARTERLY', 'PROJECT_BASED'],
      required: true,
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performanceMetrics: [
      {
        criterion: {
          type: String,
          enum: [
            'COMMUNICATION',
            'TEAMWORK',
            'PUNCTUALITY',
            'INITIATIVE',
            'TECHNICAL_SKILLS',
            'STUDENT_ENGAGEMENT',
            'CLASS_MANAGEMENT',
            'DISCIPLINE',
            'PROFESSIONAL_DEVELOPMENT',
            'PRODUCTIVITY',
          ],
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comments: String,
        _id: false,
      },
    ],
    overallRating: Number,
    strengths: [String],
    areasForImprovement: [String],
    goals: [
      {
        goal: String,
        targetDate: Date,
        status: {
          type: String,
          enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'NOT_COMPLETED'],
        },
        _id: false,
      },
    ],
    trainingNeeds: [String],
    recommendedActions: [String],
    salaryIncrement: {
      currentSalary: Number,
      proposedSalary: Number,
      incrementPercentage: Number,
      effectiveFrom: Date,
      _id: false,
    },
    promotionRecommended: {
      type: Boolean,
      default: false,
    },
    promotionProposal: {
      proposedDesignation: String,
      effectiveFrom: Date,
      justification: String,
      _id: false,
    },
    appraisalComments: String,
    employeeComments: String,
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'FINALIZED', 'PUBLISHED'],
      default: 'DRAFT',
    },
    reviewedDate: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    finalizedDate: Date,
    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedDate: Date,
  },
  {
    timestamps: true,
    collection: 'employeeAppraisals',
  }
);

// Indexes
employeeAppraisalSchema.index({ schoolId: 1, employee: 1 });
employeeAppraisalSchema.index({ schoolId: 1, appraisalType: 1 });
employeeAppraisalSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('EmployeeAppraisal', employeeAppraisalSchema);
