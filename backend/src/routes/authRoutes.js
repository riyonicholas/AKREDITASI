const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Endpoint: POST /api/auth/login
router.post('/login', authController.login);

// Endpoint: POST /api/auth/change-password
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;