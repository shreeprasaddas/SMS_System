const libraryService = require('../services/library.service');
const { ResponseHelper } = require('../utils/responseHelper');
const libraryValidation = require('../validations/library.validation');
const { AppError } = require('../utils/errorHelper');

/**
 * Create book
 * @route POST /api/v1/library/books
 * @access ADMIN, LIBRARIAN
 */
exports.createBook = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.createBookSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const book = await libraryService.createBook(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, book, 'Book created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all books
 * @route GET /api/v1/library/books
 * @access ALL_ROLES
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.bookFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { books, total } = await libraryService.getAllBooks(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      books,
      total,
      value.page,
      value.limit,
      'Books fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get book by ID
 * @route GET /api/v1/library/books/:bookId
 * @access ALL_ROLES
 */
exports.getBookById = async (req, res, next) => {
  try {
    const book = await libraryService.getBookById(
      req.user.schoolId,
      req.params.bookId
    );

    return ResponseHelper.success(res, book, 'Book fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update book
 * @route PUT /api/v1/library/books/:bookId
 * @access ADMIN, LIBRARIAN
 */
exports.updateBook = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.updateBookSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const book = await libraryService.updateBook(
      req.user.schoolId,
      req.params.bookId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, book, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Register library member
 * @route POST /api/v1/library/members
 * @access ADMIN, LIBRARIAN
 */
exports.registerMember = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.registerMemberSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const member = await libraryService.registerMember(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, member, 'Member registered successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all members
 * @route GET /api/v1/library/members
 * @access ADMIN, LIBRARIAN
 */
exports.getAllMembers = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.memberFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { members, total } = await libraryService.getAllMembers(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      members,
      total,
      value.page,
      value.limit,
      'Members fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Issue book
 * @route POST /api/v1/library/issues
 * @access ADMIN, LIBRARIAN
 */
exports.issueBook = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.issueBookSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const issue = await libraryService.issueBook(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, issue, 'Book issued successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending issues
 * @route GET /api/v1/library/issues
 * @access ADMIN, LIBRARIAN
 */
exports.getPendingIssues = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.issueFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { issues, total } = await libraryService.getPendingIssues(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      issues,
      total,
      value.page,
      value.limit,
      'Issues fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Return book
 * @route POST /api/v1/library/issues/:issueId/return
 * @access ADMIN, LIBRARIAN
 */
exports.returnBook = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.returnBookSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const result = await libraryService.returnBook(
      req.user.schoolId,
      req.params.issueId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, result, 'Book returned successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Reserve book
 * @route POST /api/v1/library/reservations
 * @access ALL_ROLES
 */
exports.reserveBook = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.reserveBookSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const reservation = await libraryService.reserveBook(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, reservation, 'Book reserved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get reservations
 * @route GET /api/v1/library/reservations
 * @access ALL_ROLES
 */
exports.getReservations = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.reservationFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { reservations, total } = await libraryService.getReservations(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      reservations,
      total,
      value.page,
      value.limit,
      'Reservations fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create fine
 * @route POST /api/v1/library/fines
 * @access ADMIN, LIBRARIAN
 */
exports.createFine = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.createFineSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const fine = await libraryService.createFine(
      req.user.schoolId,
      value,
      req.user._id
    );

    return ResponseHelper.created(res, fine, 'Fine created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get fines
 * @route GET /api/v1/library/fines
 * @access ADMIN, LIBRARIAN
 */
exports.getFines = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.fineFilterSchema.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 422);

    const { fines, total } = await libraryService.getFines(
      req.user.schoolId,
      value
    );

    return ResponseHelper.paginated(
      res,
      fines,
      total,
      value.page,
      value.limit,
      'Fines fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Pay fine
 * @route POST /api/v1/library/fines/:fineId/pay
 * @access ADMIN, LIBRARIAN
 */
exports.payFine = async (req, res, next) => {
  try {
    const { error, value } = libraryValidation.payFineSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 422);

    const fine = await libraryService.payFine(
      req.user.schoolId,
      req.params.fineId,
      value,
      req.user._id
    );

    return ResponseHelper.success(res, fine, 'Fine payment processed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get library statistics
 * @route GET /api/v1/library/statistics
 * @access ADMIN, LIBRARIAN
 */
exports.getLibraryStatistics = async (req, res, next) => {
  try {
    const statistics = await libraryService.getLibraryStatistics(
      req.user.schoolId
    );

    return ResponseHelper.success(res, statistics, 'Statistics fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
