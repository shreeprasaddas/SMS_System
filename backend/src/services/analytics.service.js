/**
 * Analytics Service
 * Business logic for analytics and reporting operations
 */

const Report = require('../models/Report.model');
const ReportSchedule = require('../models/ReportSchedule.model');
const GeneratedReport = require('../models/GeneratedReport.model');
const ReportDashboard = require('../models/ReportDashboard.model');
const ReportMetric = require('../models/ReportMetric.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create new report template
 */
exports.createReport = async (data, schoolId, userId) => {
  try {
    const report = await Report.create({
      ...data,
      schoolId,
      createdByUserId: userId,
    });
    return report;
  } catch (error) {
    throw new AppError('Failed to create report', 400);
  }
};

/**
 * Get all reports with pagination and filters
 */
exports.getAllReports = async (schoolId, filters = {}) => {
  try {
    const { reportType, reportCategory, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (reportType) query.reportType = reportType;
    if (reportCategory) query.reportCategory = reportCategory;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Report.countDocuments(query),
    ]);

    return { reports, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve reports', 400);
  }
};

/**
 * Get report by ID
 */
exports.getReportById = async (reportId, schoolId) => {
  try {
    const report = await Report.findOne({ _id: reportId, schoolId }).lean();
    if (!report) throw new AppError('Report not found', 404);
    return report;
  } catch (error) {
    throw error;
  }
};

/**
 * Update report configuration
 */
exports.updateReport = async (reportId, updateData, schoolId, userId) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: reportId, schoolId },
      {
        $set: updateData,
        $push: {
          auditLog: {
            action: 'UPDATED',
            performedBy: userId,
            timestamp: new Date(),
            changes: updateData,
          },
        },
      },
      { new: true, runValidators: true }
    );
    if (!report) throw new AppError('Report not found', 404);
    return report;
  } catch (error) {
    throw error;
  }
};

/**
 * Create report schedule for automated generation
 */
exports.createReportSchedule = async (data, schoolId, userId) => {
  try {
    const schedule = await ReportSchedule.create({
      ...data,
      schoolId,
      createdByUserId: userId,
    });
    return schedule;
  } catch (error) {
    throw new AppError('Failed to create report schedule', 400);
  }
};

/**
 * Get all report schedules
 */
