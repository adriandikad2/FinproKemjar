const { exec } = require('child_process');
const activityLogger = require('../utils/activityLogger');

const pingHost = async (req, res) => {
  try {
    const { host } = req.query;

    if (!host) {
      return res.status(400).json({ message: 'Host parameter is required' });
    }

    // Log the ping attempt
    activityLogger.logActivity(req.user.id, 'Ping host attempted', {
      host,
      ip: req.ip
    });

    // VULNERABLE COMMAND INJECTION
    // Direct use of user input in exec() without any sanitization
    // Example exploit: /api/system/ping?host=example.com; cat /etc/passwd
    // Or: /api/system/ping?host=example.com && whoami
    exec(`ping  ${host}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Ping error:', error);
        return res.status(500).json({
          message: 'Ping failed',
          error: stderr || error.message,
          host
        });
      }

      res.json({
        message: 'Ping successful',
        result: stdout,
        host
      });
    });

  } catch (error) {
    console.error('System ping error:', error);
    res.status(500).json({ message: 'Server error during ping' });
  }
};

const getSystemInfo = async (req, res) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Log admin action
    activityLogger.logActivity(req.user.id, 'System info accessed', {
      ip: req.ip
    });

    // Safe system info (not vulnerable)
    const systemInfo = {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.json({
      message: 'System info retrieved',
      systemInfo
    });

  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const executeCommand = async (req, res) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ message: 'Command parameter is required' });
    }

    // Log admin command execution
    activityLogger.logActivity(req.user.id, 'Command executed', {
      command: command.substring(0, 100), // Log first 100 chars
      ip: req.ip
    });

    // POTENTIALLY VULNERABLE - but restricted to admin
    // In a real scenario, this could be vulnerable if admin input is not sanitized
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Command execution error:', error);
        return res.status(500).json({
          message: 'Command execution failed',
          error: stderr || error.message
        });
      }

      res.json({
        message: 'Command executed successfully',
        output: stdout,
        command
      });
    });

  } catch (error) {
    console.error('Execute command error:', error);
    res.status(500).json({ message: 'Server error during command execution' });
  }
};

module.exports = {
  pingHost,
  getSystemInfo,
  executeCommand
};