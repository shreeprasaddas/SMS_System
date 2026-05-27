const express = require('express');
const professionalDevelopmentController = require('../controllers/professionalDevelopment.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Middleware
// ==================== PROFESSIONAL DEVELOPMENT PROGRAMS ====================
// Create program
router.post(
  '/programs',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.createProgram
);

// Get all programs
router.get(
  '/programs',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getPrograms
);

// Get program by ID
router.get(
  '/programs/:programId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getProgramById
);

// Update program
router.put(
  '/programs/:programId',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.updateProgram
);

// Get program participants
router.get(
  '/programs/:programId/participants',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getProgramParticipants
);

// Get upcoming programs
router.get(
  '/programs/upcoming/list',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getUpcomingPrograms
);

// ==================== EMPLOYEE TRAINING ====================
// Enroll employee in training
router.post(
  '/training/enroll',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.enrollEmployee
);

// Get employee training history
router.get(
  '/training/history/:employeeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getEmployeeTrainingHistory
);

// Get current user training history
router.get(
  '/training/my-history',
  professionalDevelopmentController.getEmployeeTrainingHistory
);

// Update training status
router.put(
  '/training/:trainingId/status',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.updateTrainingStatus
);

// Get staff development profile
router.get(
  '/training/profile/:employeeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getStaffDevelopmentProfile
);

// Get current user development profile
router.get(
  '/training/my-profile',
  professionalDevelopmentController.getStaffDevelopmentProfile
);

// ==================== STAFF CERTIFICATIONS ====================
// Create certification record
router.post(
  '/certifications',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.createCertification
);

// Get staff certifications
router.get(
  '/certifications/:employeeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getStaffCertifications
);

// Get current user certifications
router.get(
  '/certifications/my-certifications',
  professionalDevelopmentController.getStaffCertifications
);

// Get expiring certifications (renewal alert)
router.get(
  '/certifications/expiring/alert',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getExpiringCertifications
);

// ==================== SKILL ASSESSMENT ====================
// Create skill assessment
router.post(
  '/assessments',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.createSkillAssessment
);

// Get skill assessments
router.get(
  '/assessments/:employeeId',
  authorize(['ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getSkillAssessments
);

// Get current user assessments
router.get(
  '/assessments/my-assessments',
  professionalDevelopmentController.getSkillAssessments
);

// ==================== TRAINING PROVIDERS ====================
// Create training provider
router.post(
  '/providers',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.createTrainingProvider
);

// Get training providers
router.get(
  '/providers',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getTrainingProviders
);

// ==================== SUMMARY & ANALYTICS ====================
// Get development summary/dashboard
router.get(
  '/summary/dashboard',
  authorize(['ADMIN', 'PRINCIPAL', 'HR', 'SYSTEM']),
  professionalDevelopmentController.getDevelopmentSummary
);

module.exports = router;
