const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Change this to match the one in admin.js

const authMiddleware = (allowedRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Access denied: You do not have permission for this action.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

module.exports = authMiddleware;
