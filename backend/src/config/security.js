import helmet from "helmet";
import cors from "cors";

/**
 * Centralized security middleware setup.
 * Mount early in server.js: app.use(...securityMiddlewares).
 */

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  maxAge: 600,
};

const helmetOptions = {
  // Disable CSP — too restrictive for an API serving uploads from /uploads.
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
};

export const securityMiddlewares = [helmet(helmetOptions), cors(corsOptions)];

// Rate-limit presets — tune via env if needed.
export const RATE_LIMITS = {
  global: { windowMs: 60_000, max: 120 }, // 120 req/min/ip
  auth: { windowMs: 15 * 60_000, max: 20 }, // 20 req / 15 min / ip
  ai: { windowMs: 60_000, max: 10 }, // 10 req/min/ip
};
