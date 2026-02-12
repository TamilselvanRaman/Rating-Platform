const storeService = require('../services/store.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const createStore = async (req, res, next) => {
  try {
    const store = await storeService.createStore(req.body);
    return successResponse(res, 'Store created successfully', store, 201);
  } catch (error) {
    next(error);
  }
};

const getAllStores = async (req, res, next) => {
  try {
    const filters = req.query;
    const stores = await storeService.getAllStores(filters);
    return successResponse(res, 'Stores retrieved successfully', stores);
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await storeService.getStoreById(id);
    return successResponse(res, 'Store retrieved successfully', store);
  } catch (error) {
    next(error);
  }
};

const getMyStore = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const store = await storeService.getMyStore(ownerId);
    return successResponse(res, 'My store retrieved successfully', store);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getMyStore,
};
