// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log("in auth:", req)
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) throw new Error('No token found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    console.log("User ID from token:", decoded.userId);
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).send('Not authorized');
  }
};

module.exports = auth;