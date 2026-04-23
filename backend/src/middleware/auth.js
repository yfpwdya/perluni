const jwt = require('jsonwebtoken');
const { User } = require('../models');

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  return user;
};

const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

const optionalProtect = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const user = await getUserFromToken(token);
    if (user && user.isActive) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'User role is not authorized to access this route',
    });
  }

  return next();
};

module.exports = { protect, optionalProtect, authorize };
