/**
 * Hostel Controller
 * HTTP request handlers for hostel management
 */

const hostelService = require('../services/hostel.service');
const { ResponseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

/**
 * Create Hostel
 * POST /api/v1/hostels
 */
exports.createHostel = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const hostel = await hostelService.createHostel(req.body, schoolId);
    ResponseHelper.created(res, hostel, 'Hostel created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Hostels
 * GET /api/v1/hostels
 */
exports.getAllHostels = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hostelService.getAllHostels(schoolId, req.query);
    ResponseHelper.paginated(res, result.hostels, result, 'Hostels retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Hostel By ID
 * GET /api/v1/hostels/:id
 */
exports.getHostelById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const hostel = await hostelService.getHostelById(req.params.id, schoolId);
    ResponseHelper.success(res, hostel, 'Hostel retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Hostel
 * PUT /api/v1/hostels/:id
 */
exports.updateHostel = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const hostel = await hostelService.updateHostel(req.params.id, { ...req.body, performedBy: userId }, schoolId);
    ResponseHelper.success(res, hostel, 'Hostel updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Add Room to Hostel
 * POST /api/v1/hostels/:hostelId/rooms
 */
exports.addRoom = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const room = await hostelService.addRoom({ ...req.body, hostelId: req.params.hostelId }, schoolId);
    ResponseHelper.created(res, room, 'Room added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Rooms
 * GET /api/v1/hostels/rooms
 */
exports.getRooms = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hostelService.getRooms(schoolId, req.query);
    ResponseHelper.paginated(res, result.rooms, result, 'Rooms retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Allocate Student
 * POST /api/v1/allocations
 */
exports.allocateStudent = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const allocation = await hostelService.allocateStudent(req.body, schoolId);
    ResponseHelper.created(res, allocation, 'Student allocated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Allocations
 * GET /api/v1/allocations
 */
exports.getAllocations = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hostelService.getAllocations(schoolId, req.query);
    ResponseHelper.paginated(res, result.allocations, result, 'Allocations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record Fee
 * POST /api/v1/fees
 */
exports.recordFee = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const fee = await hostelService.recordFee(req.body, schoolId);
    ResponseHelper.created(res, fee, 'Fee recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Fees
 * GET /api/v1/fees
 */
exports.getFees = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hostelService.getFees(schoolId, req.query);
    ResponseHelper.paginated(res, result.fees, result, 'Fees retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * File Complaint
 * POST /api/v1/complaints
 */
exports.fileComplaint = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const complaint = await hostelService.fileComplaint(req.body, schoolId);
    ResponseHelper.created(res, complaint, 'Complaint filed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Complaints
 * GET /api/v1/complaints
 */
exports.getComplaints = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await hostelService.getComplaints(schoolId, req.query);
    ResponseHelper.paginated(res, result.complaints, result, 'Complaints retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Complaint Status
 * PATCH /api/v1/complaints/:id/status
 */
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const complaint = await hostelService.updateComplaintStatus(req.params.id, schoolId, { ...req.body, performedBy: userId });
    ResponseHelper.success(res, complaint, 'Complaint updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Hostel Statistics
 * GET /api/v1/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const stats = await hostelService.getStatistics(schoolId);
    ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
