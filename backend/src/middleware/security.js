const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const stripDangerousPatterns = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .replace(/\u0000/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .trim();
};

const deepSanitize = (target) => {
  if (Array.isArray(target)) {
    return target.map((item) => deepSanitize(item));
  }

  if (target && typeof target === 'object') {
    return Object.keys(target).reduce((acc, key) => {
      acc[key] = deepSanitize(target[key]);
      return acc;
    }, {});
  }

  return stripDangerousPatterns(target);
};

const sanitizeInput = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitize(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = deepSanitize(req.params);
  }

  next();
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 500),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later.',
  },
});

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'https:', 'data:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

module.exports = {
  globalLimiter,
  authLimiter,
  securityHeaders,
  sanitizeInput,
  hppMiddleware: hpp(),
};
