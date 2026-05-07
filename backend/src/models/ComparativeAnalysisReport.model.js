/**
 * ComparativeAnalysisReport Model
 * Comparative performance benchmarking and peer analysis
 */

const mongoose = require('mongoose');
const { generateCode } = require('../utils/codeGenerator');

const comparativeAnalysisReportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    analysisPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      academicYear: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        enum: ['SEMESTER_1', 'SEMESTER_2', 'ANNUAL'],
      },
    },
    groupComparisons: [
      {
        groupName: {
          type: String,
          enum: ['CLASS', 'GRADE', 'SECTION', 'SCHOOL', 'BOARD'],
          required: true,
        },
        groupId: mongoose.Schema.Types.ObjectId,
        groupDescription: String,
        totalStudentsInGroup: Number,
        studentsAnalyzed: Number,
        groupMetrics: {
          averageScore: Number,
          medianScore: Number,
          highestScore: Number,
          lowestScore: Number,
          standardDeviation: Number,
          quartile25thPercentile: Number,
          quartile75thPercentile: Number,
        },
        subjectWiseComparison: [
          {
            subjectName: String,
            groupAverageScore: Number,
            topPerformer: {
              studentId: mongoose.Schema.Types.ObjectId,
              studentName: String,
              score: Number,
            },
            bottomPerformer: {
              studentId: mongoose.Schema.Types.ObjectId,
              studentName: String,
              score: Number,
            },
            passingPercentage: Number,
            failingPercentage: Number,
          },
        ],
        performanceDistribution: {
          excellentCategory: Number, // percentage
          goodCategory: Number,
          averageCategory: Number,
          belowAverageCategory: Number,
          poorCategory: Number,
        },
      },
    ],
    individualComparisons: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        studentName: String,
        studentScore: Number,
        studentPercentage: Number,
        studentGrade: String,
        comparisonMetrics: {
          vsGroupAverage: {
            difference: Number,
            percentageDifference: Number,
            percentileRank: Number,
            isAboveAverage: Boolean,
          },
          vsTopPerformer: {
            topPerformerScore: Number,
            scoreGap: Number,
            achievableWithEffort: Boolean,
          },
          vsBottomPerformer: {
            bottomPerformerScore: Number,
            performanceMargin: Number,
          },
          vsPreviousPeriod: {
            previousPeriodScore: Number,
            improvement: Number,
            improvementPercentage: Number,
            consistency: {
              type: String,
              enum: ['CONSISTENT', 'FLUCTUATING', 'DECLINING'],
            },
          },
        },
        studentRanking: {
          classRank: Number,
          sectionRank: Number,
          gradeRank: Number,
          schoolRank: Number,
          totalStudentsRanked: Number,
        },
        performanceCategory: {
          type: String,
          enum: ['TOP_PERFORMER', 'ABOVE_AVERAGE', 'AVERAGE', 'BELOW_AVERAGE', 'STRUGGLING'],
        },
        peerBenchmark: {
          nearestTopPerformer: {
            studentId: mongoose.Schema.Types.ObjectId,
            scoreDifference: Number,
          },
          nearestAvgPerformer: {
            studentId: mongoose.Schema.Types.ObjectId,
            scoreDifference: Number,
          },
          nearestBottomPerformer: {
            studentId: mongoose.Schema.Types.ObjectId,
            scoreDifference: Number,
          },
        },
      },
    ],
    subjectComparisons: [
      {
        subjectId: mongoose.Schema.Types.ObjectId,
        subjectName: String,
        schoolPerformance: {
          averageScore: Number,
          averagePercentage: Number,
          passingPercentage: Number,
          topicDifficulty: {
            type: String,
            enum: ['VERY_EASY', 'EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT'],
          },
        },
        classPerformance: {
          classAverageScore: Number,
          classPassingPercentage: Number,
          performanceComparativeToSchool: {
            type: String,
            enum: ['ABOVE_SCHOOL_AVG', 'AT_SCHOOL_AVG', 'BELOW_SCHOOL_AVG'],
          },
        },
        topicWiseAnalysis: [
          {
            topicName: String,
            averageScore: Number,
            mostDifficultTopics: [String],
            mostEasyTopics: [String],
          },
        ],
        studentComparison: [
          {
            studentId: mongoose.Schema.Types.ObjectId,
            studentScore: Number,
            rank: Number,
            percentile: Number,
            strengthAreas: [String],
            weaknessAreas: [String],
          },
        ],
      },
    ],
    peerGroupAnalysis: {
      peerGroupDefinition: {
        basedOn: {
          type: String,
          enum: ['SIMILAR_GRADE', 'SIMILAR_SCORE_RANGE', 'SAME_SECTION', 'MANUAL_SELECTION'],
        },
        criteria: String,
        numberOfPeers: Number,
      },
      peerPerformanceMetrics: {
        peerGroupAverage: Number,
        peerGroupMedian: Number,
        studentPerformanceVsPeerAvg: Number,
        studentPercentileInPeerGroup: Number,
        studentPositionInPeerGroup: String, // Top 25%, 25-50%, etc
      },
      topPerformersInPeerGroup: [
        {
          studentId: mongoose.Schema.Types.ObjectId,
          studentName: String,
          score: Number,
          successStrategies: [String],
        },
      ],
    },
    predictiveComparison: {
      futureRankingPrediction: {
        classRank: Number,
        schoolRank: Number,
        predictionConfidence: Number,
      },
      competitivenessAnalysis: {
        competitionLevel: {
          type: String,
          enum: ['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'],
        },
        marksForTopRank: Number,
        marksForMiddleRank: Number,
        marksForBottomRank: Number,
      },
    },
    trendComparison: {
      studentTrend: {
        type: String,
        enum: ['IMPROVING', 'DECLINING', 'STABLE'],
      },
      groupTrend: {
        type: String,
        enum: ['IMPROVING', 'DECLINING', 'STABLE'],
      },
      relativeTrendPosition: {
        type: String,
        enum: ['IMPROVING_FASTER_THAN_GROUP', 'SIMILAR_TO_GROUP', 'IMPROVING_SLOWER_THAN_GROUP', 'DECLINING_WHILE_GROUP_IMPROVING'],
      },
    },
    insights: {
      summary: String,
      studentStrengthsComparativeToGroup: [String],
      studentWeaknessesComparativeToGroup: [String],
      opportunities: [String],
      recommendations: [String],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    auditLog: [
      {
        action: String,
        performedBy: mongoose.Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
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

// Pre-save middleware for code generation
comparativeAnalysisReportSchema.pre('save', async function (next) {
  if (!this.code && this.isNew) {
    try {
      this.code = await generateCode('CANALYTICS', this.schoolId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexes
comparativeAnalysisReportSchema.index({ schoolId, 'analysisPeriod.academicYear': 1 });
comparativeAnalysisReportSchema.index({ code: 1, schoolId: 1 });

// Virtual: Report recency
comparativeAnalysisReportSchema.virtual('daysOld').get(function () {
  if (!this.createdAt) return null;
  const now = new Date();
  const timeDiff = now - this.createdAt;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('ComparativeAnalysisReport', comparativeAnalysisReportSchema);
