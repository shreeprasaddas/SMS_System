/**
 * Inventory Validation Schemas
 * Joi validation for inventory operations
 */

const Joi = require('joi');

// Create Inventory Category
exports.createCategorySchema = Joi.object({
  categoryName: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500),
  categoryType: Joi.string()
    .valid('ACADEMIC', 'FURNITURE', 'EQUIPMENT', 'SUPPLIES', 'TECHNOLOGY', 'SPORTS', 'MAINTENANCE', 'INFRASTRUCTURE', 'MISCELLANEOUS')
    .required(),
  budgetAllocationId: Joi.string().hex().length(24),
  parentCategory: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

// Add Inventory Item
exports.addInventoryItemSchema = Joi.object({
  itemName: Joi.string().min(2).max(100).required(),
  itemDescription: Joi.string().max(500),
  categoryId: Joi.string().hex().length(24).required(),
  itemCode: Joi.string().max(50),
  unitOfMeasure: Joi.string()
    .valid('PIECE', 'KG', 'LITER', 'METER', 'BOX', 'PACK', 'BUNDLE', 'SET', 'OTHER')
    .required(),
  quantity: Joi.number().integer().min(0).required(),
  minimumThreshold: Joi.number().integer().min(0),
  maximumThreshold: Joi.number().integer().min(0),
  reorderLevel: Joi.number().integer().min(0),
  unitCost: Joi.number().min(0),
  location: Joi.object({
    storageName: Joi.string().max(100),
    shelf: Joi.string().max(50),
    bin: Joi.string().max(50),
    coordinates: Joi.string()
  }),
  supplier: Joi.object({
    supplierId: Joi.string().hex().length(24),
    supplierName: Joi.string().max(100)
  }),
  dateOfPurchase: Joi.date(),
  warrantyExpiryDate: Joi.date(),
  usageStatus: Joi.string().valid('IN_USE', 'SPARE', 'DAMAGED', 'OBSOLETE', 'UNDER_MAINTENANCE'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  remarks: Joi.string().max(500)
});

// Update Inventory Item
exports.updateInventoryItemSchema = Joi.object({
  itemName: Joi.string().min(2).max(100),
  itemDescription: Joi.string().max(500),
  categoryId: Joi.string().hex().length(24),
  quantity: Joi.number().integer().min(0),
  minimumThreshold: Joi.number().integer().min(0),
  maximumThreshold: Joi.number().integer().min(0),
  unitCost: Joi.number().min(0),
  usageStatus: Joi.string().valid('IN_USE', 'SPARE', 'DAMAGED', 'OBSOLETE', 'UNDER_MAINTENANCE'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  remarks: Joi.string().max(500)
});

// Record Movement
exports.recordMovementSchema = Joi.object({
  inventoryId: Joi.string().hex().length(24).required(),
  movementType: Joi.string()
    .valid('IN', 'OUT', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'DAMAGED', 'LOST')
    .required(),
  quantity: Joi.number().integer().min(1).required(),
  movementDate: Joi.date().required(),
  reason: Joi.string().min(5).max(500).required(),
  referenceDocument: Joi.string().valid('PURCHASE_ORDER', 'INDENT', 'REQUISITION', 'ISSUE_SLIP', 'RETURN_SLIP', 'ADJUSTMENT_NOTE', 'OTHER'),
  referenceNumber: Joi.string().max(50),
  fromLocation: Joi.object({
    storageName: Joi.string().max(100),
    shelf: Joi.string().max(50),
    bin: Joi.string().max(50)
  }),
  toLocation: Joi.object({
    storageName: Joi.string().max(100),
    shelf: Joi.string().max(50),
    bin: Joi.string().max(50)
  }),
  unitCost: Joi.number().min(0),
  remarks: Joi.string().max(500)
});

// Register Supplier
exports.registerSupplierSchema = Joi.object({
  supplierName: Joi.string().min(2).max(100).required(),
  supplierType: Joi.string()
    .valid('INDIVIDUAL', 'ORGANIZATION', 'DISTRIBUTOR', 'VENDOR', 'CONTRACTOR')
    .required(),
  contactPerson: Joi.string().max(100),
  email: Joi.string().email(),
  phone: Joi.string().max(20),
  alternatePhone: Joi.string().max(20),
  address: Joi.object({
    street: Joi.string().max(200),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    postalCode: Joi.string().max(20),
    country: Joi.string().max(50)
  }),
  gstNumber: Joi.string().max(50),
  panNumber: Joi.string().max(50),
  bankDetails: Joi.object({
    bankName: Joi.string().max(100),
    accountNumber: Joi.string().max(50),
    ifscCode: Joi.string().max(20),
    accountHolderName: Joi.string().max(100)
  }),
  categories: Joi.array().items(
    Joi.object({
      categoryId: Joi.string().hex().length(24),
      categoryName: Joi.string().max(100)
    })
  ),
  paymentTerms: Joi.object({
    paymentMethod: Joi.string().valid('CASH', 'CHEQUE', 'ONLINE', 'CREDIT', 'OTHER'),
    creditPeriodDays: Joi.number().integer().min(0),
    discountPercentage: Joi.number().min(0).max(100)
  }),
  qualityCertifications: Joi.array().items(Joi.string().max(100)),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'BLACKLISTED', 'ARCHIVED'),
  remarks: Joi.string().max(500)
});

// Create Procurement Order
exports.createProcurementOrderSchema = Joi.object({
  supplierId: Joi.string().hex().length(24).required(),
  orderDate: Joi.date().required(),
  expectedDeliveryDate: Joi.date().greater(Joi.ref('orderDate')).required(),
  items: Joi.array().items(
    Joi.object({
      inventoryId: Joi.string().hex().length(24),
      itemName: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      unitOfMeasure: Joi.string().max(20),
      unitPrice: Joi.number().min(0).required(),
      description: Joi.string().max(300),
      specifications: Joi.string().max(300)
    })
  ).required(),
  totalAmount: Joi.number().min(0).required(),
  taxPercentage: Joi.number().min(0).max(100),
  discountPercentage: Joi.number().min(0).max(100),
  shippingCharge: Joi.number().min(0),
  paymentTerms: Joi.object({
    paymentMethod: Joi.string().max(50),
    creditPeriodDays: Joi.number().integer().min(0),
    installments: Joi.array().items(
      Joi.object({
        installmentNumber: Joi.number().integer().min(1),
        dueDate: Joi.date(),
        amount: Joi.number().min(0)
      })
    )
  }),
  deliveryAddress: Joi.object({
    locationName: Joi.string().max(100),
    street: Joi.string().max(200),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    postalCode: Joi.string().max(20)
  }),
  notes: Joi.string().max(500)
});

// Approve Procurement Order
exports.approveProcurementOrderSchema = Joi.object({
  approvedBy: Joi.string().hex().length(24).required(),
  remarks: Joi.string().max(500)
});

// List Filters
exports.listCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED'),
  categoryType: Joi.string()
});

