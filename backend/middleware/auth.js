const jwt = require('jsonwebtoken');

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
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    // Weak error handling - might accept invalid tokens
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };