const leaveService = require('../services/leave.service');
const { validateRequest } = require('../middleware/validate');
const { ResponseHelper } = require('../utils/responseHelper');
const leaveValidation = require('../validations/leave.validation');
const { AppError } = require('../utils/errorHelper');

/**
 * Create leave type
 * @route POST /api/v1/leave/types
 * @access ADMIN, PRINCIPAL
 */
exports.createLeaveType = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.createLeaveTypeSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const leaveType = await leaveService.createLeaveType(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, leaveType, 'Leave type created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all leave types
 * @route GET /api/v1/leave/types
 * @access ALL_ROLES
 */
exports.getAllLeaveTypes = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leaveTypeFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { types, total } = await leaveService.getAllLeaveTypes(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      types,
      total,
      value.page,
      value.limit,
      'Leave types fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create leave policy
 * @route POST /api/v1/leave/policies
 * @access ADMIN, PRINCIPAL
 */
exports.createLeavePolicy = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.createLeavePolicySchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const policy = await leaveService.createLeavePolicy(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, policy, 'Leave policy created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all leave policies
 * @route GET /api/v1/leave/policies
 * @access ALL_ROLES
 */
exports.getAllLeavePolicies = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leavePolicyFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { policies, total } = await leaveService.getAllLeavePolicies(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      policies,
      total,
      value.page,
      value.limit,
      'Leave policies fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Apply for leave
 * @route POST /api/v1/leave/applications
 * @access TEACHER, STAFF
 */
exports.applyForLeave = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.createLeaveApplicationSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const application = await leaveService.applyForLeave(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, application, 'Leave application created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all leave applications
 * @route GET /api/v1/leave/applications
 * @access ADMIN, PRINCIPAL, HOD
 */
exports.getAllLeaveApplications = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leaveApplicationFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { applications, total } = await leaveService.getAllLeaveApplications(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      applications,
      total,
      value.page,
      value.limit,
      'Leave applications fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Submit leave application
 * @route PUT /api/v1/leave/applications/:applicationId/submit
 * @access TEACHER, STAFF
 */
exports.submitLeaveApplication = async (req, res, next) => {
  try {
    const application = await leaveService.submitLeaveApplication(
      req.user.schoolId,
      req.params.applicationId
    );

    return ResponseHelper.success(res, application, 'Leave application submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Approve leave application
 * @route PUT /api/v1/leave/applications/:applicationId/approve
 * @access ADMIN, PRINCIPAL, HOD
 */
exports.approveLeaveApplication = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.approveLeaveApplicationSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const application = await leaveService.approveLeaveApplication(
      req.user.schoolId,
      req.params.applicationId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, application, 'Leave application approved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Reject leave application
 * @route PUT /api/v1/leave/applications/:applicationId/reject
 * @access ADMIN, PRINCIPAL, HOD
 */
exports.rejectLeaveApplication = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.rejectLeaveApplicationSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const application = await leaveService.rejectLeaveApplication(
      req.user.schoolId,
      req.params.applicationId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, application, 'Leave application rejected successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending approvals
 * @route GET /api/v1/leave/approvals/pending
 * @access ADMIN, PRINCIPAL, HOD
 */
exports.getPendingApprovals = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leaveApprovalFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { approvals, total } = await leaveService.getPendingApprovals(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      approvals,
      total,
      value.page,
      value.limit,
      'Pending approvals fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Approve leave at level
 * @route PUT /api/v1/leave/approvals/:approvalId/approve
 * @access ADMIN, PRINCIPAL, HOD
 */
exports.approveLeaveAtLevel = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.approveLeaveAtLevelSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const approval = await leaveService.approveLeaveAtLevel(
      req.user.schoolId,
      req.params.approvalId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, approval, 'Leave approved at level successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave balance
 * @route GET /api/v1/leave/balance/:userId/:academicYearId
 * @access TEACHER, STAFF, ADMIN, PRINCIPAL
 */
exports.getLeaveBalance = async (req, res, next) => {
  try {
    const balance = await leaveService.getLeaveBalance(
      req.user.schoolId,
      req.params.userId,
      req.params.academicYearId
    );

    return ResponseHelper.success(res, balance, 'Leave balance fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get leave statistics
 * @route GET /api/v1/leave/statistics
 * @access ADMIN, PRINCIPAL
 */
exports.getLeaveStatistics = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leaveStatisticsFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const statistics = await leaveService.getLeaveStatistics(
      req.user.schoolId,
      value.academicYearId
    );

    return ResponseHelper.success(res, statistics, 'Leave statistics fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get my leave applications
 * @route GET /api/v1/leave/my-applications
 * @access TEACHER, STAFF
 */
exports.getMyLeaveApplications = async (req, res, next) => {
  try {
    const { error, value } = leaveValidation.leaveApplicationFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    value.userId = req.user._id;

    const { applications, total } = await leaveService.getAllLeaveApplications(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      applications,
      total,
      value.page,
      value.limit,
      'Your leave applications fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
