/**
 * System Routes
 * Protected system and academic foundation endpoints
 */

const express = require('express');
const AcademicController = require('../controllers/academic.controller');
const { validate } = require('../middleware/validation.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  createStreamSchema,
  updateStreamSchema,
  createSectionSchema,
  updateSectionSchema,
  createSubjectSchema,
  updateSubjectSchema,
} = require('../validations/academic.validation');

const router = express.Router();

// ============================================================
// ACADEMIC YEAR ENDPOINTS
// ============================================================

// Create academic year (admin/principal only)
router.post(
  '/years',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createAcademicYearSchema),
  AcademicController.createAcademicYear
);

// Get all academic years
router.get('/years', AcademicController.getAcademicYears);

// Get academic year by ID
router.get('/years/:yearId', AcademicController.getAcademicYear);

// Update academic year (admin/principal only)
router.put(
  '/years/:yearId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateAcademicYearSchema),
  AcademicController.updateAcademicYear
);

// Activate academic year (admin/principal only)
router.patch(
  '/years/:yearId/activate',
  authorize(['ADMIN', 'PRINCIPAL']),
  AcademicController.activateAcademicYear
);

// ============================================================
// STREAM ENDPOINTS
// ============================================================

// Create stream (admin/principal only)
router.post(
  '/streams',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createStreamSchema),
  AcademicController.createStream
);

// Get all streams
router.get('/streams', AcademicController.getStreams);

// Get stream by ID
router.get('/streams/:streamId', AcademicController.getStream);

// Update stream (admin/principal only)
router.put(
  '/streams/:streamId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateStreamSchema),
  AcademicController.updateStream
);

// ============================================================
// SECTION ENDPOINTS
// ============================================================

// Create section (admin/principal only)
router.post(
  '/sections',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createSectionSchema),
  AcademicController.createSection
);

// Get all sections
router.get('/sections', AcademicController.getSections);

// Get section by ID
router.get('/sections/:sectionId', AcademicController.getSection);

// Update section (admin/principal only)
router.put(
  '/sections/:sectionId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateSectionSchema),
  AcademicController.updateSection
);

// ============================================================
// SUBJECT ENDPOINTS
// ============================================================

// Create subject (admin/principal only)
router.post(
  '/subjects',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(createSubjectSchema),
  AcademicController.createSubject
);

// Get all subjects
router.get('/subjects', AcademicController.getSubjects);

// Get subject by ID
router.get('/subjects/:subjectId', AcademicController.getSubject);

// Update subject (admin/principal only)
router.put(
  '/subjects/:subjectId',
  authorize(['ADMIN', 'PRINCIPAL']),
  validate(updateSubjectSchema),
  AcademicController.updateSubject
);

// Assign subject to stream
router.post(
  '/subjects/:subjectId/streams/:streamId',
  authorize(['ADMIN', 'PRINCIPAL']),
  AcademicController.assignSubjectToStream
);

module.exports = router;
