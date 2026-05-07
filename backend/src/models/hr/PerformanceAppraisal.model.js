const mongoose = require('mongoose');

const performanceAppraisalSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HRStaff',
      required: true
    },
    staffName: String,
    designation: String,
    appraisalPeriod: {
      startDate: Date,
      endDate: Date
    },
    appraisalYear: {
      type: Number,
      required: true
    },
    appraisalType: {
      type: String,
      enum: ['QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'SPECIAL'],
      default: 'ANNUAL'
    },
    performanceMetrics: [{
      metric: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      weight: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    overallRating: {
      type: Number,
      min: 1,
      max: 5
    },
    strengths: String,
    areasForImprovement: String,
    developmentPlan: [{
      goal: String,
      timeline: String,
      action: String
    }],
    appraisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appraisedByName: String,
    appraisalDate: {
      type: Date,
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedByName: String,
    reviewDate: Date,
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgmentDate: Date,
    acknowledgmentRemarks: String,
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'ACKNOWLEDGED', 'COMPLETED'],
      default: 'DRAFT',
      index: true
    },
    recommendations: String,
    promotioneEligible: {
      type: Boolean,
      default: false
    },
    increaseRecommended: {
      type: Boolean,
      default: false
    },
    increasePercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: auto-generate code
performanceAppraisalSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('PerformanceAppraisal').countDocuments({ schoolId: this.schoolId });
    this.code = `PERF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
performanceAppraisalSchema.index({ schoolId: 1, status: 1 });
performanceAppraisalSchema.index({ schoolId: 1, staffId: 1, appraisalYear: 1 });
performanceAppraisalSchema.index({ schoolId: 1, appraisalDate: 1 });

module.exports = mongoose.model('PerformanceAppraisal', performanceAppraisalSchema);
