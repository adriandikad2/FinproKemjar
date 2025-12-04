const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');

router.get('/profile', verifyToken, getProfile);

router.put('/profile', verifyToken, updateProfile);

router.get('/all', verifyToken, getAllUsers);

module.exports = router;