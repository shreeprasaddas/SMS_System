/**
 * Inventory Routes
 * API endpoints for inventory management
 */

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authorize } = require('../middleware/authorization.middleware');

// Middleware stack
// Category routes
router.post('/categories', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.createCategory);
router.get('/categories', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getAllCategories);

// Inventory item routes
router.post('/items', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.addInventoryItem);
router.get('/items', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getInventoryItems);
router.get('/items/:id', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getInventoryById);
router.put('/items/:id', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.updateInventoryItem);

// Inventory movement routes
router.post('/movements', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.recordMovement);
router.get('/movements', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getMovements);

// Supplier routes
router.post('/suppliers', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.registerSupplier);
router.get('/suppliers', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getSuppliers);

// Procurement order routes
router.post('/orders', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.createProcurementOrder);
router.get('/orders', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']), inventoryController.getProcurementOrders);
router.patch('/orders/:id/approve', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.approveProcurementOrder);

// Statistics routes
router.get('/statistics', authorize(['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']), inventoryController.getInventoryStatistics);

module.exports = router;
