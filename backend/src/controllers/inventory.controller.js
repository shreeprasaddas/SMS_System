/**
 * Inventory Controller
 * Handles HTTP requests for inventory management operations
 */

const inventoryService = require('../services/inventory.service');
const ResponseHelper = require('../utils/ResponseHelper');
const { validate } = require('../middleware/validate.middleware');
const inventoryValidation = require('../validations/inventory.validation');
const AppError = require('../utils/AppError');

/**
 * Create Inventory Category
 * POST /api/inventory/categories
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.createCategorySchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const category = await inventoryService.createCategory(value, req.user.schoolId);
    return ResponseHelper.created(res, category, 'Inventory category created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Categories
 * GET /api/inventory/categories
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.listCategoriesSchema.validate(req.query);
    if (error) return next(new AppError(error.details[0].message, 422));

    const result = await inventoryService.getAllCategories(req.user.schoolId, value);
    return ResponseHelper.paginated(res, result.categories, result.total, value.page, value.limit, 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Add Inventory Item
 * POST /api/inventory/items
 */
exports.addInventoryItem = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.addInventoryItemSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const item = await inventoryService.addInventoryItem(value, req.user.schoolId);
    return ResponseHelper.created(res, item, 'Inventory item added successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Inventory Items
 * GET /api/inventory/items
 */
exports.getInventoryItems = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.listInventorySchema.validate(req.query);
    if (error) return next(new AppError(error.details[0].message, 422));

    const result = await inventoryService.getInventoryItems(req.user.schoolId, value);
    return ResponseHelper.paginated(res, result.items, result.total, value.page, value.limit, 'Inventory items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Inventory Item by ID
 * GET /api/inventory/items/:id
 */
exports.getInventoryById = async (req, res, next) => {
  try {
    const item = await inventoryService.getInventoryById(req.params.id, req.user.schoolId);
    return ResponseHelper.success(res, item, 'Inventory item retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update Inventory Item
 * PUT /api/inventory/items/:id
 */
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.updateInventoryItemSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const updateData = { ...value, performedBy: req.user._id };
    const item = await inventoryService.updateInventoryItem(req.params.id, updateData, req.user.schoolId);
    return ResponseHelper.success(res, item, 'Inventory item updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Record Inventory Movement
 * POST /api/inventory/movements
 */
exports.recordMovement = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.recordMovementSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const movement = await inventoryService.recordMovement(value, req.user.schoolId);
    return ResponseHelper.created(res, movement, 'Inventory movement recorded successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Inventory Movements
 * GET /api/inventory/movements
 */
exports.getMovements = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.listMovementsSchema.validate(req.query);
    if (error) return next(new AppError(error.details[0].message, 422));

    const result = await inventoryService.getMovements(req.user.schoolId, value);
    return ResponseHelper.paginated(res, result.movements, result.total, value.page, value.limit, 'Movements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Register Supplier
 * POST /api/inventory/suppliers
 */
exports.registerSupplier = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.registerSupplierSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const supplier = await inventoryService.registerSupplier(value, req.user.schoolId);
    return ResponseHelper.created(res, supplier, 'Supplier registered successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Suppliers
 * GET /api/inventory/suppliers
 */
exports.getSuppliers = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.listSuppliersSchema.validate(req.query);
    if (error) return next(new AppError(error.details[0].message, 422));

    const result = await inventoryService.getSuppliers(req.user.schoolId, value);
    return ResponseHelper.paginated(res, result.suppliers, result.total, value.page, value.limit, 'Suppliers retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Procurement Order
 * POST /api/inventory/orders
 */
exports.createProcurementOrder = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.createProcurementOrderSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const order = await inventoryService.createProcurementOrder(value, req.user.schoolId);
    return ResponseHelper.created(res, order, 'Procurement order created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Procurement Orders
 * GET /api/inventory/orders
 */
exports.getProcurementOrders = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.listOrdersSchema.validate(req.query);
    if (error) return next(new AppError(error.details[0].message, 422));

    const result = await inventoryService.getProcurementOrders(req.user.schoolId, value);
    return ResponseHelper.paginated(res, result.orders, result.total, value.page, value.limit, 'Orders retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Approve Procurement Order
 * PATCH /api/inventory/orders/:id/approve
 */
exports.approveProcurementOrder = async (req, res, next) => {
  try {
    const { error, value } = inventoryValidation.approveProcurementOrderSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 422));

    const approvalData = { ...value, approvedBy: req.user._id };
    const order = await inventoryService.approveProcurementOrder(req.params.id, req.user.schoolId, approvalData);
    return ResponseHelper.success(res, order, 'Procurement order approved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get Inventory Statistics
 * GET /api/inventory/statistics
 */
exports.getInventoryStatistics = async (req, res, next) => {
  try {
    const stats = await inventoryService.getInventoryStatistics(req.user.schoolId);
    return ResponseHelper.success(res, stats, 'Inventory statistics retrieved successfully');
  } catch (err) {
    next(err);
  }
};
module.exports = exports;
