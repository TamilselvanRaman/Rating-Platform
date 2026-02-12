const ratingService = require('../services/rating.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const submitRating = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rating = await ratingService.submitRating(userId, req.body);
    return successResponse(res, 'Rating submitted successfully', rating, 201);
  } catch (error) {
    next(error);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const rating = await ratingService.updateRating(userId, id, req.body);
    return successResponse(res, 'Rating updated successfully', rating);
  } catch (error) {
    next(error);
  }
};

const getMyRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ratings = await ratingService.getMyRatings(userId);
    return successResponse(res, 'My ratings retrieved successfully', ratings);
  } catch (error) {
    next(error);
  }
};

const getRatingForStore = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const rating = await ratingService.getRatingForStore(userId, storeId);
    return successResponse(res, 'Rating for store retrieved successfully', rating);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  updateRating,
  getMyRatings,
  getRatingForStore,
};
