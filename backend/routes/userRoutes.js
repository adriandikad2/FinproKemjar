const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');

// GET /api/user/profile - Get user profile (protected)
router.get('/profile', verifyToken, getProfile);

// PUT /api/user/profile - Update user profile (protected)
router.put('/profile', verifyToken, updateProfile);

// GET /api/user/all - Get all users (admin only)
router.get('/all', verifyToken, getAllUsers);

module.exports = router;