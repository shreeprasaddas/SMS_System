const Book = require('../models/library/Book.model');
const BookIssue = require('../models/library/BookIssue.model');
const LibraryMember = require('../models/library/LibraryMember.model');
const BookReservation = require('../models/library/BookReservation.model');
const LibraryFine = require('../models/library/LibraryFine.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create new book
 */
exports.createBook = async (schoolId, data, userId) => {
  try {
    const book = new Book({
      ...data,
      schoolId,
      acquisitionDate: new Date(),
      auditLog: [{
        action: 'CREATED',
        performedBy: userId,
        timestamp: new Date()
      }]
    });
    await book.save();
    return book;
  } catch (error) {
    throw new AppError(error.message || 'Failed to create book', 500);
  }
};

/**
 * Get all books with filters
 */
exports.getAllBooks = async (schoolId, filters) => {
  try {
    const { page = 1, limit = 20, category, status, search } = filters;
    const skip = (page - 1) * limit;

    const query = { schoolId };
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { authors: new RegExp(search, 'i') },
        { isbn: new RegExp(search, 'i') }
      ];
    }

    const books = await Book.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Book.countDocuments(query);

    return {
      books,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch books', 500);
  }
};

/**
 * Get book by ID
 */
exports.getBookById = async (schoolId, bookId) => {
  try {
    const book = await Book.findOne({
      _id: bookId,
      schoolId
    }).lean();

    if (!book) throw new AppError('Book not found', 404);
    return book;
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch book', 500);
  }
};

/**
 * Update book
 */
exports.updateBook = async (schoolId, bookId, data, userId) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: bookId, schoolId },
      {
        $set: data,
        $push: {
          auditLog: {
            action: 'UPDATED',
            performedBy: userId,
            timestamp: new Date(),
            changes: data
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!book) throw new AppError('Book not found', 404);
    return book;
  } catch (error) {
    throw new AppError(error.message || 'Failed to update book', 500);
  }
};

/**
 * Register library member
 */
exports.registerMember = async (schoolId, data, userId) => {
  try {
    const member = new LibraryMember({
      ...data,
      schoolId,
      registeredByUserId: userId,
      auditLog: [{
        action: 'REGISTERED',
        performedBy: userId,
        timestamp: new Date()
      }]
    });
    await member.save();
    return member;
  } catch (error) {
    throw new AppError(error.message || 'Failed to register member', 500);
  }
};

/**
 * Get all members with filters
 */
