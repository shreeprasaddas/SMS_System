/**
 * Grade Model
 * Final subject-wise grades for students
 */

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    term: {
      type: String,
      enum: ['FIRST', 'SECOND', 'THIRD'],
      required: true,
    },
    gradeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GradeStructure',
      required: true,
    },
    continuousAssessmentMarks: {
      type: Number,
      min: 0,
    },
    examMarks: {
      type: Number,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    gradePoint: Number,
    grade: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'FINALIZED', 'PUBLISHED', 'CONTESTED'],
      default: 'PENDING',
    },
    isPassed: Boolean,
    remarks: String,
    gradesPublishedDate: Date,
    contestDetails: {
      contestedDate: Date,
      reason: String,
      remark: String,
      resolvedDate: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      _id: false,
    },
    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    finalizedDate: Date,
  },
  {
    timestamps: true,
    collection: 'grades',
  }
);

// Indexes
gradeSchema.index({ schoolId: 1, student: 1, academicYear: 1, term: 1 });
gradeSchema.index({ schoolId: 1, subject: 1, academicYear: 1 });
gradeSchema.index({ schoolId: 1, status: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
