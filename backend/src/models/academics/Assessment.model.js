/**
 * Assessment Model
 * Test, quiz, assignment, and exam configurations
 */

const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['QUIZ', 'TEST', 'ASSIGNMENT', 'EXAM', 'PRACTICAL', 'PROJECT', 'MIDTERM', 'FINAL'],
      required: true,
    },
    term: {
      type: String,
      enum: ['FIRST', 'SECOND', 'THIRD'],
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    passingMarks: {
      type: Number,
      min: 0,
    },
    description: String,
    instructions: String,
    assessmentDate: {
      type: Date,
      required: true,
    },
    submissionDeadline: Date,
    weightage: {
      type: Number,
      min: 0,
      max: 100,
    },
    isNegativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkingPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    publishedDate: Date,
    closedDate: Date,
  },
  {
    timestamps: true,
    collection: 'assessments',
  }
);

// Indexes
assessmentSchema.index({ schoolId: 1, class: 1, subject: 1 });
assessmentSchema.index({ schoolId: 1, academicYear: 1 });
assessmentSchema.index({ schoolId: 1, status: 1 });
assessmentSchema.index({ assessmentDate: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
