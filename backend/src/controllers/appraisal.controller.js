/**
 * Appraisal Controller
 * HTTP request handlers for appraisal workflows
 */

const AppraisalService = require('../services/appraisal.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

class AppraisalController {
  static async createAppraisal(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const appraisalData = req.body;

      const appraisal = await AppraisalService.createAppraisal(schoolId, appraisalData, userId);
      responseHelper.created(res, appraisal, 'Appraisal created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAppraisals(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await AppraisalService.getAppraisals(schoolId, filters);
      responseHelper.paginated(res, result.data, result.pagination, 'Appraisals retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAppraisalById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { appraisalId } = req.params;

      const appraisal = await AppraisalService.getAppraisalById(schoolId, appraisalId);
      responseHelper.success(res, appraisal, 'Appraisal retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateAppraisal(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { appraisalId } = req.params;
      const updateData = req.body;

      const appraisal = await AppraisalService.updateAppraisal(schoolId, appraisalId, updateData);
      responseHelper.success(res, appraisal, 'Appraisal updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async submitAppraisal(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { appraisalId } = req.params;

      const appraisal = await AppraisalService.submitAppraisal(schoolId, appraisalId);
      responseHelper.success(res, appraisal, 'Appraisal submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async reviewAppraisal(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { appraisalId } = req.params;
      const reviewData = req.body;

      const appraisal = await AppraisalService.reviewAppraisal(schoolId, appraisalId, reviewData, userId);
      responseHelper.success(res, appraisal, 'Appraisal reviewed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async finalizeAppraisal(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { appraisalId } = req.params;
      const finalizeData = req.body;

      const appraisal = await AppraisalService.finalizeAppraisal(schoolId, appraisalId, finalizeData, userId);
      responseHelper.success(res, appraisal, 'Appraisal finalized successfully');
    } catch (error) {
      next(error);
    }
  }

  static async publishAppraisal(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { appraisalId } = req.params;

      const appraisal = await AppraisalService.publishAppraisal(schoolId, appraisalId);
      responseHelper.success(res, appraisal, 'Appraisal published successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeAppraisalHistory(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { employee } = req.query;
      const filters = req.query;

      if (!employee) {
        throw new AppError('Employee ID is required', 400);
      }

      const history = await AppraisalService.getEmployeeAppraisalHistory(schoolId, employee, filters);
      responseHelper.paginated(res, history.data, history.pagination, 'Appraisal history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAppraisalStatistics(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { appraisalType } = req.query;

      const statistics = await AppraisalService.getAppraisalStatistics(schoolId, appraisalType);
      responseHelper.success(res, statistics, 'Appraisal statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppraisalController;
