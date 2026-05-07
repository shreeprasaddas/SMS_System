const SchoolDashboard = require('../models/SchoolDashboard.model');
const AcademicsReport = require('../models/AcademicsReport.model');
const FinancialReport = require('../models/FinancialReport.model');
const EngagementMetrics = require('../models/EngagementMetrics.model');
const SchoolBenchmark = require('../models/SchoolBenchmark.model');
const AppError = require('../utils/errorHandler');

class SchoolAnalyticsService {
  // 1. Generate/Get School Dashboard
  async generateSchoolDashboard(data, schoolId) {
    const dashboard = new SchoolDashboard({
      ...data,
      schoolId,
    });
    return dashboard.save();
  }

  async getSchoolDashboard(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.dashboardType) query.dashboardType = filters.dashboardType;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const dashboards = await SchoolDashboard.find(query)
      .lean()
      .sort({ generationDetails: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SchoolDashboard.countDocuments(query);
    return { dashboards, total, page, limit };
  }

  async getDashboardById(dashboardId, schoolId) {
    const dashboard = await SchoolDashboard.findOne({
      _id: dashboardId,
      schoolId,
    });
    if (!dashboard) throw new AppError('Dashboard not found', 404);
    return dashboard;
  }

  async updateDashboard(dashboardId, schoolId, updateData) {
    const dashboard = await SchoolDashboard.findOneAndUpdate(
      { _id: dashboardId, schoolId },
      { $set: updateData, $push: { auditLog: { action: 'UPDATE', timestamp: Date.now() } } },
      { new: true, runValidators: true }
    );
    if (!dashboard) throw new AppError('Dashboard not found', 404);
    return dashboard;
  }

  // 2. Generate/Get Academic Reports
  async generateAcademicsReport(data, schoolId) {
    const report = new AcademicsReport({
      ...data,
      schoolId,
    });
    return report.save();
  }

  async getAcademicsReports(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.reportType) query.reportType = filters.reportType;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const reports = await AcademicsReport.find(query)
      .lean()
      .sort({ 'reportPeriod.endDate': -1 })
      .skip(skip)
      .limit(limit);

    const total = await AcademicsReport.countDocuments(query);
    return { reports, total, page, limit };
  }

  async getAcademicsReportById(reportId, schoolId) {
    const report = await AcademicsReport.findOne({
      _id: reportId,
      schoolId,
    });
    if (!report) throw new AppError('Academic report not found', 404);
    return report;
  }

  // 3. Generate/Get Financial Reports
  async generateFinancialReport(data, schoolId) {
    const report = new FinancialReport({
      ...data,
      schoolId,
    });
    return report.save();
  }

  async getFinancialReports(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.reportType) query.reportType = filters.reportType;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const reports = await FinancialReport.find(query)
      .lean()
      .sort({ 'reportPeriod.endDate': -1 })
      .skip(skip)
      .limit(limit);

