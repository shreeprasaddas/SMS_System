/**
 * Hostel Routes
 * API endpoints for hostel management
 */

const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostel.controller');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const hostelValidation = require('../validations/hostel.validation');

/**
 * HOSTELS - CRUD Operations
 */

// POST: Create new hostel
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(hostelValidation.createHostelSchema, 'body'),
  hostelController.createHostel
);

// GET: List all hostels
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validate(hostelValidation.listHostelsSchema, 'query'),
  hostelController.getAllHostels
);

// GET: Hostel by ID
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  hostelController.getHostelById
);

// PUT: Update hostel
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(hostelValidation.createHostelSchema, 'body'),
  hostelController.updateHostel
);

/**
 * ROOMS - Management
 */

// POST: Add room to hostel
router.post(
  '/rooms/add',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER']),
  validate(hostelValidation.addRoomSchema, 'body'),
  hostelController.addRoom
);

// GET: List rooms
router.get(
  '/rooms/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validate(hostelValidation.listRoomsSchema, 'query'),
  hostelController.getRooms
);

/**
 * ALLOCATIONS - Student Hostel Assignments
 */

// POST: Allocate student
router.post(
  '/allocations/create',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER']),
  validate(hostelValidation.allocateStudentSchema, 'body'),
  hostelController.allocateStudent
);

// GET: List allocations
router.get(
  '/allocations/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validate(hostelValidation.listAllocationsSchema, 'query'),
  hostelController.getAllocations
);

/**
 * FEES - Hostel Fee Management
 */

// POST: Record fee
router.post(
  '/fees/record',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'HOSTEL_MANAGER']),
  validate(hostelValidation.recordFeeSchema, 'body'),
  hostelController.recordFee
);

// GET: List fees
router.get(
  '/fees/list',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'HOSTEL_MANAGER']),
  validate(hostelValidation.listFeesSchema, 'query'),
  hostelController.getFees
);

/**
 * COMPLAINTS - Grievance Management
 */

// POST: File complaint
router.post(
  '/complaints/file',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN', 'STUDENT']),
  validate(hostelValidation.fileComplaintSchema, 'body'),
  hostelController.fileComplaint
);

// GET: List complaints
router.get(
  '/complaints/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validate(hostelValidation.listComplaintsSchema, 'query'),
  hostelController.getComplaints
);

// PATCH: Update complaint status
router.patch(
  '/complaints/:id/status',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validate(hostelValidation.updateComplaintStatusSchema, 'body'),
  hostelController.updateComplaintStatus
);

/**
 * STATISTICS - Dashboard Data
 */

// GET: Hostel statistics
router.get(
  '/dashboard/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER']),
  hostelController.getStatistics
);

module.exports = router;
