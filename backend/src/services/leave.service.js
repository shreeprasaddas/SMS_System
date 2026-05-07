const LeaveType = require('../models/leave/LeaveType.model');
const LeavePolicy = require('../models/leave/LeavePolicy.model');
const LeaveApplication = require('../models/leave/LeaveApplication.model');
const LeaveApproval = require('../models/leave/LeaveApproval.model');
const LeaveBalance = require('../models/leave/LeaveBalance.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create leave type
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createLeaveType = async (schoolId, data, userId) => {
  const leaveType = await LeaveType.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return leaveType;
};

/**
 * Get all leave types
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{types: Array, total: number}>}
 */
exports.getAllLeaveTypes = async (schoolId, filters) => {
  const { status, category, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (category) filterObj.leaveCategory = category;

  const skip = (page - 1) * limit;

  const [types, total] = await Promise.all([
    LeaveType.find(filterObj)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    LeaveType.countDocuments(filterObj)
  ]);

  return { types, total };
};

/**
 * Create leave policy
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createLeavePolicy = async (schoolId, data, userId) => {
  const policy = await LeavePolicy.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return policy;
};

/**
 * Get all leave policies
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{policies: Array, total: number}>}
 */
exports.getAllLeavePolicies = async (schoolId, filters) => {
  const { status, academicYearId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (academicYearId) filterObj.academicYearId = academicYearId;

  const skip = (page - 1) * limit;

  const [policies, total] = await Promise.all([
    LeavePolicy.find(filterObj)
      .populate('academicYearId', 'yearName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    LeavePolicy.countDocuments(filterObj)
  ]);

  return { policies, total };
};

/**
 * Apply for leave
 * @param {string} schoolId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.applyForLeave = async (schoolId, data, userId) => {
  const application = await LeaveApplication.create({
    ...data,
    schoolId,
    userId,
    createdBy: userId
  });
  return application;
};

/**
 * Get all leave applications
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{applications: Array, total: number}>}
 */
exports.getAllLeaveApplications = async (schoolId, filters) => {
  const { status, userId, leaveTypeId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.applicationStatus = status;
  if (userId) filterObj.userId = userId;
  if (leaveTypeId) filterObj.leaveTypeId = leaveTypeId;

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    LeaveApplication.find(filterObj)
      .populate('userId', 'firstName lastName')
      .populate('leaveTypeId', 'leaveTypeName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    LeaveApplication.countDocuments(filterObj)
  ]);

  return { applications, total };
};

/**
 * Submit leave application
 * @param {string} schoolId
 * @param {string} applicationId
 * @returns {Promise<Object>}
 */
exports.submitLeaveApplication = async (schoolId, applicationId) => {
  const application = await LeaveApplication.findOneAndUpdate(
    { _id: applicationId, schoolId },
    { $set: { applicationStatus: 'SUBMITTED', submittedDate: new Date() } },
    { new: true }
  );

  if (!application) throw new AppError('Leave application not found', 404);

  return application;
};

/**
 * Approve leave application
 * @param {string} schoolId
 * @param {string} applicationId
 * @param {Object} approvalData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.approveLeaveApplication = async (schoolId, applicationId, approvalData, userId) => {
  const application = await LeaveApplication.findOneAndUpdate(
    { _id: applicationId, schoolId },
    {
      $set: {
        applicationStatus: 'APPROVED',
        finalApprovedBy: userId,
        finalApprovedDate: new Date()
      },
      $push: { approvalHistory: { approverUserId: userId, action: 'APPROVED', ...approvalData } }
    },
    { new: true }
  );

  if (!application) throw new AppError('Leave application not found', 404);

  return application;
};

/**
 * Reject leave application
 * @param {string} schoolId
 * @param {string} applicationId
 * @param {Object} rejectionData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.rejectLeaveApplication = async (schoolId, applicationId, rejectionData, userId) => {
  const application = await LeaveApplication.findOneAndUpdate(
    { _id: applicationId, schoolId },
    {
      $set: {
        applicationStatus: 'REJECTED',
        rejectionReason: rejectionData.reason,
        rejectedBy: userId,
        rejectionDate: new Date()
      }
    },
    { new: true }
  );

  if (!application) throw new AppError('Leave application not found', 404);

  return application;
};

/**
 * Create leave approval task
 * @param {string} schoolId
 * @param {string} applicationId
 * @param {Object} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.createLeaveApproval = async (schoolId, applicationId, data, userId) => {
  const approval = await LeaveApproval.create({
    ...data,
    schoolId,
    leaveApplicationId: applicationId,
    createdBy: userId
  });
  return approval;
};

/**
 * Get pending approvals
 * @param {string} schoolId
 * @param {Object} filters
 * @returns {Promise<{approvals: Array, total: number}>}
 */
exports.getPendingApprovals = async (schoolId, filters) => {
  const { approvalLevel, assignedToUserId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId, assignmentStatus: 'PENDING' };
  if (approvalLevel) filterObj.approvalLevel = approvalLevel;
  if (assignedToUserId) filterObj.assignedToUserId = assignedToUserId;

  const skip = (page - 1) * limit;

  const [approvals, total] = await Promise.all([
    LeaveApproval.find(filterObj)
      .populate('leaveApplicationId', 'applicationCode userName leaveStartDate leaveEndDate')
      .populate('userId', 'firstName lastName')
      .populate('assignedToUserId', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ assignedDate: 1 })
      .lean(),
    LeaveApproval.countDocuments(filterObj)
  ]);

  return { approvals, total };
};

/**
 * Approve leave at given level
 * @param {string} schoolId
 * @param {string} approvalId
 * @param {Object} approvalData
 * @param {string} userId
 * @returns {Promise<Object>}
 */
exports.approveLeaveAtLevel = async (schoolId, approvalId, approvalData, userId) => {
  const approval = await LeaveApproval.findOneAndUpdate(
    { _id: approvalId, schoolId },
    {
      $set: {
        assignmentStatus: 'REVIEWED',
        approvalDecision: 'APPROVED',
        reviewedDate: new Date(),
        reviewComments: approvalData.comments,
        decidedBy: userId,
        decisionDate: new Date()
      },
      $push: {
        auditTrail: {
          action: 'APPROVED_AT_LEVEL',
          performedBy: userId,
          timestamp: new Date(),
          details: approvalData.comments
        }
      }
    },
    { new: true }
  );

  if (!approval) throw new AppError('Leave approval not found', 404);

  return approval;
};

/**
 * Get leave balance for user
 * @param {string} schoolId
 * @param {string} userId
 * @param {string} academicYearId
 * @returns {Promise<Object>}
 */
exports.getLeaveBalance = async (schoolId, userId, academicYearId) => {
  const balance = await LeaveBalance.findOne({
    schoolId,
    userId,
    academicYearId
  });

  if (!balance) throw new AppError('Leave balance not found', 404);

  return balance;
};

/**
 * Update leave balance
 * @param {string} schoolId
 * @param {string} userId
 * @param {string} academicYearId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
exports.updateLeaveBalance = async (schoolId, userId, academicYearId, updateData) => {
  const balance = await LeaveBalance.findOneAndUpdate(
    { schoolId, userId, academicYearId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!balance) throw new AppError('Leave balance not found', 404);

  return balance;
};

/**
 * Get leave statistics
 * @param {string} schoolId
 * @param {string} academicYearId
 * @returns {Promise<Object>}
 */
exports.getLeaveStatistics = async (schoolId, academicYearId) => {
  const totalApplications = await LeaveApplication.countDocuments({
    schoolId
  });

  const approvedApplications = await LeaveApplication.countDocuments({
    schoolId,
    applicationStatus: 'APPROVED'
  });

  const rejectedApplications = await LeaveApplication.countDocuments({
    schoolId,
    applicationStatus: 'REJECTED'
  });

  const pendingApplications = await LeaveApplication.countDocuments({
    schoolId,
    applicationStatus: 'PENDING'
  });

  const leaveTypes = await LeaveType.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  const leavePolicies = await LeavePolicy.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  return {
    totalApplications,
    approvedApplications,
    rejectedApplications,
    pendingApplications,
    approvalRate: totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(2) : 0,
    activeLeaveTypes: leaveTypes,
    activePolicies: leavePolicies
  };
};

module.exports = exports;
