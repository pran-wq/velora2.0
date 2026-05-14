import helmet from "helmet";
import cors from "cors";

import { API_LIMITS } from "../utils/constants.js";

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

// Rate-limit presets — sourced from central constants.
export const RATE_LIMITS = {
  global: API_LIMITS.rateGlobal,
  auth: API_LIMITS.rateAuth,
  ai: API_LIMITS.rateAi,
};
