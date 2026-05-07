/**
 * Student Performance Analytics Service
 * Business logic for analytics operations (distinct from reporting analytics)
 */

const PerformanceMetric = require('../models/PerformanceMetric.model');
const LearningAnalytics = require('../models/LearningAnalytics.model');
const AcademicTrend = require('../models/AcademicTrend.model');
const ComparativeAnalysisReport = require('../models/ComparativeAnalysisReport.model');
const AnalyticsReport = require('../models/AnalyticsReport.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Get performance metrics for student
 */
exports.getPerformanceMetrics = async (studentId, schoolId, filters = {}) => {
  try {
    const { subjectId, assessmentType, page = 1, limit = 20 } = filters;
    const query = { studentId, schoolId };

    if (subjectId) query.subjectId = subjectId;
    if (assessmentType) query.assessmentType = assessmentType;

    const skip = (page - 1) * limit;
    const [metrics, total] = await Promise.all([
      PerformanceMetric.find(query)
        .sort({ assessmentDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      PerformanceMetric.countDocuments(query),
    ]);

    return { metrics, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve performance metrics', 400);
  }
};

/**
 * Create performance metric
 */
exports.createPerformanceMetric = async (data, schoolId) => {
  try {
    const metric = await PerformanceMetric.create({
      ...data,
      schoolId,
    });

    return metric;
  } catch (error) {
    throw new AppError('Failed to create performance metric', 400);
  }
};

/**
 * Get learning analytics for student
 */
exports.getLearningAnalytics = async (studentId, schoolId, academicYear) => {
  try {
    const analytics = await LearningAnalytics.findOne({
      studentId,
      schoolId,
      academicYear,
    }).lean();

    if (!analytics) throw new AppError('Learning analytics not found', 404);
    return analytics;
  } catch (error) {
    throw error;
  }
};

/**
 * Update learning analytics
 */
exports.updateLearningAnalytics = async (studentId, schoolId, updateData) => {
  try {
    const analytics = await LearningAnalytics.findOneAndUpdate(
      { studentId, schoolId, academicYear: updateData.academicYear },
      {
        $set: updateData,
        $push: {
          auditLog: {
            action: 'ANALYTICS_UPDATED',
            performedBy: updateData.performedBy,
            timestamp: new Date(),
            changes: updateData,
          },
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return analytics;
  } catch (error) {
    throw new AppError('Failed to update learning analytics', 400);
  }
};

/**
 * Get academic trends for student
 */
exports.getAcademicTrends = async (studentId, schoolId, filters = {}) => {
  try {
    const { periodType, page = 1, limit = 20 } = filters;
    const query = { studentId, schoolId };

    if (periodType) query.periodType = periodType;

    const skip = (page - 1) * limit;
    const [trends, total] = await Promise.all([
      AcademicTrend.find(query)
        .sort({ analysisEndDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AcademicTrend.countDocuments(query),
    ]);

    return { trends, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve academic trends', 400);
  }
};

/**
 * Generate academic trend analysis
 */
exports.generateAcademicTrendAnalysis = async (studentId, schoolId, trendData) => {
  try {
    const trend = await AcademicTrend.create({
      ...trendData,
      studentId,
      schoolId,
    });

    return trend;
  } catch (error) {
    throw new AppError('Failed to generate academic trend', 400);
  }
};

/**
 * Get comparative analysis report
 */
exports.getComparativeAnalysis = async (schoolId, filters = {}) => {
  try {
    const { academicYear, groupType, page = 1, limit = 20 } = filters;
    const query = { schoolId, 'analysisPeriod.academicYear': academicYear };

    if (groupType) query['groupComparisons.groupName'] = groupType;

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      ComparativeAnalysisReport.find(query)
        .sort({ 'analysisPeriod.endDate': -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ComparativeAnalysisReport.countDocuments(query),
    ]);

    return { reports, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve comparative analysis', 400);
  }
};

/**
 * Create comparative analysis report
 */
exports.createComparativeAnalysis = async (data, schoolId) => {
  try {
    const report = await ComparativeAnalysisReport.create({
      ...data,
      schoolId,
    });

    return report;
  } catch (error) {
    throw new AppError('Failed to create comparative analysis', 400);
  }
};

/**
 * Get analytics reports
 */
exports.getAnalyticsReports = async (schoolId, filters = {}) => {
  try {
    const { reportType, academicYear, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (reportType) query.reportType = reportType;
    if (academicYear) query['reportPeriod.academicYear'] = academicYear;

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      AnalyticsReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AnalyticsReport.countDocuments(query),
    ]);

    return { reports, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve analytics reports', 400);
  }
};

/**
 * Generate analytics report
 */
exports.generateAnalyticsReport = async (data, schoolId, userId) => {
  try {
    const report = await AnalyticsReport.create({
      ...data,
      schoolId,
      'generationDetails.generatedByUserId': userId,
    });

    return report;
  } catch (error) {
    throw new AppError('Failed to generate analytics report', 400);
  }
};

/**
 * Get at-risk students
 */
exports.getAtRiskStudents = async (schoolId, filters = {}) => {
  try {
    const { riskLevel = 'HIGH', page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      LearningAnalytics.find({
        schoolId,
        'risksAndChallenges.dropoutRisk.isAtRisk': true,
      })
        .populate('studentId', 'firstName lastName rollNumber classId')
        .sort({ 'risksAndChallenges.dropoutRisk.riskScore': -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LearningAnalytics.countDocuments({
        schoolId,
        'risksAndChallenges.dropoutRisk.isAtRisk': true,
      }),
    ]);

    return { students, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve at-risk students', 400);
  }
};

/**
 * Get predicted performance
 */
exports.getPredictedPerformance = async (studentId, schoolId) => {
  try {
    const trend = await AcademicTrend.findOne({
      studentId,
      schoolId,
      status: 'ACTIVE',
    })
      .select('predictiveAnalysis')
      .lean();

    if (!trend) throw new AppError('Prediction data not available', 404);
    return trend.predictiveAnalysis;
  } catch (error) {
    throw error;
  }
};

/**
 * Get class analytics summary
 */
exports.getClassAnalyticsSummary = async (classId, schoolId, academicYear) => {
  try {
    const [metrics, analytics, trends] = await Promise.all([
      PerformanceMetric.aggregate([
        {
          $match: {
            classId: new (require('mongoose')).Types.ObjectId(classId),
            schoolId: new (require('mongoose')).Types.ObjectId(schoolId),
            academicYear,
          },
        },
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$assessmentDetails.marksObtained' },
            maxScore: { $max: '$assessmentDetails.marksObtained' },
            minScore: { $min: '$assessmentDetails.marksObtained' },
            studentCount: { $sum: 1 },
          },
        },
      ]),
      LearningAnalytics.countDocuments({
        schoolId,
        academicYear,
      }),
      AcademicTrend.find({
        schoolId,
        'trendMetrics.overallTrend': 'IMPROVING',
      })
        .countDocuments(),
    ]);

    return {
      classMetrics: metrics[0] || {},
      totalAnalytics: analytics,
      improvingTrends: trends,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve class analytics', 400);
  }
};

/**
 * Get subject performance analysis
 */
exports.getSubjectPerformanceAnalysis = async (schoolId, subjectId, filters = {}) => {
  try {
    const { classId, academicYear, page = 1, limit = 20 } = filters;
    const query = { schoolId, subjectId };

    if (classId) query.classId = classId;
    if (academicYear) query.academicYear = academicYear;

    const skip = (page - 1) * limit;
    const [metrics, total, avgPerformance] = await Promise.all([
      PerformanceMetric.find(query)
        .sort({ assessmentDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      PerformanceMetric.countDocuments(query),
      PerformanceMetric.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            averagePercentage: { $avg: '$assessmentDetails.percentage' },
            averageMarks: { $avg: '$assessmentDetails.marksObtained' },
            topScore: { $max: '$assessmentDetails.marksObtained' },
          },
        },
      ]),
    ]);

    return {
      metrics,
      total,
      page: Number(page),
      limit: Number(limit),
      averagePerformance: avgPerformance[0] || {},
    };
  } catch (error) {
    throw new AppError('Failed to retrieve subject performance', 400);
  }
};

/**
 * Get analytics dashboard data
 */
exports.getAnalyticsDashboard = async (schoolId, filters = {}) => {
  try {
    const { academicYear } = filters;

    const [topPerformers, atRiskStudents, averageMetrics, trendSummary] = await Promise.all([
      PerformanceMetric.find({ schoolId, academicYear })
        .sort({ 'assessmentDetails.percentage': -1 })
        .limit(5)
        .lean(),
      LearningAnalytics.find({
        schoolId,
        academicYear,
        'risksAndChallenges.dropoutRisk.isAtRisk': true,
      })
        .limit(5)
        .lean(),
      PerformanceMetric.aggregate([
        { $match: { schoolId: new (require('mongoose')).Types.ObjectId(schoolId), academicYear } },
        {
          $group: {
            _id: null,
            averagePercentage: { $avg: '$assessmentDetails.percentage' },
            totalMetrics: { $sum: 1 },
          },
        },
      ]),
      AcademicTrend.aggregate([
        {
          $match: {
            schoolId: new (require('mongoose')).Types.ObjectId(schoolId),
          },
        },
        {
          $group: {
            _id: '$trendMetrics.overallTrend',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      topPerformers,
      atRiskStudents,
      averageMetrics: averageMetrics[0] || {},
      trendSummary,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve dashboard data', 400);
  }
};
