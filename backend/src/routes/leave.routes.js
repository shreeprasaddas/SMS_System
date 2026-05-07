const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const leaveController = require('../controllers/leave.controller');

/**
 * Leave Type Routes
 */
router.post(
  '/types',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL']),
  leaveController.createLeaveType
);

router.get(
  '/types',
  authenticate,
  leaveController.getAllLeaveTypes
);

/**
 * Leave Policy Routes
 */
router.post(
  '/policies',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL']),
  leaveController.createLeavePolicy
);

router.get(
  '/policies',
  authenticate,
  leaveController.getAllLeavePolicies
);

/**
 * Leave Application Routes
 */
router.post(
  '/applications',
  authenticate,
  authorize(['TEACHER', 'STAFF', 'ADMIN']),
  leaveController.applyForLeave
);

router.get(
  '/applications',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.getAllLeaveApplications
);

router.get(
  '/my-applications',
  authenticate,
  authorize(['TEACHER', 'STAFF']),
  leaveController.getMyLeaveApplications
);

router.put(
  '/applications/:applicationId/submit',
  authenticate,
  authorize(['TEACHER', 'STAFF']),
  leaveController.submitLeaveApplication
);

router.put(
  '/applications/:applicationId/approve',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.approveLeaveApplication
);

router.put(
  '/applications/:applicationId/reject',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.rejectLeaveApplication
);

/**
 * Leave Approval Routes
 */
router.get(
  '/approvals/pending',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.getPendingApprovals
);

router.put(
  '/approvals/:approvalId/approve',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.approveLeaveAtLevel
);

/**
 * Leave Balance Routes
 */
router.get(
  '/balance/:userId/:academicYearId',
  authenticate,
  authorize(['TEACHER', 'STAFF', 'ADMIN', 'PRINCIPAL', 'HOD']),
  leaveController.getLeaveBalance
);

/**
 * Leave Statistics Routes
 */
router.get(
  '/statistics',
  authenticate,
  authorize(['ADMIN', 'PRINCIPAL']),
  leaveController.getLeaveStatistics
);

module.exports = router;
