/**
 * Leave Management Controller
 * Request handlers for leave operations
 */

const leaveManagementService = require('../services/leaveManagement.service');
const { validateRequest } = require('../utils/validation.helper');
const { ResponseHelper } = require('../utils/response.helper');
const {
  createLeaveRequestSchema,
  updateLeaveRequestSchema,
  getLeaveRequestsSchema,
  getLeaveBalanceSchema,
  createLeaveApprovalSchema,
  approveLeaveSchema,
  rejectLeaveSchema,
  getLeaveApprovalsSchema,
  createLeaveTypeSchema,
  getLeave PolicySchema,
  getPendingLeavesSchema,
  getLeaveStatisticsSchema,
} = require('../validations/leaveManagement.validation');

/**
 * Create leave request
 * POST /leave-management/requests
 */
exports.createLeaveRequest = async (req, res, next) => {
  try {
    await validateRequest(req.body, createLeaveRequestSchema);
    const leave = await leaveManagementService.createLeaveRequest(
      { ...req.body, leaveRequestBy: req.user._id },
      req.user.schoolId
    );
    return ResponseHelper.created(res, leave, 'Leave request created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave requests
 * GET /leave-management/requests
 */
exports.getLeaveRequests = async (req, res, next) => {
  try {
    await validateRequest(req.query, getLeaveRequestsSchema);
    const result = await leaveManagementService.getLeaveRequests(req.user.schoolId, req.query);
    return ResponseHelper.paginated(
      res,
      result.leaves,
      result.total,
      result.page,
      result.limit,
      'Leave requests retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave request by ID
 * GET /leave-management/requests/:leaveId
 */
exports.getLeaveById = async (req, res, next) => {
  try {
    const leave = await leaveManagementService.getLeaveById(
      req.params.leaveId,
      req.user.schoolId
    );
    return ResponseHelper.success(res, leave, 'Leave request retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update leave request
 * PUT /leave-management/requests/:leaveId
 */
exports.updateLeaveRequest = async (req, res, next) => {
  try {
    await validateRequest(req.body, updateLeaveRequestSchema);
    const leave = await leaveManagementService.updateLeaveRequest(
      req.params.leaveId,
      req.user.schoolId,
      { ...req.body, performedBy: req.user._id }
    );
    return ResponseHelper.success(res, leave, 'Leave request updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave balance
 * GET /leave-management/balance
 */
exports.getLeaveBalance = async (req, res, next) => {
  try {
    await validateRequest(req.query, getLeaveBalanceSchema);
    const balance = await leaveManagementService.getLeaveBalance(
      req.query.userId || req.user._id,
      req.user.schoolId,
      req.query.academicYear,
      req.query.leaveTypeCode
    );
    return ResponseHelper.success(res, balance, 'Leave balance retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create leave approval
 * POST /leave-management/approvals
 */
exports.createLeaveApproval = async (req, res, next) => {
  try {
    await validateRequest(req.body, createLeaveApprovalSchema);
    const approval = await leaveManagementService.createLeaveApproval(
      req.body,
      req.user.schoolId
    );
    return ResponseHelper.created(res, approval, 'Approval entry created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave approvals
 * GET /leave-management/requests/:leaveId/approvals
 */
exports.getLeaveApprovals = async (req, res, next) => {
  try {
    await validateRequest(req.query, getLeaveApprovalsSchema);
    const result = await leaveManagementService.getLeaveApprovals(
      req.params.leaveId,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.approvals,
      result.total,
      result.page,
      result.limit,
      'Approvals retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Approve leave
 * POST /leave-management/requests/:leaveId/approve
 */
exports.approveLeave = async (req, res, next) => {
  try {
    await validateRequest(req.body, approveLeaveSchema);
    const leave = await leaveManagementService.approveLeave(
      req.params.leaveId,
      req.user.schoolId,
      req.user._id,
      req.body.remarks
    );
    return ResponseHelper.success(res, leave, 'Leave approved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Reject leave
 * POST /leave-management/requests/:leaveId/reject
 */
exports.rejectLeave = async (req, res, next) => {
  try {
    await validateRequest(req.body, rejectLeaveSchema);
    const leave = await leaveManagementService.rejectLeave(
      req.params.leaveId,
      req.user.schoolId,
      req.user._id,
      req.body.rejectionReason
    );
    return ResponseHelper.success(res, leave, 'Leave rejected successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave policy
 * GET /leave-management/policies
 */
exports.getLeavePolicy = async (req, res, next) => {
  try {
    await validateRequest(req.query, getLeave PolicySchema);
    const result = await leaveManagementService.getLeavePolicy(req.user.schoolId, req.query);
    return ResponseHelper.paginated(
      res,
      result.policies,
      result.total,
      result.page,
      result.limit,
      'Policies retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending leaves for approval
 * GET /leave-management/approvals/pending
 */
exports.getPendingLeavesForApproval = async (req, res, next) => {
  try {
    await validateRequest(req.query, getPendingLeavesSchema);
    const result = await leaveManagementService.getPendingLeavesForApproval(
      req.user._id,
      req.user.schoolId,
      req.query
    );
    return ResponseHelper.paginated(
      res,
      result.leaves,
      result.total,
      result.page,
      result.limit,
      'Pending leaves retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave statistics
 * GET /leave-management/statistics
 */
exports.getLeaveStatistics = async (req, res, next) => {
  try {
    await validateRequest(req.query, getLeaveStatisticsSchema);
    const stats = await leaveManagementService.getLeaveStatistics(req.user.schoolId, req.query);
    return ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
