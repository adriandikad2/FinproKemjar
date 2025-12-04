const activityLogger = require('../utils/activityLogger');

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Log the request
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log activity if user is authenticated
  if (req.user) {
    activityLogger.logActivity(req.user.id, `${method} ${url}`, {
      ip,
      userAgent: req.get('User-Agent'),
      timestamp
    });
  }

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} - ${JSON.stringify(data).substring(0, 100)}...`);
    return originalJson.call(this, data);
  };

  next();
};

module.exports = logger;