/**
 * Appraisal Service
 * Business logic for employee performance appraisals
 */

const EmployeeAppraisal = require('../models/hr/EmployeeAppraisal.model');
const { AppError } = require('../utils/errorHelper');

class AppraisalService {
  /**
   * Create appraisal
   */
  static async createAppraisal(schoolId, appraisalData, userId) {
    const appraisal = new EmployeeAppraisal({
      ...appraisalData,
      schoolId,
      status: 'DRAFT',
    });

    await appraisal.save();
    return appraisal.populate(['employee', 'reportingManager']);
  }

  /**
   * Get appraisals
   */
  static async getAppraisals(schoolId, filters = {}) {
    const { page = 1, limit = 10, employee, appraisalType, status } = filters;

    const query = { schoolId };
    if (employee) query.employee = employee;
    if (appraisalType) query.appraisalType = appraisalType;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      EmployeeAppraisal.find(query)
        .populate('employee', 'firstName lastName email')
        .populate('reportingManager', 'firstName lastName')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      EmployeeAppraisal.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get appraisal by ID
   */
  static async getAppraisalById(schoolId, appraisalId) {
    const appraisal = await EmployeeAppraisal.findOne({ _id: appraisalId, schoolId }).populate([
      { path: 'employee', select: 'firstName lastName email designation' },
      { path: 'reportingManager', select: 'firstName lastName email' },
      { path: 'reviewedBy', select: 'firstName lastName' },
      { path: 'finalizedBy', select: 'firstName lastName' },
    ]);

    if (!appraisal) throw new AppError('Appraisal not found', 404);
    return appraisal;
  }

  /**
   * Update appraisal
   */
  static async updateAppraisal(schoolId, appraisalId, updateData) {
    const appraisal = await EmployeeAppraisal.findOneAndUpdate(
      { _id: appraisalId, schoolId, status: 'DRAFT' },
      updateData,
      { new: true, runValidators: true }
    );

    if (!appraisal) throw new AppError('Appraisal not found or already submitted', 404);
    return appraisal;
  }

  /**
   * Submit appraisal
   */
  static async submitAppraisal(schoolId, appraisalId) {
    const appraisal = await EmployeeAppraisal.findOneAndUpdate(
      { _id: appraisalId, schoolId, status: 'DRAFT' },
      { status: 'SUBMITTED' },
      { new: true }
    );

    if (!appraisal) throw new AppError('Appraisal not found', 404);
    return appraisal;
  }

  /**
   * Calculate overall rating
   */
  static calculateOverallRating(performanceMetrics) {
    if (!performanceMetrics || performanceMetrics.length === 0) return 0;

    const totalRating = performanceMetrics.reduce((sum, pm) => sum + pm.rating, 0);
    return Math.round((totalRating / performanceMetrics.length) * 10) / 10;
  }

  /**
   * Review appraisal
   */
  static async reviewAppraisal(schoolId, appraisalId, reviewData, userId) {
    const appraisal = await EmployeeAppraisal.findOne({ _id: appraisalId, schoolId });

    if (!appraisal) throw new AppError('Appraisal not found', 404);

    // Calculate overall rating from metrics
    const overallRating = this.calculateOverallRating(appraisal.performanceMetrics);

    appraisal.overallRating = overallRating;
    appraisal.appraisalComments = reviewData.comments;
    appraisal.status = 'REVIEWED';
    appraisal.reviewedDate = new Date();
    appraisal.reviewedBy = userId;

    await appraisal.save();
    return appraisal;
  }

  /**
   * Finalize appraisal
   */
  static async finalizeAppraisal(schoolId, appraisalId, finalizeData, userId) {
    const appraisal = await EmployeeAppraisal.findOne({ _id: appraisalId, schoolId });

    if (!appraisal) throw new AppError('Appraisal not found', 404);
    if (appraisal.status !== 'REVIEWED') {
      throw new AppError('Appraisal must be reviewed before finalization', 400);
    }

    appraisal.salaryIncrement = finalizeData.salaryIncrement || appraisal.salaryIncrement;
    appraisal.promotionRecommended = finalizeData.promotionRecommended || false;
    appraisal.promotionProposal = finalizeData.promotionProposal || appraisal.promotionProposal;
    appraisal.status = 'FINALIZED';
    appraisal.finalizedDate = new Date();
    appraisal.finalizedBy = userId;

    await appraisal.save();
    return appraisal;
  }

  /**
   * Publish appraisal
   */
  static async publishAppraisal(schoolId, appraisalId) {
    const appraisal = await EmployeeAppraisal.findOneAndUpdate(
      { _id: appraisalId, schoolId, status: 'FINALIZED' },
      {
        status: 'PUBLISHED',
        publishedDate: new Date(),
      },
      { new: true }
    );

    if (!appraisal) throw new AppError('Appraisal not found or not finalized', 404);
    return appraisal;
  }

  /**
   * Get employee appraisal history
   */
  static async getEmployeeAppraisalHistory(schoolId, employee, filters = {}) {
    const { page = 1, limit = 10 } = filters;

    const query = { schoolId, employee };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      EmployeeAppraisal.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      EmployeeAppraisal.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get appraisal statistics
   */
  static async getAppraisalStatistics(schoolId, appraisalType) {
    const query = {
      schoolId,
      status: { $in: ['FINALIZED', 'PUBLISHED'] },
    };
    if (appraisalType) {
      query.appraisalType = appraisalType;
    }

    const appraisals = await EmployeeAppraisal.find(query);

    if (appraisals.length === 0) throw new AppError('No appraisals found', 404);

    const ratings = appraisals.map((a) => a.overallRating || 0);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const ratingDistribution = {
      excellent: ratings.filter((r) => r >= 4.5).length,
      good: ratings.filter((r) => r >= 3.5 && r < 4.5).length,
      average: ratings.filter((r) => r >= 2.5 && r < 3.5).length,
      needsImprovement: ratings.filter((r) => r < 2.5).length,
    };

    const promotionRecommended = appraisals.filter((a) => a.promotionRecommended).length;

    return {
      totalAppraisals: appraisals.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      promotionRecommended,
      highestRating: Math.max(...ratings),
      lowestRating: Math.min(...ratings),
    };
  }
}

module.exports = AppraisalService;
