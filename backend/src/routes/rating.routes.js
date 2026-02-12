const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { ratingSchema, validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication (USER role implied by logic but any auth user can rate?)
// Requirement says "Normal User Features" -> Submit rating.
// Let's restrict to USER role ideally, or just Authenticated.
// For now, authenticate is enough, but logic might want to prevent Store Owners from rating?
// Requirement doesn't explicitly forbid Store Owner from rating other stores.
// Let's keep it open to authenticated users.

router.use(authenticate);

router.post('/', validate(ratingSchema), ratingController.submitRating);
router.put('/:id', ratingController.updateRating); // validate body manually or partial schema? simplified for now
router.get('/my', ratingController.getMyRatings);
router.get('/store/:storeId', ratingController.getRatingForStore);

module.exports = router;
