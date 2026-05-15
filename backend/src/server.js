import express from "express";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import { UPLOAD_DIR } from "./middleware/uploadMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { rateLimit } from "./middleware/rateLimiter.js";
import { securityMiddlewares, RATE_LIMITS } from "./config/security.js";
import { API_LIMITS } from "./utils/constants.js";
import { API_DOCS } from "./config/apiDocs.js";
import { FRONTEND_INTEGRATION } from "./config/frontendIntegration.js";
import { DEMO_MODE, DEMO_SAMPLES } from "./config/demoConfig.js";
import { success } from "./utils/response.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const START_TIME = Date.now();

// Security (helmet + cors) — must be early
app.use(...securityMiddlewares);

// Body parsers
app.use(express.json({ limit: API_LIMITS.jsonBody }));
app.use(express.urlencoded({ extended: true, limit: API_LIMITS.jsonBody }));

// Lightweight request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const tag = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    logger[tag](`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Global rate limit
app.use(rateLimit(RATE_LIMITS.global));

// ---------- public meta routes ----------
app.get("/", (req, res) => res.send("Medora Backend Running"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/health/details", async (req, res) => {
  // storage check
  const dataDir = path.join(UPLOAD_DIR, "..", "data");
  let storageOk = true;
  try {
    await fs.access(dataDir).catch(async () => {
      await fs.mkdir(dataDir, { recursive: true });
    });
  } catch {
    storageOk = false;
  }

  const aiConfigured =
    !!process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here";

  res.json({
    status: "ok",
    uptimeSec: Math.round((Date.now() - START_TIME) / 1000),
    env: process.env.NODE_ENV || "development",
    demoMode: DEMO_MODE,
    services: {
      storage: storageOk ? "ok" : "unavailable",
      ai: aiConfigured ? "configured" : "not_configured",
      auth: process.env.JWT_SECRET ? "configured" : "not_configured",
    },
    version: API_DOCS.version,
    timestamp: new Date().toISOString(),
  });
});

// Frontend-discoverable API catalogue
app.get("/api/docs", (req, res) => success(res, API_DOCS, "API documentation"));

// Frontend integration cookbook (auth flow, snippets, pitfalls)
app.get("/api/integration", (req, res) =>
  success(res, FRONTEND_INTEGRATION, "Frontend integration guide")
);

// Demo / mock data (always available so frontend can render empty-state previews)
app.get("/api/demo", (req, res) =>
  success(res, { demoMode: DEMO_MODE, samples: DEMO_SAMPLES }, "Demo samples")
);

// ---------- API routes (stricter limits on auth + AI) ----------
app.use("/api/auth", rateLimit(RATE_LIMITS.auth), authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/ai", rateLimit(RATE_LIMITS.ai), aiRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);

// Static: serve uploaded files (read-only)
app.use("/uploads", express.static(UPLOAD_DIR));

// 404 + centralized error handler (must be last)
app.use(notFound);
app.use(errorHandler);

// ---------- process-level safety nets ----------
process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED_REJECTION:", reason?.message || reason);
});
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT_EXCEPTION:", err?.message || err);
});

app.listen(PORT, () => {
  logger.info(`Medora backend listening on http://localhost:${PORT}`);
  if (DEMO_MODE) logger.info("DEMO_MODE is ON — samples available at GET /api/demo");
});
