const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { pingHost, getSystemInfo, executeCommand } = require('../controllers/systemController');

router.get('/ping', verifyToken, pingHost);

router.get('/info', verifyToken, getSystemInfo);

router.post('/execute', verifyToken, executeCommand);

module.exports = router;