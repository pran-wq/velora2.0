import crypto from "crypto";

/**
 * Lightweight reusable helpers — pure functions, no side effects.
 */

// Cryptographically-random UUID v4.
export const generateId = () => crypto.randomUUID();

// Strip password (and any other secret) from a user object before returning to clients.
export const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

// Whole-number percentage; returns 0 if denominator is 0.
export const calculatePercentage = (num, den) =>
  den > 0 ? Math.round((Number(num) / Number(den)) * 100) : 0;

// ISO timestamp helper (UTC).
export const formatDate = (d = new Date()) =>
  (d instanceof Date ? d : new Date(d)).toISOString();

/**
 * Convert input to a finite number within [min, max].
 * Returns `fallback` when invalid.
 */
export const safeNumber = (value, { min = -Infinity, max = Infinity, fallback = null } = {}) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return fallback;
  return n;
};

// Clamp helper.
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Numeric average (returns 0 for empty arrays).
export const average = (nums) =>
  nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;

// Sort a list of objects by `createdAt` ISO string, ascending.
export const sortByCreatedAsc = (list) =>
  [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
