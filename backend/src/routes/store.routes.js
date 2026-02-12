const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { createStoreSchema, validate } = require('../middleware/validation.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);

// Protected routes
router.use(authenticate);

// Store Owner routes (view own store)
router.get('/my/store', authorize('STORE_OWNER'), storeController.getMyStore);

// Admin routes (create store)
router.post('/', authorize('ADMIN'), validate(createStoreSchema), storeController.createStore);

module.exports = router;
