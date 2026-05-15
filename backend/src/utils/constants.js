/**
 * Centralized constants for Medora backend.
 * Single source of truth — avoid duplicating these literals in controllers.
 */

// ---- moods ----
export const MOODS = ["great", "good", "tired", "stressed", "low"];

// Wellness score contributions per mood (0–25 each, used by recovery scoring).
export const MOOD_SCORES = {
  great: 25,
  good: 20,
  tired: 12,
  stressed: 8,
  low: 5,
};

// ---- profile ----
export const GENDERS = ["male", "female", "other", "prefer_not_to_say"];

// ---- medications ----
export const MED_STATUSES = ["pending", "taken", "missed"];

export const MED_FREQUENCIES = [
  "once_daily",
  "twice_daily",
  "thrice_daily",
  "four_times_daily",
  "weekly",
  "as_needed",
];

// HH:MM (24h)
export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// ---- uploads ----
export const UPLOAD_LIMITS = {
  maxBytes: 5 * 1024 * 1024, // 5 MB
};

export const UPLOAD_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export const UPLOAD_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

// ---- recovery score ranges ----
export const RECOVERY_RANGES = {
  sleepHours: { min: 0, max: 24, optimalMin: 7, optimalMax: 9 },
  hydrationLevel: { min: 0, max: 10 },
  stepsTarget: 10000,
  scoreMin: 0,
  scoreMax: 100,
};

// ---- API / rate-limit / body-size limits ----
export const API_LIMITS = {
  jsonBody: "1mb",
  rateGlobal: { windowMs: 60_000, max: 120 },
  rateAuth: { windowMs: 15 * 60_000, max: 20 },
  rateAi: { windowMs: 60_000, max: 10 },
};

// ---- auth ----
export const AUTH = {
  saltRounds: 10,
  tokenTtl: "7d",
  minPasswordLength: 6,
};

// ---- shared default messages ----
export const MESSAGES = {
  notAuthenticated: "Missing or invalid Authorization header",
  invalidCredentials: "Invalid credentials",
  jwtMissing: "JWT_SECRET not configured",
  geminiMissing: "GEMINI_API_KEY not configured",
};

// Basic email format (matches existing authController behavior).
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
