/**
 * GradingTemplate Model
 * Grade weightage and calculation methodology
 */

const mongoose = require('mongoose');

const gradingTemplateSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    weightageComponents: [
      {
        component: {
          type: String,
          enum: ['PARTICIPATION', 'ASSIGNMENT', 'QUIZ', 'MIDTERM', 'FINAL', 'PROJECT', 'ATTENDANCE', 'PRACTICAL'],
          required: true,
        },
        weightPercentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        minMarks: {
          type: Number,
          min: 0,
        },
        description: String,
        _id: false,
      },
    ],
    totalWeightage: {
      type: Number,
      default: 100,
    },
    gradingMethod: {
      type: String,
      enum: ['CUMULATIVE', 'BEST_OF_THREE', 'AVERAGE', 'WEIGHTED_AVERAGE'],
      default: 'WEIGHTED_AVERAGE',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'gradingTemplates',
  }
);

// Indexes
gradingTemplateSchema.index({ schoolId: 1, academicYear: 1 });
gradingTemplateSchema.index({ schoolId: 1, class: 1 });
gradingTemplateSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('GradingTemplate', gradingTemplateSchema);
