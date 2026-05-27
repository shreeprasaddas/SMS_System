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
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
    },
    maximumMarks: {
      type: Number,
      default: 100,
    },
    gradePoint: {
      type: mongoose.Schema.Types.Mixed,
    },
    isFinalized: {
      type: Boolean,
      default: false,
    },
    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    finalizedDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'grades',
  }
);

// Indexes
gradeSchema.index({ schoolId: 1, student: 1, subject: 1, academicYear: 1, class: 1 });
gradeSchema.index({ schoolId: 1, class: 1, academicYear: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
