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
  }

  /**
   * Get salary structure by ID
   * GET /api/v1/hr/salary-structures/:structureId
   */
  static async getSalaryStructureById(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { structureId } = req.params;

      const structure = await HRService.getSalaryStructureById(schoolId, structureId);

      responseHelper.success(res, structure, 'Salary structure retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve salary structure
   * PATCH /api/v1/hr/salary-structures/:structureId/approve
   */
  static async approveSalaryStructure(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { structureId } = req.params;

      const structure = await HRService.approveSalaryStructure(schoolId, structureId, userId);

      responseHelper.success(res, structure, 'Salary structure approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create leave request
   * POST /api/v1/hr/leave-requests
   */
  static async createLeaveRequest(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const leaveData = req.body;

      const leaveRequest = await LeaveService.createLeaveRequest(schoolId, leaveData, userId);

      responseHelper.created(res, leaveRequest, 'Leave request created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit leave request
   * PATCH /api/v1/hr/leave-requests/:leaveRequestId/submit
   */
  static async submitLeaveRequest(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { leaveRequestId } = req.params;

      const leaveRequest = await LeaveService.submitLeaveRequest(schoolId, leaveRequestId);

      responseHelper.success(res, leaveRequest, 'Leave request submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get leave requests
   * GET /api/v1/hr/leave-requests
   */
  static async getLeaveRequests(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await LeaveService.getLeaveRequests(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Leave requests retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve leave request
   * PATCH /api/v1/hr/leave-requests/:leaveRequestId/approve
   */
  static async approveLeaveRequest(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { leaveRequestId } = req.params;

      const leaveRequest = await LeaveService.approveLeaveRequest(schoolId, leaveRequestId, userId);

      responseHelper.success(res, leaveRequest, 'Leave request approved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject leave request
   * PATCH /api/v1/hr/leave-requests/:leaveRequestId/reject
   */
  static async rejectLeaveRequest(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { leaveRequestId } = req.params;
      const { rejectionReason } = req.body;

      const leaveRequest = await LeaveService.rejectLeaveRequest(
        schoolId,
        leaveRequestId,
        rejectionReason,
        userId
      );

      responseHelper.success(res, leaveRequest, 'Leave request rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get leave balance
   * GET /api/v1/hr/leave-balance
   */
  static async getLeaveBalance(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { employee, academicYear } = req.query;

      if (!employee || !academicYear) {
        throw new AppError('Employee and academic year are required', 400);
      }

      const balance = await LeaveService.getLeaveBalance(schoolId, employee, academicYear);

      responseHelper.success(res, balance, 'Leave balance retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create appraisal
   * POST /api/v1/hr/appraisals
   */
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

  /**
   * Get appraisals
   * GET /api/v1/hr/appraisals
   */
  static async getAppraisals(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await AppraisalService.getAppraisals(schoolId, filters);

      responseHelper.paginated(
        res,
        result.data,
        result.pagination,
        'Appraisals retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get appraisal by ID
   * GET /api/v1/hr/appraisals/:appraisalId
   */
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

  /**
   * Review appraisal
   * PATCH /api/v1/hr/appraisals/:appraisalId/review
   */
  static async reviewAppraisal(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { appraisalId } = req.params;
      const reviewData = req.body;

      const appraisal = await AppraisalService.reviewAppraisal(
        schoolId,
        appraisalId,
        reviewData,
        userId
      );

      responseHelper.success(res, appraisal, 'Appraisal reviewed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Finalize appraisal
   * PATCH /api/v1/hr/appraisals/:appraisalId/finalize
   */
  static async finalizeAppraisal(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const { appraisalId } = req.params;
      const finalizeData = req.body;

      const appraisal = await AppraisalService.finalizeAppraisal(
        schoolId,
        appraisalId,
        finalizeData,
        userId
      );

      responseHelper.success(res, appraisal, 'Appraisal finalized successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish appraisal
   * PATCH /api/v1/hr/appraisals/:appraisalId/publish
   */
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

  /**
   * Get HR dashboard
   * GET /api/v1/hr/dashboard
   */
  static async getHRDashboard(req, res, next) {
    try {
      const { schoolId } = req.user;

      const stats = await HRService.getHRDashboardStats(schoolId);

      responseHelper.success(res, stats, 'HR dashboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HRController;
