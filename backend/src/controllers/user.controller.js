const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const getAllUsers = async (req, res, next) => {
  try {
    const filters = req.query;
    const users = await userService.getAllUsers(filters);
    return successResponse(res, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return successResponse(res, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 'User created successfully', user, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