exports.listInventorySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  categoryId: Joi.string().hex().length(24),
  usageStatus: Joi.string().valid('IN_USE', 'SPARE', 'DAMAGED', 'OBSOLETE', 'UNDER_MAINTENANCE'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ARCHIVED')
});

exports.listMovementsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  inventoryId: Joi.string().hex().length(24),
  movementType: Joi.string().valid('IN', 'OUT', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'DAMAGED', 'LOST'),
  approvalStatus: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED')
});

exports.listSuppliersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  supplierType: Joi.string().valid('INDIVIDUAL', 'ORGANIZATION', 'DISTRIBUTOR', 'VENDOR', 'CONTRACTOR'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'BLACKLISTED', 'ARCHIVED')
});

exports.listOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  supplierId: Joi.string().hex().length(24),
  orderStatus: Joi.string()
    .valid('DRAFT', 'SUBMITTED', 'CONFIRMED', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'CANCELLED', 'RETURNED'),
  approvalStatus: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED')
});
    assetName: Joi.string().required().trim().messages({
      'string.empty': 'Asset name is required',
    }),
    category: Joi.string()
      .required()
      .valid('FURNITURE', 'ELECTRONICS', 'SPORTS_EQUIPMENT', 'LAB_EQUIPMENT', 'BOOKS', 'COMPUTERS', 'VEHICLES', 'INFRASTRUCTURE', 'OTHER')
      .messages({
        'any.only': 'Invalid asset category',
      }),
    description: Joi.string().optional().trim(),
    quantity: Joi.number().required().min(1).messages({
      'number.min': 'Quantity must be at least 1',
    }),
    unitCost: Joi.number().required().min(0).messages({
      'number.min': 'Unit cost cannot be negative',
    }),
    location: Joi.string().required().trim().messages({
      'string.empty': 'Location is required',
    }),
    condition: Joi.string()
      .optional()
      .valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR')
      .default('EXCELLENT'),
    purchaseDate: Joi.date().required().messages({
      'date.base': 'Valid purchase date is required',
    }),
    warrantyExpiry: Joi.date().optional(),
    serialNumbers: Joi.array().items(Joi.string().trim()).optional(),
    depreciation: Joi.object({
      method: Joi.string().valid('STRAIGHT_LINE', 'DECLINING_BALANCE'),
      rate: Joi.number().min(0).max(100),
      usefulLife: Joi.number().min(1),
    }).optional(),
    status: Joi.string().optional().valid('ACTIVE', 'INACTIVE', 'DAMAGED', 'LOST', 'DISCARDED'),
  }),

  updateAssetSchema: Joi.object({
    assetName: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    quantity: Joi.number().optional().min(1),
    unitCost: Joi.number().optional().min(0),
    location: Joi.string().optional().trim(),
    condition: Joi.string().optional().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
    warrantyExpiry: Joi.date().optional(),
    status: Joi.string().optional().valid('ACTIVE', 'INACTIVE', 'DAMAGED', 'LOST', 'DISCARDED'),
  }),

  getAssetsSchema: Joi.object({
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    status: Joi.string().optional(),
    condition: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Equipment Schemas
  addEquipmentSchema: Joi.object({
    equipmentCode: Joi.string().required().trim().messages({
      'string.empty': 'Equipment code is required',
    }),
    equipmentName: Joi.string().required().trim().messages({
      'string.empty': 'Equipment name is required',
    }),
    type: Joi.string()
      .required()
      .valid('LAB', 'SPORTS', 'COMPUTER', 'AUDIOVISUAL', 'MEDICAL', 'ART_CRAFT', 'MUSIC', 'OTHER')
      .messages({
        'any.only': 'Invalid equipment type',
      }),
    department: Joi.string().required().trim().messages({
      'string.empty': 'Department is required',
    }),
    manufacturer: Joi.string().optional().trim(),
    modelNumber: Joi.string().optional().trim(),
    serialNumber: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    quantity: Joi.number().required().min(1),
    unitCost: Joi.number().required().min(0),
    purchaseDate: Joi.date().required(),
    warrantyExpiry: Joi.date().optional(),
    calibrationFrequency: Joi.string()
      .optional()
      .valid('MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY'),
    location: Joi.string().required().trim(),
    condition: Joi.string()
      .optional()
      .valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL')
      .default('EXCELLENT'),
    status: Joi.string()
      .optional()
      .valid('ACTIVE', 'INACTIVE', 'UNDER_REPAIR', 'DAMAGED', 'LOST', 'DISCARDED'),
  }),

  updateEquipmentSchema: Joi.object({
    equipmentName: Joi.string().optional().trim(),
    department: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    location: Joi.string().optional().trim(),
    condition: Joi.string().optional().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL'),
    status: Joi.string().optional().valid('ACTIVE', 'INACTIVE', 'UNDER_REPAIR', 'DAMAGED', 'LOST', 'DISCARDED'),
    lastUsedDate: Joi.date().optional(),
    usageCount: Joi.number().optional().min(0),
  }),

  getEquipmentSchema: Joi.object({
    type: Joi.string().optional(),
    department: Joi.string().optional(),
    status: Joi.string().optional(),
    condition: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Stock Schemas
  addStockSchema: Joi.object({
    itemCode: Joi.string().required().trim().messages({
      'string.empty': 'Item code is required',
    }),
    itemName: Joi.string().required().trim().messages({
      'string.empty': 'Item name is required',
    }),
    category: Joi.string()
      .required()
      .valid('STATIONERY', 'CLEANING', 'LABORATORY', 'SPORTS', 'CHEMICALS', 'FOOD', 'MEDICAL', 'MAINTENANCE', 'OTHER')
      .messages({
        'any.only': 'Invalid stock category',
      }),
    description: Joi.string().optional().trim(),
    unit: Joi.string()
      .required()
      .valid('PIECE', 'PACKET', 'BOX', 'CARTON', 'KG', 'LITER', 'METER', 'DOZEN', 'REAM')
      .messages({
        'any.only': 'Invalid unit',
      }),
    currentStock: Joi.number().optional().min(0).default(0),
    minimumStock: Joi.number().required().min(1).messages({
      'number.min': 'Minimum stock must be at least 1',
    }),
    maximumStock: Joi.number().required().min(1),
    reorderPoint: Joi.number().required().min(1),
    reorderQuantity: Joi.number().required().min(1),
    unitCost: Joi.number().required().min(0),
    supplier: Joi.string().optional().trim(),
    supplierCode: Joi.string().optional().trim(),
    purchaseDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    batchNumber: Joi.string().optional().trim(),
    storageLocation: Joi.string().required().trim().messages({
      'string.empty': 'Storage location is required',
    }),
    status: Joi.string()
      .optional()
      .valid('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'),
  }),

  updateStockSchema: Joi.object({
    itemName: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    minimumStock: Joi.number().optional().min(1),
    maximumStock: Joi.number().optional().min(1),
    reorderPoint: Joi.number().optional().min(1),
    reorderQuantity: Joi.number().optional().min(1),
    unitCost: Joi.number().optional().min(0),
    supplier: Joi.string().optional().trim(),
    storageLocation: Joi.string().optional().trim(),
    expiryDate: Joi.date().optional(),
    status: Joi.string().optional().valid('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'),
  }),

  adjustStockSchema: Joi.object({
    type: Joi.string().required().valid('IN', 'OUT', 'ADJUSTMENT', 'DAMAGED', 'EXPIRED').messages({
      'any.only': 'Invalid adjustment type',
    }),
    quantity: Joi.number().required().min(1).messages({
      'number.min': 'Quantity must be at least 1',
    }),
    reason: Joi.string().required().trim().messages({
      'string.empty': 'Reason is required',
    }),
    reference: Joi.string().optional().trim(),
  }),

  getStockSchema: Joi.object({
    category: Joi.string().optional(),
    status: Joi.string().optional(),
    storageLocation: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),

  // Maintenance Schemas
  createMaintenanceSchema: Joi.object({
    assetType: Joi.string().required().valid('ASSET', 'EQUIPMENT').messages({
      'any.only': 'Invalid asset type',
    }),
    asset: Joi.string().required().trim().messages({
      'string.empty': 'Asset ID is required',
    }),
    maintenanceType: Joi.string()
      .required()
      .valid('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'CALIBRATION')
      .messages({
        'any.only': 'Invalid maintenance type',
      }),
    description: Joi.string().required().trim().messages({
      'string.empty': 'Description is required',
    }),
    startDate: Joi.date().required().messages({
      'date.base': 'Valid start date is required',
    }),
    priority: Joi.string().optional().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    vendor: Joi.object({
      vendorName: Joi.string().optional().trim(),
      vendorContact: Joi.string().optional().trim(),
      vendorEmail: Joi.string().optional().email(),
    }).optional(),
    cost: Joi.object({
      parts: Joi.number().optional().min(0),
      labor: Joi.number().optional().min(0),
    }).optional(),
    workDetails: Joi.object({
      issueDescription: Joi.string().optional().trim(),
      partsReplaced: Joi.array().items(Joi.string().trim()).optional(),
    }).optional(),
    nextMaintenanceDate: Joi.date().optional(),
    nextMaintenanceType: Joi.string()
      .optional()
      .valid('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'CALIBRATION'),
  }),

  completeMaintenanceSchema: Joi.object({
    completionDate: Joi.date().optional(),
    condition: Joi.object({
      before: Joi.string().optional().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL'),
      after: Joi.string().required().valid('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NON_FUNCTIONAL').messages({
        'any.only': 'Condition after is required',
      }),
    }).required(),
    workDetails: Joi.object({
      workPerformed: Joi.string().required().trim().messages({
        'string.empty': 'Work performed is required',
      }),
      partsReplaced: Joi.array().items(Joi.string().trim()).optional(),
    }).required(),
    remarks: Joi.string().optional().trim(),
  }),

  getMaintenanceSchema: Joi.object({
    status: Joi.string().optional(),
    maintenanceType: Joi.string().optional(),
    priority: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    limit: Joi.number().optional().default(10).min(1).max(100),
  }),
};
