const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'raksha-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    if (!admin.adminId) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = admin;
    next();
  });
};

module.exports = { authenticateToken, authenticateAdmin };

