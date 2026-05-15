import { asyncHandler } from "../utils/asyncHandler.js";
import { success, ApiError } from "../utils/response.js";
import { generateContent } from "../services/geminiService.js";
import { sanitizeAiInput } from "../utils/sanitizeAiInput.js";
import {
  wellnessSummaryPrompt,
  recoveryInsightPrompt,
  motivationPrompt,
  AI_DISCLAIMER,
} from "../utils/promptTemplates.js";
import { MOODS } from "../utils/constants.js";

// ---------- light validators ----------
const reqNum = (v, name, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max)
    throw new ApiError(`${name} must be a number between ${min} and ${max}`, 400);
  return n;
};

const reqMood = (v) => {
  if (typeof v !== "string" || !MOODS.includes(v))
    throw new ApiError(`mood must be one of: ${MOODS.join(", ")}`, 400);
  return v;
};

// ---------- POST /api/ai/wellness-summary ----------
export const wellnessSummary = asyncHandler(async (req, res) => {
  const body = sanitizeAiInput(req.body || {});
  const data = {
    sleepHours: reqNum(body.sleepHours, "sleepHours", 0, 24),
    hydrationLevel: reqNum(body.hydrationLevel, "hydrationLevel", 0, 10),
    steps: reqNum(body.steps, "steps", 0, 100000),
    wellnessScore: reqNum(body.wellnessScore, "wellnessScore", 0, 100),
    mood: reqMood(body.mood),
  };

  const text = await generateContent(wellnessSummaryPrompt(data));
  return success(res, { insight: text, disclaimer: AI_DISCLAIMER }, "Wellness summary generated");
});

// ---------- POST /api/ai/recovery-insight ----------
export const recoveryInsight = asyncHandler(async (req, res) => {
  const body = sanitizeAiInput(req.body || {});
  const data = {
    sleepHours: reqNum(body.sleepHours, "sleepHours", 0, 24),
    hydrationLevel: reqNum(body.hydrationLevel, "hydrationLevel", 0, 10),
    steps: reqNum(body.steps, "steps", 0, 100000),
    wellnessScore: reqNum(body.wellnessScore, "wellnessScore", 0, 100),
    adherenceRate: reqNum(body.adherenceRate, "adherenceRate", 0, 100),
    mood: reqMood(body.mood),
  };

  const text = await generateContent(recoveryInsightPrompt(data));
  return success(res, { insight: text, disclaimer: AI_DISCLAIMER }, "Recovery insight generated");
});

// ---------- POST /api/ai/motivation ----------
export const motivation = asyncHandler(async (req, res) => {
  const body = sanitizeAiInput(req.body || {});
  const data = {
    mood: reqMood(body.mood),
    recoveryScore: reqNum(body.recoveryScore, "recoveryScore", 0, 100),
  };

  const text = await generateContent(motivationPrompt(data));
  return success(res, { message: text, disclaimer: AI_DISCLAIMER }, "Motivation generated");
});
