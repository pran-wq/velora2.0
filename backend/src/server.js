import express from "express";
import cors from "cors";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get("/", (req, res) => {
  res.send("Medora Backend Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/ai", aiRoutes);
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
