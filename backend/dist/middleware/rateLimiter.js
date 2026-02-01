"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    let record = rateLimitStore.get(ip);
    // Reset if window has passed
    if (!record || record.resetTime < now) {
        record = { count: 0, resetTime: now + WINDOW_MS };
    }
    record.count++;
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    // Check if over limit
    if (record.count > MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds`,
        });
    }
    rateLimitStore.set(ip, record);
    next();
}
// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
        if (record.resetTime < now) {
            rateLimitStore.delete(ip);
        }
    }
}, WINDOW_MS);
//# sourceMappingURL=rateLimiter.js.map