/**
 * Alumni Routes
 * API endpoints for alumni management
 */

const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumni.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const alumniValidation = require('../validations/alumni.validation');

// Middleware: All routes require authentication
router.use(authenticate);

/**
 * ALUMNI - Profile Management
 */

// POST: Create alumni profile
router.post(
  '/',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(alumniValidation.createAlumniSchema, 'body'),
  alumniController.createAlumni
);

// GET: List all alumni
router.get(
  '/',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validateRequest(alumniValidation.listAlumniSchema, 'query'),
  alumniController.getAllAlumni
);

// GET: Alumni by ID
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  alumniController.getAlumniById
);

// PUT: Update alumni profile
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(alumniValidation.createAlumniSchema, 'body'),
  alumniController.updateAlumni
);

/**
 * EVENTS - Alumni Events & Reunions
 */

// POST: Create event
router.post(
  '/events/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(alumniValidation.createEventSchema, 'body'),
  alumniController.createEvent
);

// GET: List events
router.get(
  '/events/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(alumniValidation.listEventsSchema, 'query'),
  alumniController.getEvents
);

// POST: Register for event
router.post(
  '/events/:id/register',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT']),
  validateRequest(alumniValidation.registerForEventSchema, 'body'),
  alumniController.registerForEvent
);

/**
 * DONATIONS - Alumni Fundraising
 */

// POST: Record donation
router.post(
  '/donations/record',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(alumniValidation.recordDonationSchema, 'body'),
  alumniController.recordDonation
);

// GET: List donations
router.get(
  '/donations/list',
  authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']),
  validateRequest(alumniValidation.listDonationsSchema, 'query'),
  alumniController.getDonations
);

/**
 * JOBS - Alumni Job Postings
 */

// POST: Post job opportunity
router.post(
  '/jobs/post',
  authorize(['ADMIN', 'PRINCIPAL', 'STUDENT']),
  validateRequest(alumniValidation.postJobSchema, 'body'),
  alumniController.postJob
);

// GET: List job postings
router.get(
  '/jobs/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(alumniValidation.listJobsSchema, 'query'),
  alumniController.getJobPostings
);

/**
 * MENTORSHIP - Alumni Mentoring Programs
 */

// POST: Create mentorship
router.post(
  '/mentorships/create',
  authorize(['ADMIN', 'PRINCIPAL']),
  validateRequest(alumniValidation.createMentorshipSchema, 'body'),
  alumniController.createMentorship
);

// GET: List mentorships
router.get(
  '/mentorships/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  validateRequest(alumniValidation.listMentorshipsSchema, 'query'),
  alumniController.getMentorships
);

/**
 * STATISTICS - Dashboard Data
 */

// GET: Alumni statistics
router.get(
  '/dashboard/statistics',
  authorize(['ADMIN', 'PRINCIPAL']),
  alumniController.getStatistics
);

module.exports = router;
  validate(createAlumniSchema),
  alumniController.createAlumni
);

// Get alumni by ID
router.get(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'LIBRARIAN', 'STUDENT', 'PARENT']),
  alumniController.getAlumniById
);

// Update alumni record
router.put(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateAlumniSchema),
  alumniController.updateAlumni
);

// Delete alumni record
router.delete(
  '/:id',
  authorize(['ADMIN', 'PRINCIPAL']),
  alumniController.deleteAlumni
);

// Get alumni engagement score
router.get(
  '/:id/engagement-score',
  authorize(['ADMIN', 'PRINCIPAL']),
  alumniController.calculateEngagementScore
);

// ============== PLACEMENT ROUTES ==============

// Record placement for alumni
router.post(
  '/:id/placements',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(recordPlacementSchema),
  alumniController.recordPlacement
);

// Get placements for an alumni
router.get(
  '/:id/placements',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  alumniController.getAlumniPlacements
);

// ============== EVENT ROUTES ==============

// Get upcoming alumni events
router.get(
  '/events/upcoming',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']),
  alumniController.getUpcomingEvents
);

// Register alumni for event
router.post(
  '/:id/events/register',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(registerEventSchema),
  alumniController.registerForEvent
);

// ============== MENTORSHIP ROUTES ==============

// Create mentorship relationship
router.post(
  '/mentorships',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createMentorshipSchema),
  alumniController.createMentorship
);

// Get pending mentorships
router.get(
  '/mentorships/pending',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  alumniController.getPendingMentorships
);

// Record mentorship session
router.post(
  '/mentorships/:id/sessions',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  validate(recordSessionSchema),
  alumniController.recordMentorshipSession
);

// ============== DONATION ROUTES ==============

// Get contributions report
router.get(
  '/donations/report',
  authorize(['ADMIN', 'PRINCIPAL']),
  alumniController.getContributionsReport
);

// Process donation from alumni
router.post(
  '/:id/donations',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(processDonationSchema),
  alumniController.processDonation
);

// Get donation history for alumni
router.get(
  '/:id/donations',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  alumniController.getAlumniDonations
);

// ============== NETWORKING ROUTES ==============

// Create networking connection
router.post(
  '/:id/network',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createNetworkingSchema),
  alumniController.createNetworkingConnection
);

// Get alumni network
router.get(
  '/:id/network',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER']),
  alumniController.getAlumniNetwork
);

module.exports = router;
