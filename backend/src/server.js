import express from "express";
import dotenv from "dotenv";

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security (helmet + cors) — must be early
app.use(...securityMiddlewares);

// Body parsers
app.use(express.json({ limit: API_LIMITS.jsonBody }));
app.use(express.urlencoded({ extended: true, limit: API_LIMITS.jsonBody }));

// Global rate limit
app.use(rateLimit(RATE_LIMITS.global));

// Test routes
app.get("/", (req, res) => {
  res.send("Medora Backend Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes (stricter limits on auth + AI)
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

app.listen(PORT, () => {
  console.log(`Medora backend listening on http://localhost:${PORT}`);
});
