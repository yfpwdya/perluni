const rateLimit = require('express-rate-limit');

const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  keyGenerator: (req) => {
    return req.user ? String(req.user.id) : (req.ip || 'unknown');
  },
  message: { message: 'Batas pengiriman pesan tercapai, silakan coba lagi setelah 10 menit' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

module.exports = { contactRateLimiter };
