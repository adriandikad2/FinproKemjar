const jwt = require('jsonwebtoken');

// INSECURE JWT SECRET - HARDCODED
const JWT_SECRET = 'secret123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // INSECURE JWT VERIFICATION - NO PROPER VALIDATION
    // Only uses jwt.verify() without additional checks
    const decoded = jwt.verify(token, JWT_SECRET);

    // No expiration check - tokens never expire
    // Simple payload structure
    req.user = decoded;
    next();
  } catch (error) {
    // Weak error handling - might accept invalid tokens
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };