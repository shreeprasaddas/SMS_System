const InventoryCategory = require('../models/inventory/InventoryCategory.model');
const Inventory = require('../models/inventory/Inventory.model');
const InventoryMovement = require('../models/inventory/InventoryMovement.model');
const Supplier = require('../models/inventory/Supplier.model');
const ProcurementOrder = require('../models/inventory/ProcurementOrder.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create inventory category
 * @param {object} data - Category details
 * @param {string} schoolId
 * @returns {Promise<object>} Created category
 */
exports.createCategory = async (data, schoolId) => {
  const category = await InventoryCategory.create({
    ...data,
    schoolId
  });
  return category;
};

/**
 * Get all inventory categories
 * @param {string} schoolId
 * @param {object} filters - { status, categoryType, page, limit }
 * @returns {Promise<object>} { categories, total, pagination }
 */
exports.getAllCategories = async (schoolId, filters = {}) => {
  const { status, categoryType, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;
  if (categoryType) query.categoryType = categoryType;

  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    InventoryCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    InventoryCategory.countDocuments(query)
  ]);

  return { categories, total, page: Number(page), limit: Number(limit) };
};

/**
 * Add inventory item
 * @param {object} data - Item details
 * @param {string} schoolId
 * @returns {Promise<object>} Created inventory
 */
exports.addInventoryItem = async (data, schoolId) => {
  const inventory = await Inventory.create({
    ...data,
    schoolId
  });
  return inventory;
};

/**
 * Get inventory items
 * @param {string} schoolId
 * @param {object} filters - { categoryId, usageStatus, status, page, limit }
 * @returns {Promise<object>} { items, total, pagination }
 */
