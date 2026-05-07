/**
 * Leave Management Routes
 * RBAC-enforced endpoints for leave operations
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const leaveManagementController = require('../controllers/leaveManagement.controller');

// Middleware
router.use(authenticate);

/**
 * Leave Request Routes
 */

// Create leave request
router.post(
  '/requests',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  leaveManagementController.createLeaveRequest
);

// Get leave requests
router.get(
  '/requests',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  leaveManagementController.getLeaveRequests
);

// Get leave request by ID
router.get(
  '/requests/:leaveId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  leaveManagementController.getLeaveById
);

// Update leave request
router.put(
  '/requests/:leaveId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  leaveManagementController.updateLeaveRequest
);

// Submit leave request
router.patch(
  '/requests/:leaveId/submit',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Leave = require('../models/Leave.model');
      const leave = await Leave.findByIdAndUpdate(
        req.params.leaveId,
        { status: 'SUBMITTED' },
        { new: true }
      );
      return res.json({ success: true, data: leave, message: 'Leave submitted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Cancel leave request
router.patch(
  '/requests/:leaveId/cancel',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Leave = require('../models/Leave.model');
      const leave = await Leave.findByIdAndUpdate(
        req.params.leaveId,
        { status: 'CANCELLED' },
        { new: true }
      );
      return res.json({ success: true, data: leave, message: 'Leave cancelled successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Leave Balance Routes
 */

// Get leave balance
router.get(
  '/balance',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'STUDENT', 'HR', 'SYSTEM']),
  leaveManagementController.getLeaveBalance
);

// Get balance summary
router.get(
  '/balance/summary/:userId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveBalance = require('../models/LeaveBalance.model');
      const balances = await LeaveBalance.find({
        userId: req.params.userId,
        schoolId: req.user.schoolId,
      })
        .populate('leaveTypeId', 'leaveTypeName leaveTypeCode')
        .lean();

      return res.json({ success: true, data: balances });
    } catch (error) {
      next(error);
    }
  }
);

// Get annual leave summary
router.get(
  '/balance/annual/:academicYear',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveBalance = require('../models/LeaveBalance.model');
      const balances = await LeaveBalance.find({
        schoolId: req.user.schoolId,
        academicYear: req.params.academicYear,
      })
        .populate('userId', 'firstName lastName email')
        .lean();

      return res.json({ success: true, data: balances });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Leave Approval Routes
 */

// Get approvals for specific leave
router.get(
  '/requests/:leaveId/approvals',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'SYSTEM']),
  leaveManagementController.getLeaveApprovals
);

// Approve leave
router.post(
  '/requests/:leaveId/approve',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'HR', 'SYSTEM']),
  leaveManagementController.approveLeave
);

// Reject leave
router.post(
  '/requests/:leaveId/reject',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'HR', 'SYSTEM']),
  leaveManagementController.rejectLeave
);

// Get pending leaves for approval
router.get(
  '/approvals/pending',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'HR', 'SYSTEM']),
  leaveManagementController.getPendingLeavesForApproval
);

// Get approvals status
router.get(
  '/approvals/status/:leaveId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveApproval = require('../models/LeaveApproval.model');
      const approvals = await LeaveApproval.find({
        leaveId: req.params.leaveId,
      })
        .populate('approverUserId', 'firstName lastName email')
        .lean();

      return res.json({ success: true, data: approvals });
    } catch (error) {
      next(error);
    }
  }
);

// Delegate approval
router.patch(
  '/approvals/:approvalId/delegate',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveApproval = require('../models/LeaveApproval.model');
      const approval = await LeaveApproval.findByIdAndUpdate(
        req.params.approvalId,
        {
          delegatedToUserId: req.body.delegatedToUserId,
          delegatedToName: req.body.delegatedToName,
          delegationReason: req.body.delegationReason,
        },
        { new: true }
      );

      return res.json({ success: true, data: approval });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Leave Type Routes
 */

// Get leave types
router.get(
  '/types',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveType = require('../models/LeaveType.model');
      const types = await LeaveType.find({
        schoolId: req.user.schoolId,
        status: 'ACTIVE',
      }).lean();

      return res.json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  }
);

// Get leave type by code
router.get(
  '/types/:leaveTypeCode',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveType = require('../models/LeaveType.model');
      const type = await LeaveType.findOne({
        schoolId: req.user.schoolId,
        leaveTypeCode: req.params.leaveTypeCode,
      }).lean();

      if (!type) {
        return res.status(404).json({ success: false, message: 'Leave type not found' });
      }

      return res.json({ success: true, data: type });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Leave Policy Routes
 */

// Get leave policies
router.get(
  '/policies',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  leaveManagementController.getLeavePolicy
);

// Get active policy
router.get(
  '/policies/active/:academicYear',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeavePolicy = require('../models/LeavePolicy.model');
      const policy = await LeavePolicy.findOne({
        schoolId: req.user.schoolId,
        academicYear: req.params.academicYear,
        status: 'ACTIVE',
      }).lean();

      return res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Analytics & Statistics Routes
 */

// Get leave statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  leaveManagementController.getLeaveStatistics
);

// Get monthly leave report
router.get(
  '/reports/monthly/:month/:year',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Leave = require('../models/Leave.model');
      const startDate = new Date(req.params.year, parseInt(req.params.month) - 1, 1);
      const endDate = new Date(req.params.year, parseInt(req.params.month), 0);

      const leaves = await Leave.find({
        schoolId: req.user.schoolId,
        fromDate: { $gte: startDate },
        toDate: { $lte: endDate },
        status: 'APPROVED',
      })
        .populate('leaveRequestBy', 'firstName lastName')
        .lean();

      return res.json({ success: true, data: leaves });
    } catch (error) {
      next(error);
    }
  }
);

// Get leave type usage
router.get(
  '/reports/usage/:academicYear',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const Leave = require('../models/Leave.model');
      const usage = await Leave.aggregate([
        {
          $match: {
            schoolId: require('mongoose').Types.ObjectId(req.user.schoolId),
            academicYear: req.params.academicYear,
            status: 'APPROVED',
          },
        },
        {
          $group: {
            _id: '$leaveTypeCode',
            totalDays: { $sum: '$duration' },
            count: { $sum: 1 },
          },
        },
      ]);

      return res.json({ success: true, data: usage });
    } catch (error) {
      next(error);
    }
  }
);

// Get pending approvals count
router.get(
  '/approvals/count/pending',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'HR', 'SYSTEM']),
  async (req, res, next) => {
    try {
      const LeaveApproval = require('../models/LeaveApproval.model');
      const count = await LeaveApproval.countDocuments({
        approverUserId: req.user._id,
        status: 'PENDING',
      });

      return res.json({ success: true, data: { pendingCount: count } });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
