const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'very_strong_secret_key_that_is_at_least_32_characters_long_and_random';

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
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token signature' });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Token not yet valid' });
    } else {
      return res.status(401).json({ message: 'Authentication error' });
    }
  }
};

module.exports = { verifyToken };
