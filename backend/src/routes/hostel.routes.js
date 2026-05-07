/**
 * Hostel Routes
 * API endpoints for hostel management
 */

const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostel.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const hostelValidation = require('../validations/hostel.validation');

// Middleware: All routes require authentication
router.use(authenticate);

/**
 * HOSTELS - CRUD Operations
 */

// POST: Create new hostel
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(hostelValidation.createHostelSchema, 'body'),
  hostelController.createHostel
);

// GET: List all hostels
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validateRequest(hostelValidation.listHostelsSchema, 'query'),
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
  validateRequest(hostelValidation.createHostelSchema, 'body'),
  hostelController.updateHostel
);

/**
 * ROOMS - Management
 */

// POST: Add room to hostel
router.post(
  '/rooms/add',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER']),
  validateRequest(hostelValidation.addRoomSchema, 'body'),
  hostelController.addRoom
);

// GET: List rooms
router.get(
  '/rooms/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validateRequest(hostelValidation.listRoomsSchema, 'query'),
  hostelController.getRooms
);

/**
 * ALLOCATIONS - Student Hostel Assignments
 */

// POST: Allocate student
router.post(
  '/allocations/create',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER']),
  validateRequest(hostelValidation.allocateStudentSchema, 'body'),
  hostelController.allocateStudent
);

// GET: List allocations
router.get(
  '/allocations/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validateRequest(hostelValidation.listAllocationsSchema, 'query'),
  hostelController.getAllocations
);

/**
 * FEES - Hostel Fee Management
 */

// POST: Record fee
router.post(
  '/fees/record',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'HOSTEL_MANAGER']),
  validateRequest(hostelValidation.recordFeeSchema, 'body'),
  hostelController.recordFee
);

// GET: List fees
router.get(
  '/fees/list',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'HOSTEL_MANAGER']),
  validateRequest(hostelValidation.listFeesSchema, 'query'),
  hostelController.getFees
);

/**
 * COMPLAINTS - Grievance Management
 */

// POST: File complaint
router.post(
  '/complaints/file',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN', 'STUDENT']),
  validateRequest(hostelValidation.fileComplaintSchema, 'body'),
  hostelController.fileComplaint
);

// GET: List complaints
router.get(
  '/complaints/list',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validateRequest(hostelValidation.listComplaintsSchema, 'query'),
  hostelController.getComplaints
);

// PATCH: Update complaint status
router.patch(
  '/complaints/:id/status',
  authorize(['ADMIN', 'PRINCIPAL', 'HOSTEL_MANAGER', 'WARDEN']),
  validateRequest(hostelValidation.updateComplaintStatusSchema, 'body'),
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
