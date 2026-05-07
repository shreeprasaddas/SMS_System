/**
 * GradeAnalysis Model
 * Performance analytics and trend analysis
 */

const mongoose = require('mongoose');

const gradeAnalysisSchema = new mongoose.Schema(
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
    analysisType: {
      type: String,
      enum: ['SUBJECT_WISE', 'CLASS_WISE', 'STUDENT_PERFORMANCE', 'COMPARATIVE'],
      required: true,
    },
    performanceMetrics: {
      averageScore: Number,
      highestScore: Number,
      lowestScore: Number,
      standardDeviation: Number,
      scoreDistribution: {
        excellent: Number,
        good: Number,
        average: Number,
        belowAverage: Number,
        poor: Number,
        _id: false,
      },
      _id: false,
    },
    trend: {
      term1Score: Number,
      term2Score: Number,
      term3Score: Number,
      improvementPercentage: Number,
      trend: {
        type: String,
        enum: ['IMPROVING', 'DECLINING', 'STABLE', 'FLUCTUATING'],
      },
      _id: false,
    },
    comparativeAnalysis: {
      classAverage: Number,
      studentVsClassAverage: Number,
      percentile: Number,
      _id: false,
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'gradeAnalyses',
  }
);

// Indexes
gradeAnalysisSchema.index({ schoolId: 1, student: 1, academicYear: 1 });
gradeAnalysisSchema.index({ schoolId: 1, subject: 1, academicYear: 1 });
gradeAnalysisSchema.index({ schoolId: 1, analysisType: 1 });

module.exports = mongoose.model('GradeAnalysis', gradeAnalysisSchema);