    const total = await FinancialReport.countDocuments(query);
    return { reports, total, page, limit };
  }

  async getFinancialReportById(reportId, schoolId) {
    const report = await FinancialReport.findOne({
      _id: reportId,
      schoolId,
    });
    if (!report) throw new AppError('Financial report not found', 404);
    return report;
  }

  async getFinancialHealthStatus(schoolId, academicYear) {
    const report = await FinancialReport.findOne({
      schoolId,
      academicYear,
      reportType: 'ANNUAL',
    })
      .lean()
      .sort({ 'generationDetails.generatedDate': -1 });

    if (!report) throw new AppError('Financial report not found for this academic year', 404);

    return {
      healthStatus: report.healthStatus,
      profitMargin: report.profitLoss.profitMargin,
      collectionPercentage: report.revenue.collectionPercentage,
      outstandingFees: report.outstandingFees.totalPending,
      recommendations: report.recommendations,
    };
  }

  // 4. Get Engagement Metrics
  async createEngagementMetrics(data, schoolId) {
    const metrics = new EngagementMetrics({
      ...data,
      schoolId,
    });
    return metrics.save();
  }

  async getEngagementMetrics(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.entityId) query.entityId = filters.entityId;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const metrics = await EngagementMetrics.find(query)
      .lean()
      .sort({ 'generationDetails.generatedDate': -1 })
      .skip(skip)
      .limit(limit);

    const total = await EngagementMetrics.countDocuments(query);
    return { metrics, total, page, limit };
  }

  async getEngagementMetricsById(metricsId, schoolId) {
    const metrics = await EngagementMetrics.findOne({
      _id: metricsId,
      schoolId,
    });
    if (!metrics) throw new AppError('Engagement metrics not found', 404);
    return metrics;
  }

  async getStudentEngagementSummary(schoolId, academicYear, limit = 10) {
    const students = await EngagementMetrics.find({
      schoolId,
      academicYear,
      entityType: 'STUDENT',
    })
      .lean()
      .sort({ 'studentEngagement.overallEngagementScore': -1 })
      .limit(limit)
      .select('entityName studentEngagement engagementHealth');

    return students;
  }

  // 5. Get/Create School Benchmarks
  async generateSchoolBenchmark(data, schoolId) {
    const benchmark = new SchoolBenchmark({
      ...data,
      schoolId,
    });
    return benchmark.save();
  }

  async getSchoolBenchmarks(schoolId, filters = {}) {
    const query = { schoolId };
    if (filters.benchmarkType) query.benchmarkType = filters.benchmarkType;
    if (filters.academicYear) query.academicYear = filters.academicYear;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const benchmarks = await SchoolBenchmark.find(query)
      .lean()
      .sort({ 'generationDetails.generatedDate': -1 })
      .skip(skip)
      .limit(limit);

    const total = await SchoolBenchmark.countDocuments(query);
    return { benchmarks, total, page, limit };
  }

  async getSchoolBenchmarkById(benchmarkId, schoolId) {
    const benchmark = await SchoolBenchmark.findOne({
      _id: benchmarkId,
      schoolId,
    });
    if (!benchmark) throw new AppError('Benchmark not found', 404);
    return benchmark;
  }

  // 6. Comprehensive School Analytics Summary
  async getComprehensiveAnalyticsSummary(schoolId, academicYear) {
    try {
      const [dashboard, academicsReport, financialReport, benchmarks] = await Promise.all([
        SchoolDashboard.findOne({ schoolId, academicYear }).lean().sort({ 'generationDetails.generatedDate': -1 }),
        AcademicsReport.findOne({ schoolId, academicYear }).lean().sort({ 'reportPeriod.endDate': -1 }),
        FinancialReport.findOne({ schoolId, academicYear }).lean().sort({ 'reportPeriod.endDate': -1 }),
        SchoolBenchmark.findOne({ schoolId, academicYear }).lean().sort({ 'generationDetails.generatedDate': -1 }),
      ]);

      return {
        academicYear,
        dashboard: dashboard || null,
        academics: academicsReport || null,
        financial: financialReport || null,
        benchmarks: benchmarks || null,
        generatedAt: new Date(),
      };
    } catch (error) {
      throw new AppError('Error generating comprehensive summary', 500);
    }
  }

  // 7. Get Alert Summary (Critical Issues)
  async getAlertsSummary(schoolId, filters = {}) {
    const dashboards = await SchoolDashboard.find({ schoolId }).lean().select('alerts').limit(1);
    const financialReports = await FinancialReport.find({ schoolId }).lean().select('alerts').limit(1);

    const allAlerts = [
      ...(dashboards[0]?.alerts || []),
      ...(financialReports[0]?.alerts || []),
    ];

    const criticalAlerts = allAlerts.filter((a) => a.severity === 'CRITICAL');
    const activeAlerts = allAlerts.filter((a) => a.status === 'ACTIVE');

    return {
      totalAlerts: allAlerts.length,
      criticalAlerts: criticalAlerts.length,
      activeAlerts: activeAlerts.length,
      alerts: activeAlerts.slice(0, 10),
    };
  }

  // 8. Get Recommendations Summary
  async getRecommendationsSummary(schoolId, academicYear) {
    const [dashboard, academics, financial, benchmark] = await Promise.all([
      SchoolDashboard.findOne({ schoolId, academicYear }).lean().select('recommendations'),
      AcademicsReport.findOne({ schoolId, academicYear }).lean().select('recommendations'),
      FinancialReport.findOne({ schoolId, academicYear }).lean().select('recommendations'),
      SchoolBenchmark.findOne({ schoolId, academicYear }).lean().select('recommendations'),
    ]);

    return {
      dashboard: dashboard?.recommendations || [],
      academics: academics?.recommendations || [],
      financial: financial?.recommendations || [],
      benchmark: benchmark?.recommendations || [],
    };
  }

  // 9. Get Trend Analysis (Multiple Periods)
  async getTrendAnalysis(schoolId, metric = 'academics', filters = {}) {
    const query = { schoolId };
    if (filters.academicYear) query.academicYear = filters.academicYear;

    let trends = [];
    if (metric === 'academics') {
      trends = await AcademicsReport.find(query)
        .lean()
        .sort({ 'reportPeriod.startDate': 1 })
        .select('academicYear overallPerformance');
    } else if (metric === 'financial') {
      trends = await FinancialReport.find(query)
        .lean()
        .sort({ 'reportPeriod.startDate': 1 })
        .select('academicYear revenue profitLoss');
    }

    return trends;
  }

  // 10. Get Performance Comparison (Class/Subject)
  async getPerformanceComparison(schoolId, academicYear, comparisonType = 'class') {
    const report = await AcademicsReport.findOne({
      schoolId,
      academicYear,
    }).lean();

    if (!report) throw new AppError('Academic report not found', 404);

    if (comparisonType === 'class') {
      return report.classWiseAnalysis;
    } else if (comparisonType === 'subject') {
      return report.subjectAnalysis;
    }

    return null;
  }

  // 11. Get Top Performers & Strugglers
  async getPerformersList(schoolId, academicYear, category = 'toppers') {
    const report = await AcademicsReport.findOne({
      schoolId,
      academicYear,
    }).lean();

    if (!report) throw new AppError('Academic report not found', 404);

    if (category === 'toppers') return report.studentPerformanceTiers.toppersList;
    if (category === 'improvers') return report.studentPerformanceTiers.improvers;
    if (category === 'strugglers') return report.studentPerformanceTiers.strugglers;

    return [];
  }

  // 12. Get Fee Collection Status
  async getFeeCollectionStatus(schoolId, academicYear) {
    const report = await FinancialReport.findOne({
      schoolId,
      academicYear,
    }).lean();

    if (!report) throw new AppError('Financial report not found', 404);

    return {
      totalExpected: report.revenue.totalExpectedRevenue,
      collected: report.revenue.totalFeeCollected,
      pending: report.outstandingFees.totalPending,
      collectionPercentage: report.revenue.collectionPercentage,
      classWiseCollection: report.revenue.classWiseCollection,
      defaulters: report.outstandingFees.defaulters,
    };
  }

  // 13. Get Engagement Status
  async getEngagementStatus(schoolId, academicYear, entityType = 'STUDENT') {
    const metrics = await EngagementMetrics.find({
      schoolId,
      academicYear,
      entityType,
    })
      .lean()
      .sort({ 'generationDetails.generatedDate': -1 });

    const highlyEngaged = metrics.filter((m) => m.engagementHealth === 'EXCELLENT').length;
    const engaged = metrics.filter((m) => m.engagementHealth === 'GOOD').length;
    const needsAttention = metrics.filter((m) => m.engagementHealth === 'NEEDS_ATTENTION').length;

    return {
      totalEntities: metrics.length,
      highlyEngaged,
      engaged,
      needsAttention,
      averageScore:
        metrics.reduce((sum, m) => {
          if (entityType === 'STUDENT') return sum + (m.studentEngagement?.overallEngagementScore || 0);
          if (entityType === 'TEACHER') return sum + (m.teacherEngagement?.overallEngagementScore || 0);
          return sum + (m.parentEngagement?.overallEngagementScore || 0);
        }, 0) / metrics.length,
    };
  }

  // 14. Get Benchmark Comparison
  async getBenchmarkComparison(schoolId, academicYear) {
    const benchmark = await SchoolBenchmark.findOne({
      schoolId,
      academicYear,
    }).lean();

    if (!benchmark) throw new AppError('Benchmark not found', 404);

    return {
      overallStatus: benchmark.overallStatus,
      overallScore: benchmark.overallBenchmarkScore,
      strengths: benchmark.strengths,
      gaps: benchmark.gaps,
      actionPlan: benchmark.actionPlan,
    };
  }

  // 15. Get Executive Summary (For Principal/Admin Dashboard)
  async getExecutiveSummary(schoolId, academicYear) {
    try {
      const [dashboard, academics, financial, benchmark] = await Promise.all([
        this.getSchoolDashboard(schoolId, { academicYear, limit: 1 }),
        this.getAcademicsReports(schoolId, { academicYear, limit: 1 }),
        this.getFinancialReports(schoolId, { academicYear, limit: 1 }),
        this.getSchoolBenchmarks(schoolId, { academicYear, limit: 1 }),
      ]);

      const alerts = await this.getAlertsSummary(schoolId);
      const recommendations = await this.getRecommendationsSummary(schoolId, academicYear);

      return {
        academicYear,
        dashboardHealth: dashboard.dashboards[0]?.dashboardHealth || 'N/A',
        academicStatus: academics.reports[0]?.reportQuality || 'N/A',
        financialHealth: financial.reports[0]?.healthStatus || 'N/A',
        benchmarkStatus: benchmark.benchmarks[0]?.overallStatus || 'N/A',
        keyMetrics: {
          studentEnrollment: dashboard.dashboards[0]?.overallMetrics.totalStudents || 0,
          teacherCount: dashboard.dashboards[0]?.overallMetrics.totalTeachers || 0,
          attendancePercentage: dashboard.dashboards[0]?.overallMetrics.averageAttendance || 0,
          feeCollection: financial.reports[0]?.revenue.collectionPercentage || 0,
        },
        alerts,
        keyRecommendations: recommendations,
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw new AppError('Error generating executive summary', 500);
    }
  }
}

module.exports = new SchoolAnalyticsService();
