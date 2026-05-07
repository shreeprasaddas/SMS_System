/**
 * StudentAssessment Model
 * Student performance records on individual assessments
 */

const mongoose = require('mongoose');

const studentAssessmentSchema = new mongoose.Schema(
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
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
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
    marksObtained: {
      type: Number,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: Number,
    grade: String,
    status: {
      type: String,
      enum: ['NOT_SUBMITTED', 'SUBMITTED', 'EVALUATED', 'ABSENT', 'EXEMPTED'],
      default: 'NOT_SUBMITTED',
    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
    isPassed: Boolean,
    remarks: String,
    feedback: String,
    submissionDate: Date,
    evaluatedDate: Date,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedDate: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
    isReviewRequested: {
      type: Boolean,
      default: false,
    },
    reviewRequestDate: Date,
    reviewRequestReason: String,
  },
  {
    timestamps: true,
    collection: 'studentAssessments',
  }
);

// Indexes
studentAssessmentSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
studentAssessmentSchema.index({ schoolId: 1, assessment: 1 });
studentAssessmentSchema.index({ schoolId: 1, status: 1 });
studentAssessmentSchema.index({ student: 1, assessment: 1, unique: true });

// Virtual for grade calculation
studentAssessmentSchema.virtual('grade').get(function () {
  if (!this.marksObtained || !this.totalMarks) return null;
  const percentage = (this.marksObtained / this.totalMarks) * 100;
  return percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';
});

module.exports = mongoose.model('StudentAssessment', studentAssessmentSchema);