exports.getAllMembers = async (schoolId, filters) => {
  try {
    const { page = 1, limit = 20, membershipType, status } = filters;
    const skip = (page - 1) * limit;

    const query = { schoolId };
    if (membershipType) query.membershipType = membershipType;
    if (status) query.membershipStatus = status;

    const members = await LibraryMember.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await LibraryMember.countDocuments(query);

    return {
      members,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch members', 500);
  }
};

/**
 * Issue book to member
 */
exports.issueBook = async (schoolId, data, userId) => {
  try {
    const { bookId, userId: memberId, dueDate } = data;

    // Validate book exists and has copies available
    const book = await Book.findOne({ _id: bookId, schoolId });
    if (!book) throw new AppError('Book not found', 404);
    if (book.availableCopies <= 0) throw new AppError('No copies available', 400);

    // Validate member exists and is active
    const member = await LibraryMember.findOne({
      _id: memberId,
      schoolId
    });
    if (!member) throw new AppError('Member not found', 404);
    if (member.membershipStatus !== 'ACTIVE') throw new AppError('Member is not active', 400);
    if (member.currentBooksIssued >= member.maxBooksAllowed) {
      throw new AppError('Member has reached book limit', 400);
    }

    // Create book issue
    const bookIssue = new BookIssue({
      schoolId,
      bookId,
      userId: memberId,
      userRole: member.membershipType,
      userName: member.userName,
      dueDate,
      issueType: 'NORMAL',
      issuedByUserId: userId,
      auditLog: [{
        action: 'ISSUED',
        performedBy: userId,
        timestamp: new Date()
      }]
    });

    // Update book and member
    book.availableCopies -= 1;
    member.currentBooksIssued += 1;
    member.issueHistory.totalBooksIssued += 1;

    await Promise.all([
      bookIssue.save(),
      book.save(),
      member.save()
    ]);

    return bookIssue;
  } catch (error) {
    throw new AppError(error.message || 'Failed to issue book', 500);
  }
};

/**
 * Get pending issues
 */
exports.getPendingIssues = async (schoolId, filters) => {
  try {
    const { page = 1, limit = 20, status, overdue } = filters;
    const skip = (page - 1) * limit;

    const query = { schoolId, status: 'ISSUED' };
    if (overdue) {
      query.dueDate = { $lt: new Date() };
    }

    const issues = await BookIssue.find(query)
      .populate('bookId', 'title isbn')
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await BookIssue.countDocuments(query);

    return {
      issues,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch issues', 500);
  }
};

/**
 * Return book
 */
exports.returnBook = async (schoolId, issueId, data, userId) => {
  try {
    const { bookConditionOnReturn, remarks } = data;

    const bookIssue = await BookIssue.findOne({
      _id: issueId,
      schoolId,
      status: 'ISSUED'
    });

    if (!bookIssue) throw new AppError('Book issue not found', 404);

    // Update book issue
    bookIssue.status = 'RETURNED';
    bookIssue.returnDate = new Date();
    bookIssue.returnedByUserId = userId;
    bookIssue.bookConditionOnReturn = bookConditionOnReturn;
    bookIssue.auditLog.push({
      action: 'RETURNED',
      performedBy: userId,
      timestamp: new Date(),
      changes: { bookConditionOnReturn }
    });

    // Update book
    const book = await Book.findById(bookIssue.bookId);
    if (book) {
      book.availableCopies += 1;
      if (bookConditionOnReturn === 'DAMAGED' || bookConditionOnReturn === 'POOR') {
        book.condition = 'FAIR';
      }
      await book.save();
    }

    // Update member
    const member = await LibraryMember.findById(bookIssue.userId);
    if (member) {
      member.currentBooksIssued = Math.max(0, member.currentBooksIssued - 1);
      member.issueHistory.totalBooksReturned += 1;
      await member.save();
    }

    await bookIssue.save();
    return bookIssue;
  } catch (error) {
    throw new AppError(error.message || 'Failed to return book', 500);
  }
};

/**
 * Reserve book
 */
exports.reserveBook = async (schoolId, data, userId) => {
  try {
    const { bookId } = data;

    const book = await Book.findOne({ _id: bookId, schoolId });
    if (!book) throw new AppError('Book not found', 404);

    const reservation = new BookReservation({
      schoolId,
      bookId,
      userId,
      userName: data.userName,
      userRole: data.userRole,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      priority: data.priority || 'MEDIUM',
      reason: data.reason,
      auditLog: [{
        action: 'RESERVED',
        performedBy: userId,
        timestamp: new Date()
      }]
    });

    await reservation.save();
    return reservation;
  } catch (error) {
    throw new AppError(error.message || 'Failed to reserve book', 500);
  }
};

/**
 * Get reservations
 */
exports.getReservations = async (schoolId, filters) => {
  try {
    const { page = 1, limit = 20, status, userId: filterId } = filters;
    const skip = (page - 1) * limit;

    const query = { schoolId };
    if (status) query.reservationStatus = status;
    if (filterId) query.userId = filterId;

    const reservations = await BookReservation.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await BookReservation.countDocuments(query);

    return {
      reservations,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch reservations', 500);
  }
};

/**
 * Create fine
 */
exports.createFine = async (schoolId, data, userId) => {
  try {
    const fine = new LibraryFine({
      ...data,
      schoolId,
      auditLog: [{
        action: 'CREATED',
        performedBy: userId,
        timestamp: new Date()
      }]
    });
    await fine.save();
    return fine;
  } catch (error) {
    throw new AppError(error.message || 'Failed to create fine', 500);
  }
};

/**
 * Get fines
 */
exports.getFines = async (schoolId, filters) => {
  try {
    const { page = 1, limit = 20, status, userId: filterId } = filters;
    const skip = (page - 1) * limit;

    const query = { schoolId };
    if (status) query.fineStatus = status;
    if (filterId) query.userId = filterId;

    const fines = await LibraryFine.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await LibraryFine.countDocuments(query);

    return {
      fines,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch fines', 500);
  }
};

/**
 * Pay fine
 */
exports.payFine = async (schoolId, fineId, data, userId) => {
  try {
    const { paidAmount, paymentMethod } = data;

    const fine = await LibraryFine.findOne({
      _id: fineId,
      schoolId
    });

    if (!fine) throw new AppError('Fine not found', 404);

    fine.paidAmount = (fine.paidAmount || 0) + paidAmount;
    fine.paymentMethod = paymentMethod;
    fine.paidDate = new Date();

    if (fine.paidAmount >= fine.amount) {
      fine.fineStatus = 'PAID';
    } else {
      fine.fineStatus = 'PARTIAL';
    }

    fine.auditLog.push({
      action: 'PAYMENT_RECEIVED',
      performedBy: userId,
      timestamp: new Date(),
      changes: { paidAmount, paymentMethod }
    });

    await fine.save();
    return fine;
  } catch (error) {
    throw new AppError(error.message || 'Failed to process payment', 500);
  }
};

/**
 * Get library statistics
 */
exports.getLibraryStatistics = async (schoolId) => {
  try {
    const totalBooks = await Book.countDocuments({ schoolId, status: 'ACTIVE' });
    const availableBooks = await Book.countDocuments({
      schoolId,
      status: 'ACTIVE',
      availableCopies: { $gt: 0 }
    });
    const totalMembers = await LibraryMember.countDocuments({
      schoolId,
      membershipStatus: 'ACTIVE'
    });
    const issuedBooks = await BookIssue.countDocuments({
      schoolId,
      status: 'ISSUED'
    });
    const overdueBooks = await BookIssue.countDocuments({
      schoolId,
      status: 'ISSUED',
      dueDate: { $lt: new Date() }
    });
    const pendingReservations = await BookReservation.countDocuments({
      schoolId,
      reservationStatus: 'PENDING'
    });
    const outstandingFines = await LibraryFine.countDocuments({
      schoolId,
      fineStatus: { $in: ['PENDING', 'PARTIAL'] }
    });

    return {
      totalBooks,
      availableBooks,
      totalMembers,
      issuedBooks,
      overdueBooks,
      pendingReservations,
      outstandingFines
    };
  } catch (error) {
    throw new AppError(error.message || 'Failed to fetch statistics', 500);
  }
};

module.exports = exports;