exports.getInventoryItems = async (schoolId, filters = {}) => {
  const { categoryId, usageStatus, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (categoryId) query.categoryId = categoryId;
  if (usageStatus) query.usageStatus = usageStatus;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Inventory.find(query)
      .populate('categoryId', 'categoryName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Inventory.countDocuments(query)
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get inventory item by ID
 * @param {string} itemId
 * @param {string} schoolId
 * @returns {Promise<object>} Item details
 */
exports.getInventoryById = async (itemId, schoolId) => {
  const item = await Inventory.findOne({ _id: itemId, schoolId })
    .populate('categoryId', 'categoryName')
    .lean();
  if (!item) throw new AppError('Inventory item not found', 404);
  return item;
};

/**
 * Update inventory item
 * @param {string} itemId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated item
 */
exports.updateInventoryItem = async (itemId, data, schoolId) => {
  const item = await Inventory.findOneAndUpdate(
    { _id: itemId, schoolId },
    {
      ...data,
      $push: {
        auditLog: {
          action: 'UPDATE',
          performedBy: data.performedBy,
          changes: data
        }
      }
    },
    { new: true, runValidators: true }
  );
  if (!item) throw new AppError('Inventory item not found', 404);
  return item;
};

/**
 * Record inventory movement
 * @param {object} data - Movement details
 * @param {string} schoolId
 * @returns {Promise<object>} Created movement
 */
exports.recordMovement = async (data, schoolId) => {
  const inventory = await Inventory.findOne({ _id: data.inventoryId, schoolId });
  if (!inventory) throw new AppError('Inventory item not found', 404);

  // Validate movement
  if (data.movementType === 'OUT' && inventory.quantity < data.quantity) {
    throw new AppError('Insufficient quantity in inventory', 400);
  }

  const movement = await InventoryMovement.create({
    ...data,
    itemName: inventory.itemName,
    schoolId
  });

  // Update inventory quantity based on movement type
  let quantityChange = 0;
  if (data.movementType === 'IN' || data.movementType === 'RETURN') {
    quantityChange = data.quantity;
  } else if (data.movementType === 'OUT' || data.movementType === 'DAMAGED' || data.movementType === 'LOST') {
    quantityChange = -data.quantity;
  }

  if (quantityChange !== 0) {
    await Inventory.findByIdAndUpdate(
      inventory._id,
      { $inc: { quantity: quantityChange } },
      { new: true }
    );
  }

  return movement;
};

/**
 * Get inventory movements
 * @param {string} schoolId
 * @param {object} filters - { inventoryId, movementType, status, page, limit }
 * @returns {Promise<object>} { movements, total, pagination }
 */
exports.getMovements = async (schoolId, filters = {}) => {
  const { inventoryId, movementType, approvalStatus, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (inventoryId) query.inventoryId = inventoryId;
  if (movementType) query.movementType = movementType;
  if (approvalStatus) query.approvalStatus = approvalStatus;

  const skip = (page - 1) * limit;
  const [movements, total] = await Promise.all([
    InventoryMovement.find(query)
      .sort({ movementDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    InventoryMovement.countDocuments(query)
  ]);

  return { movements, total, page: Number(page), limit: Number(limit) };
};

/**
 * Register supplier
 * @param {object} data - Supplier details
 * @param {string} schoolId
 * @returns {Promise<object>} Created supplier
 */
exports.registerSupplier = async (data, schoolId) => {
  const supplier = await Supplier.create({
    ...data,
    schoolId
  });
  return supplier;
};

/**
 * Get suppliers
 * @param {string} schoolId
 * @param {object} filters - { supplierType, status, page, limit }
 * @returns {Promise<object>} { suppliers, total, pagination }
 */
exports.getSuppliers = async (schoolId, filters = {}) => {
  const { supplierType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (supplierType) query.supplierType = supplierType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [suppliers, total] = await Promise.all([
    Supplier.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Supplier.countDocuments(query)
  ]);

  return { suppliers, total, page: Number(page), limit: Number(limit) };
};

/**
 * Create procurement order
 * @param {object} data - Order details
 * @param {string} schoolId
 * @returns {Promise<object>} Created order
 */
exports.createProcurementOrder = async (data, schoolId) => {
  const supplier = await Supplier.findOne({ _id: data.supplierId, schoolId });
  if (!supplier) throw new AppError('Supplier not found', 404);

  const order = await ProcurementOrder.create({
    ...data,
    supplierName: supplier.supplierName,
    schoolId
  });
  return order;
};

/**
 * Get procurement orders
 * @param {string} schoolId
 * @param {object} filters - { supplierId, orderStatus, approvalStatus, page, limit }
 * @returns {Promise<object>} { orders, total, pagination }
 */
exports.getProcurementOrders = async (schoolId, filters = {}) => {
  const { supplierId, orderStatus, approvalStatus, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (supplierId) query.supplierId = supplierId;
  if (orderStatus) query.orderStatus = orderStatus;
  if (approvalStatus) query.approvalStatus = approvalStatus;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    ProcurementOrder.find(query)
      .populate('supplierId', 'supplierName')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ProcurementOrder.countDocuments(query)
  ]);

  return { orders, total, page: Number(page), limit: Number(limit) };
};

/**
 * Approve procurement order
 * @param {string} orderId
 * @param {string} schoolId
 * @param {object} approvalData
 * @returns {Promise<object>} Updated order
 */
exports.approveProcurementOrder = async (orderId, schoolId, approvalData) => {
  const order = await ProcurementOrder.findOneAndUpdate(
    { _id: orderId, schoolId },
    {
      approvalStatus: 'APPROVED',
      orderStatus: 'CONFIRMED',
      approvedBy: approvalData.approvedBy,
      approvalDate: new Date(),
      approvalRemarks: approvalData.remarks,
      $push: {
        auditLog: {
          action: 'APPROVED',
          performedBy: approvalData.approvedBy,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  if (!order) throw new AppError('Procurement order not found', 404);
  return order;
};

/**
 * Get inventory statistics
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getInventoryStatistics = async (schoolId) => {
  const [totalItems, lowStockItems, totalSuppliers, pendingOrders, totalMovements] = await Promise.all([
    Inventory.countDocuments({ schoolId, status: 'ACTIVE' }),
    Inventory.countDocuments({ 
      schoolId, 
      status: 'ACTIVE',
      $expr: { $lte: ['$quantity', '$minimumThreshold'] }
    }),
    Supplier.countDocuments({ schoolId, status: 'ACTIVE' }),
    ProcurementOrder.countDocuments({ schoolId, approvalStatus: 'PENDING' }),
    InventoryMovement.countDocuments({ schoolId })
  ]);

  // Calculate total inventory value
  const inventoryValue = await Inventory.aggregate([
    { $match: { schoolId, status: 'ACTIVE' } },
    { $group: { _id: null, totalValue: { $sum: '$totalValue' } } }
  ]);

  return {
    totalActiveItems: totalItems,
    lowStockItems,
    totalSuppliers,
    pendingOrders,
    totalMovements,
    inventoryValue: inventoryValue[0]?.totalValue || 0,
    timestamp: new Date()
  };
};

module.exports = exports;
      throw new AppError('Asset not found', 404);
    }
    return asset;
  }

  /**
   * Update asset
   */
  async updateAsset(schoolId, assetId, data) {
    const asset = await Asset.findOneAndUpdate(
      { _id: assetId, schoolId },
      { ...data, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }
    return asset;
  }

  /**
   * Delete asset
   */
  async deleteAsset(schoolId, assetId) {
    const asset = await Asset.findOneAndDelete({ _id: assetId, schoolId });
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }
    return asset;
  }

  /**
   * Add new equipment
   */
  async addEquipment(schoolId, data) {
    const equipment = new Equipment({
      ...data,
      schoolId,
    });
    return await equipment.save();
  }

  /**
   * Get equipment with filters and pagination
   */
  async getEquipment(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [equipment, total] = await Promise.all([
      Equipment.find(query)
        .populate('maintenanceLog', 'maintenanceCode maintenanceType status')
        .skip(skip)
        .limit(limit)
        .lean(),
      Equipment.countDocuments(query),
    ]);

    return {
      equipment,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get equipment by ID
   */
  async getEquipmentById(schoolId, equipmentId) {
    const equipment = await Equipment.findOne({ _id: equipmentId, schoolId }).populate('maintenanceLog');
    if (!equipment) {
      throw new AppError('Equipment not found', 404);
    }
    return equipment;
  }

  /**
   * Update equipment
   */
  async updateEquipment(schoolId, equipmentId, data) {
    const equipment = await Equipment.findOneAndUpdate(
      { _id: equipmentId, schoolId },
      { ...data, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!equipment) {
      throw new AppError('Equipment not found', 404);
    }
    return equipment;
  }

  /**
   * Add stock item
   */
  async addStock(schoolId, data) {
    const stock = new Stock({
      ...data,
      schoolId,
    });
    return await stock.save();
  }

  /**
   * Get stock with filters and pagination
   */
  async getStock(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [stocks, total] = await Promise.all([
      Stock.find(query).skip(skip).limit(limit).lean(),
      Stock.countDocuments(query),
    ]);

    return {
      stocks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get stock by ID
   */
  async getStockById(schoolId, stockId) {
    const stock = await Stock.findOne({ _id: stockId, schoolId });
    if (!stock) {
      throw new AppError('Stock item not found', 404);
    }
    return stock;
  }

  /**
   * Update stock
   */
  async updateStock(schoolId, stockId, data) {
    const stock = await Stock.findOneAndUpdate(
      { _id: stockId, schoolId },
      { ...data, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!stock) {
      throw new AppError('Stock item not found', 404);
    }
    return stock;
  }

  /**
   * Adjust stock quantity (IN/OUT)
   */
  async adjustStock(schoolId, stockId, type, quantity, reason, reference, userId) {
    const stock = await Stock.findOne({ _id: stockId, schoolId });
    if (!stock) {
      throw new AppError('Stock item not found', 404);
    }

    let newQuantity = stock.currentStock;
    if (type === 'IN') {
      newQuantity += quantity;
    } else if (type === 'OUT') {
      if (stock.currentStock < quantity) {
        throw new AppError('Insufficient stock available', 400);
      }
      newQuantity -= quantity;
    }

    stock.currentStock = newQuantity;
    stock.stockHistory.push({
      date: new Date(),
      type,
      quantity,
      reason,
      reference,
      recordedBy: userId,
    });

    if (newQuantity <= stock.minimumStock) {
      stock.status = 'OUT_OF_STOCK';
    } else if (stock.status === 'OUT_OF_STOCK' && newQuantity > stock.minimumStock) {
      stock.status = 'ACTIVE';
    }

    return await stock.save();
  }

  /**
   * Create maintenance record
   */
  async createMaintenance(schoolId, data) {
    const maintenance = new AssetMaintenance({
      ...data,
      schoolId,
    });
    const saved = await maintenance.save();

    // Update equipment maintenance log
    if (data.assetType === 'EQUIPMENT') {
      await Equipment.findByIdAndUpdate(
        data.asset,
        { $push: { maintenanceLog: saved._id } }
      );
    }

    return saved;
  }

  /**
   * Get maintenance records with filters and pagination
   */
  async getMaintenanceRecords(schoolId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { schoolId, ...filters };

    const [records, total] = await Promise.all([
      AssetMaintenance.find(query)
        .populate('asset')
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name email')
        .skip(skip)
        .limit(limit)
        .lean(),
      AssetMaintenance.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get maintenance by ID
   */
  async getMaintenanceById(schoolId, maintenanceId) {
    const record = await AssetMaintenance.findOne({ _id: maintenanceId, schoolId })
      .populate('asset')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');
    if (!record) {
      throw new AppError('Maintenance record not found', 404);
    }
    return record;
  }

  /**
   * Complete maintenance
   */
  async completeMaintenance(schoolId, maintenanceId, data) {
    const record = await AssetMaintenance.findOneAndUpdate(
      { _id: maintenanceId, schoolId },
      {
        ...data,
        status: 'COMPLETED',
        completionDate: new Date(),
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('asset');

    if (!record) {
      throw new AppError('Maintenance record not found', 404);
    }

    // Update equipment/asset condition
    if (record.assetType === 'EQUIPMENT' && record.condition?.after) {
      await Equipment.findByIdAndUpdate(record.asset, {
        condition: record.condition.after,
      });
    } else if (record.assetType === 'ASSET' && record.condition?.after) {
      await Asset.findByIdAndUpdate(record.asset, {
        condition: record.condition.after,
      });
    }

    return record;
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats(schoolId) {
    const [assetStats, equipmentStats, stockStats, maintenanceStats] = await Promise.all([
      Asset.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalValue: { $sum: '$totalValue' },
            activeCount: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } },
            inactiveCount: { $sum: { $cond: [{ $eq: ['$status', 'INACTIVE'] }, 1, 0] } },
            damagedCount: { $sum: { $cond: [{ $eq: ['$status', 'DAMAGED'] }, 1, 0] } },
          },
        },
      ]),
      Equipment.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalCost: { $sum: '$totalCost' },
            activeCount: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } },
            underRepairCount: { $sum: { $cond: [{ $eq: ['$status', 'UNDER_REPAIR'] }, 1, 0] } },
          },
        },
      ]),
      Stock.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalItems: { $sum: 1 },
            totalQuantity: { $sum: '$currentStock' },
            lowStockItems: { $sum: { $cond: [{ $lt: ['$currentStock', '$minimumStock'] }, 1, 0] } },
            outOfStockItems: { $sum: { $cond: [{ $eq: ['$status', 'OUT_OF_STOCK'] }, 1, 0] } },
          },
        },
      ]),
      AssetMaintenance.aggregate([
        { $match: { schoolId } },
        {
          $group: {
            _id: null,
            totalRecords: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
            inProgressCount: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
            totalCost: { $sum: '$cost.total' },
          },
        },
      ]),
    ]);

    return {
      assets: assetStats[0] || {},
      equipment: equipmentStats[0] || {},
      stock: stockStats[0] || {},
      maintenance: maintenanceStats[0] || {},
    };
  }

  /**
   * Get items requiring maintenance
   */
  async getItemsForMaintenance(schoolId) {
    const today = new Date();
    const upcomingMaintenance = await AssetMaintenance.find({
      schoolId,
      nextMaintenanceDate: { $lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) }, // Next 30 days
      status: { $in: ['SCHEDULED', 'ON_HOLD'] },
    })
      .populate('asset')
      .sort({ nextMaintenanceDate: 1 })
      .lean();

    return upcomingMaintenance;
  }

  /**
   * Get expired/expiring items
   */
  async getExpiringItems(schoolId, daysAhead = 30) {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    const expiringStock = await Stock.find({
      schoolId,
      expiryDate: {
        $gt: new Date(),
        $lte: futureDate,
      },
    }).lean();

    const expiringWarranty = await Asset.find({
      schoolId,
      warrantyExpiry: {
        $gt: new Date(),
        $lte: futureDate,
      },
    }).lean();

    return {
      expiringStock,
      expiringWarranty,
    };
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(schoolId) {
    const lowStock = await Stock.find({
      schoolId,
      $expr: { $lte: ['$currentStock', '$minimumStock'] },
    }).lean();

    return lowStock;
  }
}

module.exports = new InventoryService();
