const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { pingHost, getSystemInfo, executeCommand } = require('../controllers/systemController');

// GET /api/system/ping - Ping a host (vulnerable to command injection)
router.get('/ping', verifyToken, pingHost);

// GET /api/system/info - Get system info (admin only)
router.get('/info', verifyToken, getSystemInfo);

// POST /api/system/execute - Execute system command (admin only)
router.post('/execute', verifyToken, executeCommand);

module.exports = router;