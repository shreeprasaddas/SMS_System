/**
 * Leave Management Service
 * Business logic for leave operations
 */

const Leave = require('../models/Leave.model');
const LeaveType = require('../models/LeaveType.model');
const LeaveBalance = require('../models/LeaveBalance.model');
const LeaveApproval = require('../models/LeaveApproval.model');
const LeavePolicy = require('../models/LeavePolicy.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create leave request
 */
exports.createLeaveRequest = async (data, schoolId) => {
  try {
    const leave = await Leave.create({
      ...data,
      schoolId,
    });

    return leave;
  } catch (error) {
    throw new AppError('Failed to create leave request', 400);
  }
};

/**
 * Get all leave requests with pagination
 */
exports.getLeaveRequests = async (schoolId, filters = {}) => {
  try {
    const { userId, status, leaveTypeCode, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (userId) query.leaveRequestBy = userId;
    if (status) query.status = status;
    if (leaveTypeCode) query.leaveTypeCode = leaveTypeCode;

    const skip = (page - 1) * limit;
    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate('leaveRequestBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Leave.countDocuments(query),
    ]);

    return { leaves, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve leave requests', 400);
  }
};

/**
 * Get leave request by ID
 */
exports.getLeaveById = async (leaveId, schoolId) => {
  try {
    const leave = await Leave.findOne({ _id: leaveId, schoolId })
      .populate('leaveRequestBy', 'firstName lastName email role')
      .populate('leaveType')
      .lean();

    if (!leave) throw new AppError('Leave request not found', 404);
    return leave;
  } catch (error) {
    throw error;
  }
};

/**
 * Update leave request
 */
exports.updateLeaveRequest = async (leaveId, schoolId, updateData) => {
  try {
    const leave = await Leave.findOneAndUpdate(
      { _id: leaveId, schoolId },
      {
        $set: updateData,
        $push: {
          auditLog: {
            action: 'LEAVE_UPDATED',
            performedBy: updateData.performedBy,
            timestamp: new Date(),
            changes: updateData,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!leave) throw new AppError('Leave request not found', 404);
    return leave;
  } catch (error) {
    throw error;
  }
};

/**
 * Get leave balance for user
 */
exports.getLeaveBalance = async (userId, schoolId, academicYear, leaveTypeCode) => {
  try {
    const query = { userId, schoolId, academicYear };
    if (leaveTypeCode) query.leaveTypeCode = leaveTypeCode;

    const balances = await LeaveBalance.find(query)
      .populate('leaveTypeId')
      .lean();

    if (!balances || balances.length === 0) {
      throw new AppError('Leave balance not found', 404);
    }

    return leaveTypeCode ? balances[0] : balances;
  } catch (error) {
    throw error;
  }
};

/**
 * Update leave balance
 */
exports.updateLeaveBalance = async (userId, schoolId, academicYear, leaveTypeCode, daysUsed) => {
  try {
    const balance = await LeaveBalance.findOneAndUpdate(
      { userId, schoolId, academicYear, leaveTypeCode },
      {
        $set: { usedDays: Math.min(daysUsed, this.allocatedDays) },
        $push: {
          auditLog: {
            action: 'BALANCE_UPDATED',
            performedBy: null,
            timestamp: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!balance) throw new AppError('Leave balance not found', 404);
    return balance;
  } catch (error) {
    throw new AppError('Failed to update leave balance', 400);
  }
};

/**
 * Create leave approval entry
 */
exports.createLeaveApproval = async (data, schoolId) => {
  try {
    const approval = await LeaveApproval.create({
      ...data,
      schoolId,
    });

    return approval;
  } catch (error) {
    throw new AppError('Failed to create approval entry', 400);
  }
};

/**
 * Get leave approvals for request
 */
exports.getLeaveApprovals = async (leaveId, schoolId, filters = {}) => {
  try {
    const { status, page = 1, limit = 20 } = filters;
    const query = { leaveId, schoolId };

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [approvals, total] = await Promise.all([
      LeaveApproval.find(query)
        .populate('approverUserId', 'firstName lastName email')
        .sort({ approvalLevel: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LeaveApproval.countDocuments(query),
    ]);

    return { approvals, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve approvals', 400);
  }
};

/**
 * Approve leave
 */
exports.approveLeave = async (leaveId, schoolId, approverId, remarks) => {
  try {
    const leave = await Leave.findById(leaveId);
    if (!leave) throw new AppError('Leave not found', 404);

    // Update leave status
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status: 'APPROVED',
          'approvalDetails.approvedBy': approverId,
          'approvalDetails.approvedDate': new Date(),
          'approvalDetails.approvalRemarks': remarks,
        },
        $push: {
          auditLog: {
            action: 'LEAVE_APPROVED',
            performedBy: approverId,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    // Update approval status
    await LeaveApproval.updateOne(
      { leaveId, approverUserId: approverId },
      {
        $set: {
          status: 'APPROVED',
          actionTakenDate: new Date(),
          approvalRemarks: remarks,
        },
      }
    );

    return updatedLeave;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject leave
 */
exports.rejectLeave = async (leaveId, schoolId, approverId, rejectionReason) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status: 'REJECTED',
          'approvalDetails.rejectedBy': approverId,
          'approvalDetails.rejectedDate': new Date(),
          'approvalDetails.rejectionReason': rejectionReason,
        },
        $push: {
          auditLog: {
            action: 'LEAVE_REJECTED',
            performedBy: approverId,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedLeave) throw new AppError('Leave not found', 404);

    await LeaveApproval.updateOne(
      { leaveId, approverUserId: approverId },
      {
        $set: {
          status: 'REJECTED',
          actionTakenDate: new Date(),
          rejectionReason: rejectionReason,
        },
      }
    );

    return updatedLeave;
  } catch (error) {
    throw error;
  }
};

/**
 * Get leave policy
 */
exports.getLeavePolicy = async (schoolId, filters = {}) => {
  try {
    const { academicYear, status, page = 1, limit = 20 } = filters;
    const query = { schoolId };

    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [policies, total] = await Promise.all([
      LeavePolicy.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LeavePolicy.countDocuments(query),
    ]);

    return { policies, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve policies', 400);
  }
};

/**
 * Get pending leaves for approval
 */
exports.getPendingLeavesForApproval = async (approverId, schoolId, filters = {}) => {
  try {
    const { page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const [leaves, total] = await Promise.all([
      LeaveApproval.find({
        approverUserId: approverId,
        status: 'PENDING',
      })
        .populate('leaveId')
        .populate('leaveId.leaveRequestBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LeaveApproval.countDocuments({
        approverUserId: approverId,
        status: 'PENDING',
      }),
    ]);

    return { leaves, total, page: Number(page), limit: Number(limit) };
  } catch (error) {
    throw new AppError('Failed to retrieve pending leaves', 400);
  }
};

/**
 * Get leave statistics
 */
exports.getLeaveStatistics = async (schoolId, filters = {}) => {
  try {
    const { userId, academicYear } = filters;
    const query = { schoolId };

    if (userId) query.leaveRequestBy = userId;
    if (academicYear) query.academicYear = academicYear;

    const [totalLeaves, approvedLeaves, rejectedLeaves, pendingLeaves] = await Promise.all([
      Leave.countDocuments(query),
      Leave.countDocuments({ ...query, status: 'APPROVED' }),
      Leave.countDocuments({ ...query, status: 'REJECTED' }),
      Leave.countDocuments({ ...query, status: 'SUBMITTED' }),
    ]);

    return {
      totalLeaves,
      approvedLeaves,
      rejectedLeaves,
      pendingLeaves,
    };
  } catch (error) {
    throw new AppError('Failed to retrieve statistics', 400);
  }
};
