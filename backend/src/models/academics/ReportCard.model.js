/**
 * ReportCard Model
 * Student comprehensive report card per term/semester
 */

const mongoose = require('mongoose');

const reportCardSchema = new mongoose.Schema(
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
    reportCardNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    totalSubjects: Number,
    subjectGrades: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        marksObtained: Number,
        totalMarks: Number,
        percentage: Number,
        grade: String,
        gradePoint: Number,
        status: String,
        _id: false,
      },
    ],
    totalMarks: Number,
    totalObtainedMarks: Number,
    overallPercentage: Number,
    overallGrade: String,
    cumulativeGPA: Number,
    classRank: Number,
    totalStudentsInClass: Number,
    promotionStatus: {
      type: String,
      enum: ['PROMOTED', 'DETAINED', 'AWAITING_DECISION'],
    },
    attendance: {
      presentDays: Number,
      totalDays: Number,
      attendancePercentage: Number,
      _id: false,
    },
    conduct: {
      grade: String,
      remarks: String,
      _id: false,
    },
    achievements: [
      {
        title: String,
        category: String,
        _id: false,
      },
    ],
    principalRemarks: String,
    classTeacherRemarks: String,
    parentFeedback: String,
    status: {
      type: String,
      enum: ['DRAFT', 'FINALIZED', 'PUBLISHED', 'DISPUTED'],
      default: 'DRAFT',
    },
    publishedDate: Date,
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'reportCards',
  }
);

// Indexes
reportCardSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
reportCardSchema.index({ schoolId: 1, class: 1, term: 1 });
reportCardSchema.index({ schoolId: 1, status: 1 });
reportCardSchema.index({ reportCardNumber: 1, unique: true, sparse: true });

module.exports = mongoose.model('ReportCard', reportCardSchema);
