const rateLimit = require('express-rate-limit');

const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each user/IP to 5 requests per windowMs
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  message: { message: 'Batas pengiriman pesan tercapai, silakan coba lagi setelah 10 menit' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { contactRateLimiter };
