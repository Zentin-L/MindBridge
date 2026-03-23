const rateLimit = require('express-rate-limit');

// Rate limiter: 20 requests per 15 minutes per IP
const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many analysis requests, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

module.exports = {
  analyzeRateLimiter,
};
