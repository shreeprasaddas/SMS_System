/**
 * Payroll Controller
 * HTTP request handlers for payroll management
 */

const PayrollService = require('../services/payroll.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class PayrollController {
  /**
   * Create payroll
   * POST /api/v1/payroll
   */
  static async createPayroll(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const payrollData = req.body;

      const payroll = await PayrollService.createPayroll(schoolId, payrollData, userId);

      responseHelper.created(res, payroll, 'Payroll created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payrolls
   * GET /api/v1/payroll
   */
  static async getPayrolls(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await PayrollService.getPayrolls(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Payrolls retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payroll by ID
   * GET /api/v1/payroll/:payrollId
   */
  static async getPayrollById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { payrollId } = req.params;

      const payroll = await PayrollService.getPayrollById(schoolId, payrollId);

      responseHelper.success(res, payroll, 'Payroll retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process payroll
   * PATCH /api/v1/payroll/:payrollId/process
   */
  static async processPayroll(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { payrollId } = req.params;
      const processData = req.body;

      const payroll = await PayrollService.processPayroll(schoolId, payrollId, processData, userId);

      responseHelper.success(res, payroll, 'Payroll processed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve payroll
   * PATCH /api/v1/payroll/:payrollId/approve
   */
  static async approvePayroll(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { payrollId } = req.params;

      const payroll = await PayrollService.approvePayroll(schoolId, payrollId, userId);

      responseHelper.success(res, payroll, 'Payroll approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate payslip
   * POST /api/v1/payroll/:payrollId/payslip
   */
  static async generatePayslip(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { payrollId } = req.params;

      const payslip = await PayrollService.generatePayslip(schoolId, payrollId, userId);

      responseHelper.created(res, payslip, 'Payslip generated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payslip
   * GET /api/v1/payroll/payslip/:payslipId
   */
  static async getPayslip(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { payslipId } = req.params;

      const payslip = await PayrollService.getPayslip(schoolId, payslipId);

      responseHelper.success(res, payslip, 'Payslip retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send payslips
   * POST /api/v1/payroll/send-payslips
   */
  static async sendPayslips(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { payrollMonth, payrollYear } = req.body;

      const result = await PayrollService.sendPayslips(schoolId, payrollMonth, payrollYear, userId);

      responseHelper.success(res, result, 'Payslips sent successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark payroll as paid
   * PATCH /api/v1/payroll/:payrollId/mark-paid
   */
  static async markPayrollAsPaid(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { payrollId } = req.params;
      const paymentData = req.body;

      const payroll = await PayrollService.markPayrollAsPaid(
        schoolId,
        payrollId,
        paymentData,
        userId
      );

      responseHelper.success(res, payroll, 'Payroll marked as paid successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payroll summary
   * GET /api/v1/payroll/summary
   */
  static async getPayrollSummary(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { payrollMonth, payrollYear } = req.query;

      if (!payrollMonth || !payrollYear) {
        throw new AppError('Payroll month and year are required', 400);
      }

      const summary = await PayrollService.getPayrollSummary(schoolId, payrollMonth, payrollYear);

      responseHelper.success(res, summary, 'Payroll summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PayrollController;