exports.getAllReportSchedules = async (schoolId, filters = {}) => {
  try {
    const { status, frequency, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (status) query.status = status;
    if (frequency) query.frequency = frequency;

    const skip = (page - 1) * limit;
    const [schedules, total] = await Promise.all([
      ReportSchedule.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ReportSchedule.countDocuments(query),
    ]);

    return { schedules, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve schedules', 400);
  }
};

/**
 * Generate report (on-demand execution)
 */
exports.generateReport = async (reportId, schoolId, userId, filters = {}) => {
  try {
    const report = await Report.findOne({ _id: reportId, schoolId }).lean();
    if (!report) throw new AppError('Report not found', 404);

    const startTime = Date.now();

    // Simulate data generation - in real scenario, execute actual queries
    const generatedReport = await GeneratedReport.create({
      reportId,
      schoolId,
      reportName: report.reportName,
      reportType: report.reportType,
      'generationDetails.generatedByUserId': userId,
      'generationDetails.generatedDate': new Date(),
      'dataSnapshot.totalRecords': 0,
      'reportMetadata.appliedFilters': Object.entries(filters).map(([key, value]) => ({
        fieldName: key,
        value,
      })),
    });

    const generationTime = Date.now() - startTime;
    await GeneratedReport.findByIdAndUpdate(
      generatedReport._id,
      {
        $set: {
          'generationDetails.generationDurationSeconds': generationTime / 1000,
          status: 'READY',
        },
      }
    );

    // Update report usage stats
    await Report.findByIdAndUpdate(reportId, {
      $inc: { usageCount: 1, totalGenerations: 1 },
      $set: { lastRunDate: new Date() },
    });

    return generatedReport;
  } catch (error) {
    throw error;
  }
};

/**
 * Get generated reports
 */
exports.getGeneratedReports = async (schoolId, filters = {}) => {
  try {
    const { reportId, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (reportId) query.reportId = reportId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      GeneratedReport.find(query)
        .sort({ 'generationDetails.generatedDate': -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      GeneratedReport.countDocuments(query),
    ]);

    return { reports, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve generated reports', 400);
  }
};

/**
 * Create dashboard configuration
 */
exports.createDashboard = async (data, schoolId, userId) => {
  try {
    const dashboard = await ReportDashboard.create({
      ...data,
      schoolId,
      createdByUserId: userId,
    });
    return dashboard;
  } catch (error) {
    throw new AppError('Failed to create dashboard', 400);
  }
};

/**
 * Get all dashboards
 */
exports.getAllDashboards = async (schoolId, filters = {}) => {
  try {
    const { dashboardType, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (dashboardType) query.dashboardType = dashboardType;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [dashboards, total] = await Promise.all([
      ReportDashboard.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ReportDashboard.countDocuments(query),
    ]);

    return { dashboards, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve dashboards', 400);
  }
};

/**
 * Get dashboard by ID with widgets
 */
exports.getDashboardById = async (dashboardId, schoolId) => {
  try {
    const dashboard = await ReportDashboard.findOne({ _id: dashboardId, schoolId }).lean();
    if (!dashboard) throw new AppError('Dashboard not found', 404);

    // Update usage statistics
    await ReportDashboard.findByIdAndUpdate(dashboardId, {
      $set: { 'usageStatistics.lastAccessedDate': new Date() },
      $inc: { 'usageStatistics.totalViews': 1 },
    });

    return dashboard;
  } catch (error) {
    throw error;
  }
};

/**
 * Create custom metric/KPI
 */
exports.createMetric = async (data, schoolId, userId) => {
  try {
    const metric = await ReportMetric.create({
      ...data,
      schoolId,
      createdByUserId: userId,
    });
    return metric;
  } catch (error) {
    throw new AppError('Failed to create metric', 400);
  }
};

/**
 * Get all metrics
 */
exports.getMetrics = async (schoolId, filters = {}) => {
  try {
    const { metricType, metricCategory, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (metricType) query.metricType = metricType;
    if (metricCategory) query.metricCategory = metricCategory;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [metrics, total] = await Promise.all([
      ReportMetric.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ReportMetric.countDocuments(query),
    ]);

    return { metrics, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve metrics', 400);
  }
};

/**
 * Get analytics and insights summary
 */
exports.getAnalytics = async (schoolId) => {
  try {
    const [totalReports, totalSchedules, totalDashboards, totalMetrics, recentGenerated, activeSchedules] = await Promise.all([
      Report.countDocuments({ schoolId }),
      ReportSchedule.countDocuments({ schoolId }),
      ReportDashboard.countDocuments({ schoolId }),
      ReportMetric.countDocuments({ schoolId }),
      GeneratedReport.countDocuments({ schoolId, status: 'READY' }),
      ReportSchedule.countDocuments({ schoolId, status: 'ACTIVE' }),
    ]);

    // Get top reports by usage
    const topReports = await Report.find({ schoolId })
      .sort({ usageCount: -1 })
      .limit(5)
      .select('reportName usageCount totalGenerations')
      .lean();

    // Get dashboard subscribers summary
    const dashboardStats = await ReportDashboard.aggregate([
      { $match: { schoolId } },
      { $group: { _id: null, totalSubscribers: { $sum: '$usageStatistics.totalSubscribers' }, totalDashboards: { $sum: 1 } } },
    ]);

    // Get metric performance
    const metricStats = await ReportMetric.countDocuments({ schoolId, 'targets.hasTarget': true });

    return {
      reportsSummary: {
        totalReports,
        recentGenerated,
      },
      scheduleSummary: {
        totalSchedules,
        activeSchedules,
      },
      dashboardSummary: {
        totalDashboards,
        totalSubscribers: dashboardStats[0]?.totalSubscribers || 0,
      },
      metricsSummary: {
        totalMetrics,
        metricsWithTargets: metricStats,
      },
      topReports,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve analytics', 400);
  }
};
