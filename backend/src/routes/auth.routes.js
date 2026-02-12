const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema, updatePasswordSchema, validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.put('/password', authenticate, validate(updatePasswordSchema), authController.updatePassword);

module.exports = router;
