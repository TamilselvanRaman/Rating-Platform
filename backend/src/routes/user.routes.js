const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { createUserSchema, validate } = require('../middleware/validation.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);

module.exports = router;
