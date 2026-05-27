const hrService = require('../services/hr.service');
const responseHelper = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

/**
 * Register new staff member
 * POST /api/v1/hr/staff
 */
exports.registerStaff = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const staff = await hrService.registerStaff(req.body, schoolId);
    responseHelper.created(res, staff, 'Staff registered successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all staff members
 * GET /api/v1/hr/staff
 */
exports.getAllStaff = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hrService.getAllStaff(schoolId, req.query);
    responseHelper.paginated(res, result.staff, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Staff retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get staff by ID
 * GET /api/v1/hr/staff/:staffId
 */
exports.getStaffById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const staff = await hrService.getStaffById(req.params.staffId, schoolId);
    responseHelper.success(res, staff, 'Staff details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update staff details
 * PUT /api/v1/hr/staff/:staffId
 */
exports.updateStaff = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const staff = await hrService.updateStaff(req.params.staffId, {
      ...req.body,
      performedBy: userId
    }, schoolId);
    responseHelper.success(res, staff, 'Staff updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate staff member
 * PATCH /api/v1/hr/staff/:staffId/deactivate
 */
exports.deactivateStaff = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const staff = await hrService.deactivateStaff(req.params.staffId, schoolId, req.body.reason);
    responseHelper.success(res, staff, 'Staff deactivated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create salary structure
 * POST /api/v1/hr/salary-structures
 */
exports.createSalaryStructure = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const structure = await hrService.createSalaryStructure(req.body, schoolId);
    responseHelper.created(res, structure, 'Salary structure created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all salary structures
 * GET /api/v1/hr/salary-structures
 */
exports.getAllSalaryStructures = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hrService.getAllSalaryStructures(schoolId, req.query);
    responseHelper.paginated(res, result.structures, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Salary structures retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Process payroll
 * POST /api/v1/hr/payroll
 */
exports.processPayroll = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const payroll = await hrService.processPayroll(req.body.staffId, req.body, schoolId);
    responseHelper.created(res, payroll, 'Payroll processed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get payroll records
 * GET /api/v1/hr/payroll
 */
exports.getPayrollRecords = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hrService.getPayrollRecords(schoolId, req.query);
    responseHelper.paginated(res, result.payrolls, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Payroll records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Approve payroll
 * PATCH /api/v1/hr/payroll/:payrollId/approve
 */
exports.approvePayroll = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const payroll = await hrService.approvePayroll(req.params.payrollId, schoolId, {
      approvedBy: userId,
      ...req.body
    });
    responseHelper.success(res, payroll, 'Payroll approved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark staff attendance
 * POST /api/v1/hr/attendance
 */
exports.markAttendance = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const attendance = await hrService.markAttendance(req.body.staffId, {
      ...req.body,
      markedBy: userId
    }, schoolId);
    responseHelper.created(res, attendance, 'Attendance marked successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get attendance records
 * GET /api/v1/hr/attendance
 */
exports.getAttendanceRecords = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hrService.getAttendanceRecords(schoolId, req.query);
    responseHelper.paginated(res, result.records, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Attendance records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create performance appraisal
 * POST /api/v1/hr/appraisals
 */
exports.createAppraisal = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const appraisal = await hrService.createAppraisal(req.body.staffId, {
      ...req.body,
      appraisedBy: userId
    }, schoolId);
    responseHelper.created(res, appraisal, 'Performance appraisal created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get appraisals
 * GET /api/v1/hr/appraisals
 */
exports.getAppraisals = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hrService.getAppraisals(schoolId, req.query);
    responseHelper.paginated(res, result.appraisals, {
      page: result.page,
      limit: result.limit,
      total: result.total
    }, 'Appraisals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get HR statistics
 * GET /api/v1/hr/statistics
 */
exports.getHRStatistics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const stats = await hrService.getHRStatistics(schoolId);
    responseHelper.success(res, stats, 'HR statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
