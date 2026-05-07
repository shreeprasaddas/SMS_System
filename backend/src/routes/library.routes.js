const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * Book Management Routes
 */

// Create book
router.post(
  '/books',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.createBook
);

// Get all books
router.get(
  '/books',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT', 'STAFF']),
  libraryController.getAllBooks
);

// Get book by ID
router.get(
  '/books/:bookId',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT', 'STAFF']),
  libraryController.getBookById
);

// Update book
router.put(
  '/books/:bookId',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.updateBook
);

/**
 * Library Member Management Routes
 */

// Register member
router.post(
  '/members',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.registerMember
);

// Get all members
router.get(
  '/members',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.getAllMembers
);

/**
 * Book Issue Routes
 */

// Issue book
router.post(
  '/issues',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.issueBook
);

// Get pending issues
router.get(
  '/issues',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.getPendingIssues
);

// Return book
router.post(
  '/issues/:issueId/return',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.returnBook
);

/**
 * Book Reservation Routes
 */

// Reserve book
router.post(
  '/reservations',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT', 'STAFF']),
  libraryController.reserveBook
);

// Get reservations
router.get(
  '/reservations',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN', 'TEACHER', 'STUDENT', 'STAFF']),
  libraryController.getReservations
);

/**
 * Library Fine Routes
 */

// Create fine
router.post(
  '/fines',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.createFine
);

// Get fines
router.get(
  '/fines',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.getFines
);

// Pay fine
router.post(
  '/fines/:fineId/pay',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.payFine
);

/**
 * Library Statistics Route
 */

// Get statistics
router.get(
  '/statistics',
  authorize(['ADMIN', 'PRINCIPAL', 'LIBRARIAN']),
  libraryController.getLibraryStatistics
);

module.exports = router;
