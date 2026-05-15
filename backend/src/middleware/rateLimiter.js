import { ApiError } from "../utils/response.js";

/**
 * Lightweight in-memory sliding-window rate limiter.
 * Keyed by client IP. NOT for multi-instance deployments.
 *
 * Usage:
 *   const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 20 });
 *   app.use("/api/auth", authLimiter, authRoutes);
 */
export const rateLimit = ({
  windowMs = 60_000,
  max = 60,
  message = "Too many requests, please try again later.",
} = {}) => {
  const hits = new Map(); // key -> number[] (timestamps within window)

  // periodic cleanup so memory doesn't grow indefinitely
  setInterval(() => {
    const now = Date.now();
    for (const [k, times] of hits) {
      const fresh = times.filter((t) => now - t < windowMs);
      if (fresh.length) hits.set(k, fresh);
      else hits.delete(k);
    }
  }, windowMs).unref?.();

  return (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    const times = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (times.length >= max) {
      const retryAfter = Math.ceil((windowMs - (now - times[0])) / 1000);
      res.set("Retry-After", String(retryAfter));
      return next(new ApiError(message, 429));
    }

    times.push(now);
    hits.set(key, times);

    res.set("X-RateLimit-Limit", String(max));
    res.set("X-RateLimit-Remaining", String(Math.max(0, max - times.length)));
    next();
  };
};

export default rateLimit;
