const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

const viewCountLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  skipFailedRequests: true,
  keyGenerator: (req) => `${req.ip}-${req.params.chapterId}`,
});

module.exports = {
  authLimiter,
  viewCountLimiter,
};
