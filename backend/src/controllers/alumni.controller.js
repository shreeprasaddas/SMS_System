/**
 * Alumni Controller
 * HTTP request handlers for alumni management
 */

const alumniService = require('../services/alumni.service');
const { ResponseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');

/**
 * Create Alumni Profile
 * POST /api/v1/alumni
 */
exports.createAlumni = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const alumni = await alumniService.createAlumni(req.body, schoolId);
    ResponseHelper.created(res, alumni, 'Alumni profile created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Alumni
 * GET /api/v1/alumni
 */
exports.getAllAlumni = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await alumniService.getAllAlumni(schoolId, req.query);
    ResponseHelper.paginated(res, result.alumni, result, 'Alumni retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Alumni by ID
 * GET /api/v1/alumni/:id
 */
exports.getAlumniById = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const alumni = await alumniService.getAlumniById(req.params.id, schoolId);
    ResponseHelper.success(res, alumni, 'Alumni retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Alumni Profile
 * PUT /api/v1/alumni/:id
 */
exports.updateAlumni = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.user;
    const alumni = await alumniService.updateAlumni(req.params.id, { ...req.body, performedBy: userId }, schoolId);
    ResponseHelper.success(res, alumni, 'Alumni updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Alumni Event
 * POST /api/v1/events
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const event = await alumniService.createEvent(req.body, schoolId);
    ResponseHelper.created(res, event, 'Event created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Alumni Events
 * GET /api/v1/events
 */
exports.getEvents = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await alumniService.getEvents(schoolId, req.query);
    ResponseHelper.paginated(res, result.events, result, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Register for Event
 * POST /api/v1/events/:id/register
 */
exports.registerForEvent = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const event = await alumniService.registerForEvent(req.params.id, schoolId, req.body);
    ResponseHelper.success(res, event, 'Registered for event successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Record Donation
 * POST /api/v1/donations
 */
exports.recordDonation = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const donation = await alumniService.recordDonation(req.body, schoolId);
    ResponseHelper.created(res, donation, 'Donation recorded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Donations
 * GET /api/v1/donations
 */
exports.getDonations = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await alumniService.getDonations(schoolId, req.query);
    ResponseHelper.paginated(res, result.donations, result, 'Donations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Post Job Opportunity
 * POST /api/v1/jobs
 */
exports.postJob = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const job = await alumniService.postJob(req.body, schoolId);
    ResponseHelper.created(res, job, 'Job posted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Job Postings
 * GET /api/v1/jobs
 */
exports.getJobPostings = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await alumniService.getJobPostings(schoolId, req.query);
    ResponseHelper.paginated(res, result.jobs, result, 'Jobs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create Mentorship
 * POST /api/v1/mentorships
 */
exports.createMentorship = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const mentorship = await alumniService.createMentorship(req.body, schoolId);
    ResponseHelper.created(res, mentorship, 'Mentorship created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Mentorships
 * GET /api/v1/mentorships
 */
exports.getMentorships = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const result = await alumniService.getMentorships(schoolId, req.query);
    ResponseHelper.paginated(res, result.mentorships, result, 'Mentorships retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Alumni Statistics
 * GET /api/v1/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const { schoolId } = req.user;
    const stats = await alumniService.getStatistics(schoolId);
    ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
