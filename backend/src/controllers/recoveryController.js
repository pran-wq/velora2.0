import crypto from "crypto";

import {
  readJSON,
  appendItem,
  updateItem,
  removeItem,
} from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, created, ApiError } from "../utils/response.js";

const RECOVERY = "recovery";

const MOOD_SCORES = { great: 25, good: 20, tired: 12, stressed: 8, low: 5 };
const ALLOWED_MOODS = Object.keys(MOOD_SCORES);

// ---------- scoring helper ----------
// Lightweight wellness score in 0–100 from 4 equal-weight factors (25 each).
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const sleepPoints = (h) => {
  // optimal 7–9h => full 25; falls off linearly outside [4, 12]
  if (h >= 7 && h <= 9) return 25;
  if (h < 7) return clamp(((h - 4) / 3) * 25, 0, 25);
  return clamp(((12 - h) / 3) * 25, 0, 25);
};

const hydrationPoints = (level) => clamp((level / 10) * 25, 0, 25);
const stepsPoints = (steps) => clamp((steps / 10000) * 25, 0, 25);
const moodPoints = (mood) => MOOD_SCORES[mood] ?? 0;

export const computeWellnessScore = ({ sleepHours, hydrationLevel, steps, mood }) =>
  Math.round(
    sleepPoints(sleepHours) +
      hydrationPoints(hydrationLevel) +
      stepsPoints(steps) +
      moodPoints(mood)
  );

// ---------- validation ----------
const validateEntry = (body, partial = false) => {
  const { sleepHours, hydrationLevel, steps, mood, notes } = body || {};
  const patch = {};

  if (sleepHours !== undefined) {
    const n = Number(sleepHours);
    if (!Number.isFinite(n) || n < 0 || n > 24)
      throw new ApiError("sleepHours must be 0–24", 400);
    patch.sleepHours = n;
  } else if (!partial) throw new ApiError("sleepHours is required", 400);

  if (hydrationLevel !== undefined) {
    const n = Number(hydrationLevel);
    if (!Number.isFinite(n) || n < 0 || n > 10)
      throw new ApiError("hydrationLevel must be 0–10", 400);
    patch.hydrationLevel = n;
  } else if (!partial) throw new ApiError("hydrationLevel is required (0–10)", 400);

  if (steps !== undefined) {
    const n = Number(steps);
    if (!Number.isInteger(n) || n < 0)
      throw new ApiError("steps must be a non-negative integer", 400);
    patch.steps = n;
  } else if (!partial) throw new ApiError("steps is required", 400);

  if (mood !== undefined) {
    if (typeof mood !== "string" || !ALLOWED_MOODS.includes(mood))
      throw new ApiError(`mood must be one of: ${ALLOWED_MOODS.join(", ")}`, 400);
    patch.mood = mood;
  } else if (!partial) throw new ApiError("mood is required", 400);

  if (notes !== undefined) {
    if (notes !== null && typeof notes !== "string")
      throw new ApiError("notes must be a string", 400);
    patch.notes = notes ? notes.trim() : null;
  }

  return patch;
};

// ---------- helpers ----------
const findOwned = async (id, userId) => {
  const all = await readJSON(RECOVERY, []);
  const entry = all.find((e) => e.id === id);
  if (!entry || entry.userId !== userId)
    throw new ApiError("Recovery entry not found", 404);
  return entry;
};

// ---------- handlers ----------

// POST /api/recovery
export const addRecovery = asyncHandler(async (req, res) => {
  const fields = validateEntry(req.body, false);

  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    ...fields,
    notes: fields.notes ?? null,
    wellnessScore: computeWellnessScore(fields),
    createdAt: new Date().toISOString(),
  };

  await appendItem(RECOVERY, entry);
  return created(res, { entry }, "Recovery entry added");
});

// GET /api/recovery
export const getRecovery = asyncHandler(async (req, res) => {
  const all = await readJSON(RECOVERY, []);
  const mine = all
    .filter((e) => e.userId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return success(res, { entries: mine }, "Recovery entries fetched");
});

// PUT /api/recovery/:id
export const updateRecovery = asyncHandler(async (req, res) => {
  const existing = await findOwned(req.params.id, req.user.id);

  const patch = validateEntry(req.body, true);
  if (Object.keys(patch).length === 0)
    throw new ApiError("No valid fields provided to update", 400);

  const merged = { ...existing, ...patch };
  patch.wellnessScore = computeWellnessScore(merged);
  patch.updatedAt = new Date().toISOString();

  const updated = await updateItem(
    RECOVERY,
    (e) => e.id === req.params.id && e.userId === req.user.id,
    patch
  );
  return success(res, { entry: updated }, "Recovery entry updated");
});

// DELETE /api/recovery/:id
export const deleteRecovery = asyncHandler(async (req, res) => {
  await findOwned(req.params.id, req.user.id);
  await removeItem(
    RECOVERY,
    (e) => e.id === req.params.id && e.userId === req.user.id
  );
  return success(res, { id: req.params.id }, "Recovery entry deleted");
});
