const { spawn } = require('child_process');
const activityLogger = require('../utils/activityLogger');

const pingHost = async (req, res) => {
  try {
    const { host } = req.query;

    if (!host) {
      return res.status(400).json({ message: 'Host parameter is required' });
    }
    
    const hostPattern = /^[a-zA-Z0-9.-]+$/;
    if (!hostPattern.test(host)) {
      return res.status(400).json({ message: 'Invalid host format' });
    }

    const dangerousPatterns = [';', '&&', '||', '|', '`', '$', '>', '<', '>>'];
    if (dangerousPatterns.some(pattern => host.includes(pattern))) {
      return res.status(400).json({ message: 'Invalid characters in host parameter' });
    }

    activityLogger.logActivity(req.user.id, 'Ping host attempted', {
      host,
      ip: req.ip
    });

    const child = spawn('ping', [host]);

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          message: 'Ping failed',
          error: errorOutput,
          host
        });
      }

      res.json({
        message: 'Ping successful',
        result: output,
        host
      });
    });

    child.on('error', (error) => {
      res.status(500).json({
        message: 'Failed to execute ping command',
        error: error.message,
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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    activityLogger.logActivity(req.user.id, 'System info accessed', {
      ip: req.ip
    });
    
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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ message: 'Command parameter is required' });
    }

    activityLogger.logActivity(req.user.id, 'Command executed', {
      command: command.substring(0, 100),
      ip: req.ip
    });
    
    const commandPattern = /^[a-zA-Z0-9\s/_.-]+$/;
    if (!commandPattern.test(command)) {
      return res.status(400).json({ message: 'Invalid command format' });
    }

    const dangerousPatterns = [';', '&&', '||', '|', '`', '$', '>', '<', '>>', '&', 'exec', 'eval', 'system'];
    if (dangerousPatterns.some(pattern => command.includes(pattern))) {
      return res.status(400).json({ message: 'Dangerous command patterns detected' });
    }

    const cmd = command.split(' ')[0];
    const args = command.split(' ').slice(1);

    const child = spawn(cmd, args, { shell: false });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          message: 'Command execution failed',
          error: errorOutput,
          command
        });
      }

      res.json({
        message: 'Command executed successfully',
        output: output,
        command: command
      });
    });

    child.on('error', (error) => {
      res.status(500).json({
        message: 'Failed to execute command',
        error: error.message,
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